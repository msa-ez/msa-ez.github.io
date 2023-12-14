---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# 파일공유를 위한 NAS 스토리지 생성과 설정

## 주문서비스에 NFS 연결하기

이번 랩에서는 여러 마이크로서비스간 파일 공유를 위해 일반적으로 NAS(Network Attached Storage)로 알려진 NFS 파일시스템을 AWS 클라우드에 생성하고, 이를 주문서비스에서 마운트시켜 스토리지로 활용하는 예제를 실습한다.

먼저, emptyDir, hostPath 유형에 실습한다.

### EmptyDir Volume

- 한 Pod 내에서 컨테이너들간 공유가능한 볼륨 유형이다.
- 먼저, 아래 YAML로 Volume을 생성한다.
```
kubectl apply -f -<<EOF
apiVersion: v1
kind: Pod
metadata:
  name: shared-volumes
spec:
  containers:
  - image: redis
    name: redis
    volumeMounts:
    - name: shared-storage
      mountPath: /data/shared
  - image: nginx
    name: nginx
    volumeMounts:
    - name: shared-storage
      mountPath: /data/shared
  volumes:
  - name: shared-storage
    emptyDir: {}
EOF
```

- Pod내 한 컨테이너에서 생성한 볼륨이 다른 컨테이너에서 가시적인지 확인한다.
```
kubectl exec -it shared-volumes --container redis -- /bin/bash
cd /data/shared
echo test… > test.txt
exit
```
```
kubectl exec -it shared-volumes --container nginx -- /bin/bash
cd /data/shared
ls
```


### HostPath Volume

- 예제는 컨테이너가 바인딩된 워커노드의 /tmp 폴더를 공유하는 설정이다.
- 먼저, 아래 YAML로 Volume을 생성한다.
```
kubectl apply -f -<<EOF
apiVersion: v1
kind: Pod
metadata:
  name: hostpath
spec:
  containers:
  - name: redis
    image: redis
    volumeMounts:
    - name: somepath
      mountPath: /data/shared
  volumes:
  - name : somepath
    hostPath:
      path: /tmp
      type: Directory
EOF
```

- 컨테이너로 접속하여 마운트된 볼륨을 확인한다.
```
kubectl exec -it pod/hostpath -- /bin/sh
ls -al /data/shared
```


### 주문서비스에 NFS Volume 연동 순서
```
1. EFS 파일시스템 생성 
2. Kubernetes 서비스 계정과 IAM 역할 연결
3. Cluster에 EFS CSI 드라이버 설치 
4. EFS csi Driver로 StorageClass 생성 
5. PVC 생성 및 Pod에 연결 
```

### Helm must be installed on My Machine

- Helm 3.x 설치(권장)
```
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```

## EFS IAM Policy 생성(DO NOT run following two commands, Admin Only)
 
- IAM에 보안자격증명으로 사용가능한 EFS 정책을 설정한다. 

```
# Download the IAM policy document (Cloud Administrator Only)
curl -S https://raw.githubusercontent.com/kubernetes-sigs/aws-efs-csi-driver/master/docs/iam-policy-example.json -o iam-policy.json

# Create an IAM policy (Cloud Administrator Only)
aws iam create-policy \
  --policy-name EFSCSIControllerIAMPolicy \
  --policy-document file://iam-policy.json 
```

### 1. EFS 파일시스템 생성

- 관리콘솔에 접속하여, 'EFS' 서비스 이름으로 검색한다.
- EFS 서비스에서 파일 시스템을 생성한다.
- 이후, 교재를 참고하여 보안그룹을 추가 구성한다.
  - 파일시스템 > 네트워크 탭에서 가용영역별 ClusterSharedNodeSecurityGroup 추가
- 생성된 파일시스템 Id(fs-xxxxxxxxxx)를 복사한다.


### 2. Kubernetes 서비스 계정과 IAM 역할 연결

- 구성에 필요한 환경변수를 설정한다.
```
export AWS_ROOT_UID=xxxxxxxxxx
export REGION=xxxxxxxxxx
export CLUSTER_NAME=xxxxxxxxxx
export FILE_SYSTEM_ID=fs-xxxxxxxxxx
```

```
# AWS_ROOT_UID는 다음 Command로 찾을 수 있다.
aws sts get-caller-identity --query Account --output text
```

- Kubernetes에 SA를 생성하고, 이를 IAM 정책과 연결한다.

```
eksctl create iamserviceaccount \
  --override-existing-serviceaccounts \
  --region $REGION \
  --name efs-csi-controller-sa \
  --namespace kube-system \
  --cluster $CLUSTER_NAME \
  --attach-policy-arn arn:aws:iam::$AWS_ROOT_UID:policy/EFSCSIControllerIAMPolicy \
  --approve 
```

### 3. Cluster에 EFS CSI 드라이버 설치 

- Region별 드라이버 설치 이미지 레지스트리를 복사한다. 
```
# 이미지 저장소 참고사이트 : https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/add-ons-images.html
```
![image](https://github.com/acmexii/demo/assets/35618409/8829fd8f-c1bd-4aee-82ce-5d5887248810)

- 복사한 레지스트리를 아래, [리전별 이미지 저장소]에 붙여넣고, 실행한다. ([] 삭제)

```
helm repo add aws-efs-csi-driver https://kubernetes-sigs.github.io/aws-efs-csi-driver
helm repo update
helm upgrade -i aws-efs-csi-driver aws-efs-csi-driver/aws-efs-csi-driver \
  --namespace kube-system \
  --set image.repository=[리전별 이미지 저장소]/eks/aws-efs-csi-driver \
  --set controller.serviceAccount.create=false \
  --set controller.serviceAccount.name=efs-csi-controller-sa
```


### 4. EFS csi Driver로 StorageClass 생성 

- 설치한 CSI 드라이버로 StorageClass를 등록한다. 
```
kubectl apply -f - <<EOF
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: efs-sc
provisioner: efs.csi.aws.com
parameters:
  provisioningMode: efs-ap
  fileSystemId: $FILE_SYSTEM_ID
  directoryPerms: "700"
EOF
```

- EFS를 위한 Provisioner가 추가되어 사용 가능하다.
```
kubectl get storageclass
```
- 추가된 efs-sc 스토리지 클래스가 기존 ebs-sc와 함께 조회된다.

### 5. PVC 생성 및 Pod에 연결 
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-pvc
  labels:
    app: test-pvc
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 1Mi
  storageClassName: efs-sc
EOF
```


#### 생성된 pvc 조회
```
kubectl get pvc
```
- 아래와 같은 결과가 출력되었는지 확인한다.
```
NAME      STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
nfs-pvc   Bound                                        aws-efs        59s
```

####  NFS 볼륨을 가지는 주문마이크로서비스 배포

```
kubectl apply -f - <<EOF
apiVersion: "apps/v1"
kind: "Deployment"
metadata: 
  name: order
  labels: 
    app: "order"
spec: 
  selector: 
    matchLabels: 
      app: "order"
  replicas: 1
  template: 
    metadata: 
      labels: 
        app: "order"
    spec: 
      containers: 
      - name: "order"
        image: "ghcr.io/acmexii/order-liveness:latest"
        ports: 
          - containerPort: 80
        volumeMounts:
          - mountPath: "/mnt/data"
            name: volume
      volumes:
      - name: volume
        persistentVolumeClaim:
          claimName: nfs-pvc  
EOF
```

- 배포 후 주문 컨테이너에 접속하여 제대로 파일시스템이 마운트되었는지 확인한다.
```
kubectl get all
kubectl exec -it [pod/ORDER POD 객체] -- /bin/sh
cd /mnt/data
echo "NFS Strorage Test.. " > test.txt
```

- 이후, 주문서비스를 2개로 Scale Out하고 확장된 주문 서비스에서도 test.txt가 확인되는지 검증한다.
- 또한, 2번째 컨테이너에서도 리소스를 생성해 본다. (ReadWriteMany)
```
kubectl scale deploy order --replicas=2
kubectl exec -it [pod/ORDER POD 객체] -- /bin/sh
ls /mnt/data
echo "NFS Strorage Test2.. " > test2.txt
```
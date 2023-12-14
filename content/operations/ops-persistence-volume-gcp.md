---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# 파일공유를 위한 클라우드 스토리지 활용(GCP)

## 주문서비스에 파일공유를 위한 NFS 연결하기

이번 랩에서는 여러 마이크로서비스간 파일 공유를 위해 일반적으로 NAS(Network Attached Storage)로 알려진 GCP 파일시스템을 클라우드에 설정하고, 이를 주문서비스에서 마운트시켜 비정형 정보 저장소로 활용하는 예제를 실습한다.


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

### NFS 스토리지(Filestore) 사용

여러 컨테이너에서 사용가능(ReadWriteMany)한 GCP 네트워크 볼륨을 사용설정하고, 이를 컨테이너에서 활용하는 예제를 실습해 본다. 

- 먼저, 기본 CSI(Container Storage Interface)목록을 확인한다.  
```
kubectl get storageclass
```
```
NAME                     PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   
premium-rwo              pd.csi.storage.gke.io   Delete          WaitForFirstConsumer   true                   
standard                 kubernetes.io/gce-pd    Delete          Immediate              true                   
standard-rwo (default)   pd.csi.storage.gke.io   Delete          WaitForFirstConsumer   true                     
```

#### ReadWriteMany(rwx)가 가능한 Filestore 사용설정

- 브라우저 아래 링크로 접속하여 Filestore API를 활성화 한다.
```
https://cloud.google.com/filestore/docs/install?hl=ko
```

- 생성한 클러스터에도 CSI Driver(Provisioner)를 활성화 한다.
```
gcloud container clusters update [CLUSTER-NAME] --update-addons=GcpFilestoreCsiDriver=ENABLED
```
- 성공적으로 작업이 종료되면, "Updated ~~" 로그가 출력된다.


- 다시, CSI(Container Storage Interface) 목록을 확인해 보자.  
```
kubectl get storageclass
```
```
NAME                        PROVISIONER                    RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   
enterprise-multishare-rwx   filestore.csi.storage.gke.io   Delete          WaitForFirstConsumer   true                   
enterprise-rwx              filestore.csi.storage.gke.io   Delete          WaitForFirstConsumer   true                   
premium-rwo                 pd.csi.storage.gke.io          Delete          WaitForFirstConsumer   true                   
premium-rwx                 filestore.csi.storage.gke.io   Delete          WaitForFirstConsumer   true                   
standard                    kubernetes.io/gce-pd           Delete          Immediate              true                   
standard-rwo (default)      pd.csi.storage.gke.io          Delete          WaitForFirstConsumer   true                   
standard-rwx                filestore.csi.storage.gke.io   Delete          WaitForFirstConsumer   true                   
zonal-rwx                   filestore.csi.storage.gke.io   Delete          WaitForFirstConsumer   true                   
```
- filestore CSI의 rwx가 가능한 추가 목록들이 조회된다.

####

- 아래 YAML로 PVC(Persistence Volume Claim)를 생성하자.
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: filestore
spec:
  accessModes:
  - ReadWriteMany
  storageClassName: standard-rwx
  resources:
    requests:
      storage: 5Gi
EOF
```
```
kubectl get pvc
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
          claimName: filestore
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

### Restriction
- Filestore comes with minimum 1TB storage volume.
- 월 비용확인 : https://cloud.google.com/filestore/pricing?hl=ko
  - standard 타입인 경우 : 1024GiB * $0.18 (per GiB) = $184.32

### Filestore CSI 드라이버 사용 중지
- 아래 명령으로 기존 Autopilot 또는 Standard 클러스터에서 Filestore CSI 드라이버를 사용 중지할 수 있다.
```
gcloud container clusters update [CLUSTER-NAME] --update-addons=GcpFilestoreCsiDriver=DISABLED --region/zone [REGION/ZONE]
```
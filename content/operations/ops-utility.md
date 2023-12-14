---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# 쿠버네티스 유틸리티

### Helm(k8s 패키지 인스톨러) 설치

- Helm 3.x 설치(권장)
```
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```

### Helm으로 Kafka 설치 (namspace없이)

- Kafka 설치 차트를 Helm에 등록하고 업데이트 한다.
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```
- Helm으로 bitnami/kafka 차트 업데이트 후 설치하면 3.5.1 이상의 App Version으로 설치된다.
- 3.5.1 이후 강화된 보안 정책에 따라, 마이크로서비스, Console Producer, 또는 Consumer로 접속하려면 추가 조치가 필요하다.
- 3.5.1 미만 버전을 설치하기 위해서는 Bitnami/kafka 차트 버전을 명시적으로 기입하여야 한다.
```
# Retrieve Kafka All Chart & App versions
helm search repo bitnami/kafka --versions

# Confirm Kafka latest Chart & App version
helm search repo bitnami/kafka
```

- 하위 호환 버전으로 설치하기 (Recommended)
```
helm install my-kafka bitnami/kafka --version 23.0.5
```
- 3.5.0 버전의 Kafka App이 설치된다.

- Kafka Client로 메시지 확인하기 (namspace없이)
```
kubectl run my-kafka-client --restart='Never' --image docker.io/bitnami/kafka:3.5.0-debian-11-r21 --namespace default --command -- sleep infinity
kubectl exec --tty -i my-kafka-client --namespace default -- bash

 # PRODUCER:
     kafka-console-producer.sh \
         --broker-list my-kafka-0.my-kafka-headless.default.svc.cluster.local:9092 \
         --topic modelforops

 # CONSUMER:
     kafka-console-consumer.sh \
         --bootstrap-server my-kafka.default.svc.cluster.local:9092 \
         --topic modelforops \
         --from-beginning
```

### [참고] When Install Kafka 3.5.1, or higher.

- Local에 접속에 필요한 보안환경 구성화일을 로컬에 client.properties 이름으로 생성한다. 
```
security.protocol=SASL_PLAINTEXT
sasl.mechanism=SCRAM-SHA-256
sasl.jaas.config=org.apache.kafka.common.security.scram.ScramLoginModule required \
    username="user1" \
    password="$(kubectl get secret my-kafka-user-passwords --namespace default -o jsonpath='{.data.client-passwords}' | base64 -d | cut -d , -f 1)";
```

- 생성된 구성파일을 Kafka Client 컨테이너로 복사후 이를 통해 접속한다.
```
 kubectl run my-kafka-client --restart='Never' --image docker.io/bitnami/kafka:3.5.1-debian-11-r16 --namespace default --command -- sleep infinity
 kubectl cp --namespace default ./client.properties my-kafka-client:/tmp/client.properties
 kubectl exec --tty -i my-kafka-client --namespace default -- bash

 # PRODUCER:
     kafka-console-producer.sh \
         --producer.config /tmp/client.properties \
         --broker-list my-kafka-controller-0.my-kafka-controller-headless.default.svc.cluster.local:9092 \
         --topic test

# CONSUMER:
     kafka-console-consumer.sh \
         --consumer.config /tmp/client.properties \
         --bootstrap-server my-kafka.default.svc.cluster.local:9092 \
         --topic test \
         --from-beginning
```

### HTTPie Pod (http ONLY)
```
cat <<EOF | kubectl apply -f -
apiVersion: "v1"
kind: "Pod"
metadata: 
  name: httpie
  labels: 
    name: httpie
spec: 
  containers: 
    - 
      name: httpie
      image: clue/httpie
      command:
        - sleep
        - "36000"
EOF
```

- 생성후, 접속:
```
kubectl exec -it httpie bin/bash
```

### Seige (siege, http) Pod

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: siege
spec:
  containers:
  - name: siege
    image: apexacme/siege-nginx
EOF
```

- 생성후, 접속:
```
kubectl exec -it siege bin/bash
```

### EBS CSI Driver install on EKS v1.23, or higher

- 먼저, 설치에 필요한 내 클러스터 정보를 설정한다.

```
export REGION=my-region-code
export CLUSTER_NAME=my-cluster-name

# find root ACCOUNT UID 식별자
aws sts get-caller-identity --query Account --output text
export ROOT_ACCOUNT_UID=123456789012
```

### Kubernetes 서비스 계정과 IAM 역할 연결

- 1.23 이상의 EKS Cluster가 설치되어 있어야 한다.
- EBS CSI Driver를 위한 IAM Policy, Role, Cluster Service Account를 생성한다.
```
eksctl create iamserviceaccount
--override-existing-serviceaccounts \
--region $REGION \
--name ebs-csi-controller-sa \
--namespace kube-system \
--cluster CLUSTER_NAME \
--attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
--approve \
--role-only \
--role-name AmazonEKS_EBS_CSI_DriverRole_CLUSTER_NAME
```

### EBS Storage 백업을 위한 Snapshot Components 생성

- CRD 및 Snapshot Controller 생성
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml

kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/deploy/kubernetes/snapshot-controller/rbac-snapshot-controller.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/deploy/kubernetes/snapshot-controller/setup-snapshot-controller.yaml
```

### CSI-Driver add-on 설치
```
eksctl create addon --region $REGION --name aws-ebs-csi-driver --cluster $CLUSTER_NAME \
--service-account-role-arn arn:aws:iam::ROOT_ACCOUNT_UID:role/AmazonEKS_EBS_CSI_DriverRole_$CLUSTER_NAME \
--force
```

### EBS CSI Driver 기반 gp3 StorageClass 등록
```
kubectl apply -f - <<EOF
apiVersion: storage.k8s.io/v1
  kind: StorageClass
metadata:
  name: ebs-sc
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
  provisioner: ebs.csi.aws.com
  volumeBindingMode: WaitForFirstConsumer
EOF
```
  
- 기존 gp2기반 Storage Class를 default 해제
```
kubectl patch storageclass gp2 -p ‘{“metadata”: {“annotations”:{“storageclass.kubernetes.io/is-default-class":"false”}}}’
```

- 설정 확인
```
kubectl get sc
```

### Delete EBS CSI-Driver addon from EKS
```
eksctl delete addon --region $REGION --name aws-ebs-csi-driver --cluster $CLUSTER_NAME
eksctl delete iamserviceaccount --cluster $CLUSTER_NAME --name ebs-csi-controller-sa --namespace=kube-system
```

### EFS CSI Driver install on EKS

### EFS IAM Policy 생성(Admin Only)

#### Download the IAM policy document
```
curl -S https://raw.githubusercontent.com/kubernetes-sigs/aws-efs-csi-driver/master/docs/iam-policy-example.json -o iam-policy.json
```

#### Create an IAM policy
```
aws iam create-policy \
--policy-name EFSCSIControllerIAMPolicy \
--policy-document file://iam-policy.json
```

### EKS에서 EFS(파일 스토리지) 사용하기 

- 환경변수 설정 (예시)
```
export AWS_ROOT_UID=936103362868
export REGION=eu-west-3
export CLUSTER_NAME=test-eks
```

### 1. EFS 파일시스템 생성 

- 파일 시스템 ID 발급을 위해 관리콘솔에 접속한다.
> 콘솔에 접속한 다음, 'EFS' 키워드로 서비스를 조회한다.
> EFS 화면에서 파일 시스템을 생성한다.
> 파일 시스템 내의 네크워크 > 보안그룹 탭에서 ClusterSharedNodeSecurityGroup을 모든 가용영역에 추가한다. 
> 생성 후, 발급된 파일 시스템 ID를 복사해 둔다.

```
export FILE_SYSTEM_ID=fs-0315cd7f047660128 (수정필요)
```

### 2. Kubernetes 서비스 계정과 IAM 역할 연결 
```
eksctl create iamserviceaccount \
--override-existing-serviceaccounts \
--region $REGION \
--name efs-csi-controller-sa \
--namespace kube-system \
--cluster CLUSTER_NAME \ 
--attach-policy-arn arn:aws:iam::AWS_ROOT_UID:policy/EFSCSIControllerIAMPolicy \
--approve
```

### 3. Cluster에 EFS CSI 드라이버 설치 

- Region별 드라이버 설치 이미지 (리전별 이미지 저장소 URL 참고)
> https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/add-ons-images.html

```
helm repo add aws-efs-csi-driver https://kubernetes-sigs.github.io/aws-efs-csi-driver
helm repo update
helm upgrade -i aws-efs-csi-driver aws-efs-csi-driver/aws-efs-csi-driver \
--namespace kube-system \
--set image.repository=[리전별 이미지 저장소]/eks/aws-efs-csi-driver \
--set controller.serviceAccount.create=false \
--set controller.serviceAccount.name=efs-csi-controller-sa
```

### Pod 스펙만으로 Kafka 설치(참고용)

- StatefulSet이 아닌, Pod와 hostpath 볼륨으로 Kafka를 임시설치하는 YAML

```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: my-kafka
spec:
  selector:
    app: kafka
  ports:
    - name: kafka
      protocol: TCP
      port: 9092
      targetPort: 9092
  type: ClusterIP
---
apiVersion: v1
kind: Pod
metadata:
  name: my-kafka
  labels:
    app: kafka
spec:
  containers:
    - name: my-kafka
      image: bitnami/kafka:latest
      ports:
        - containerPort: 9092
      env:  
        - name: ALLOW_PLAINTEXT_LISTENER
          value: "yes"   
        - name: KAFKA_KRAFT_CLUSTER_ID
          value: kafka_cluster_id_test1                  
      volumeMounts:
        - name: data
          mountPath: /kafka/data
  volumes:
    - name: data
      hostPath:
        path: /tmp
EOF
```
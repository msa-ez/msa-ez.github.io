---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# AWS Cloud Setup(Container Storage Interface)

## CSI Driver install on EKS 

- 업스트림 쿠버네티스 1.23버전부터 CSP 벤더사별 CSI(Container Storage Interface) 플러그인 기능이 가능해져 쿠버네티스 릴리스 주기에 의존하지 않고 자율적으로 구현 및 배포할 수 있게 됨.
- 참조 : https://aws.amazon.com/ko/blogs/containers/amazon-eks-now-supports-kubernetes-1-23/
- 참조 : https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/kubernetes-versions.html

### EBS(Elastic Block Store) CSI 드라이버 설치

- 데이터베이스와 같은 정형정보 저장에 필요한 드라이버와 이를 사용하는 프로비저너를 클러스터에 설정한다.

먼저, 설치에 필요한 내 클러스터 정보를 터미널에 설정한다. ([ ]를 포함해 내 정보로 수정)
```
export REGION=[my-region-code]
export CLUSTER_NAME=[my-cluster-name]
# find root ACCOUNT UID 식별자
aws sts get-caller-identity --query Account --output text
export ROOT_ACCOUNT_UID=[123456789012]
```

#### Kubernetes 서비스 계정과 IAM 역할 연결

- 1.23 이상의 EKS Cluster가 설치되어 있어야 한다.
- Cluster가 AWS EBS CSI Driver를 사용하도록 IAM계정을 생성하고 IAM Policy를 Role과 함께 EKS에 설정한다.
```
eksctl create iamserviceaccount \
  --override-existing-serviceaccounts \
  --region $REGION \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster $CLUSTER_NAME \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --approve \
  --role-only \
  --role-name AmazonEKS_EBS_CSI_DriverRole_$CLUSTER_NAME
```

#### EBS Storage 백업을 위한 Snapshot Components 생성

```
# Customresourcedefinition 생성
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/client/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml

# Controller 생성
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/deploy/kubernetes/snapshot-controller/rbac-snapshot-controller.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/master/deploy/kubernetes/snapshot-controller/setup-snapshot-controller.yaml
```

#### CSI-Driver add-on 설치
```
eksctl create addon --region $REGION --name aws-ebs-csi-driver --cluster $CLUSTER_NAME --service-account-role-arn arn:aws:iam::$ROOT_ACCOUNT_UID:role/AmazonEKS_EBS_CSI_DriverRole_$CLUSTER_NAME --force
```

#### EBS CSI Driver 기반 gp3 StorageClass 등록

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

- Storage Class 확인
```
kubectl get storageclass
```
 
- 기존 gp2기반 Storage Class를 default 해제
```
kubectl patch storageclass gp2 -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
```

- 설정 확인
```
kubectl get storageclass
```

### <<-- 이번 Lab에서는 여기까지만 실행합니다. -->>

### EFS(Elastic File System) CSI 드라이버 설치

- 첨부 파일과 같은 비정형정보 저장에 필요한 드라이버와 이를 사용하는 프로비저너를 클러스터에 설정한다.


먼저, 설치에 필요한 내 클러스터 정보를 설정한다.
```
export REGION=my-region-code
export CLUSTER_NAME=my-cluster-name
export ROOT_ACCOUNT_UID=123456789012
```

#### EFS IAM Policy 생성(DO NOT run following two commands, Admin Only)
 
- IAM에 보안자격증명으로 사용가능한 EFS 정책을 설정한다. 

```
# Download the IAM policy document (Cloud Administrator Only)
curl -S https://raw.githubusercontent.com/kubernetes-sigs/aws-efs-csi-driver/master/docs/iam-policy-example.json -o iam-policy.json

# Create an IAM policy (Cloud Administrator Only)
aws iam create-policy \
  --policy-name EFSCSIControllerIAMPolicy \
  --policy-document file://iam-policy.json 
```

#### EKS에 EFS 드라이버 설치 및 프로비저너 등록하기 

#### 1. EFS 파일시스템 생성 

- 파일 시스템 ID 발급을 위해 관리콘솔에 접속한다.
> 콘솔에 접속한 다음, 'EFS' 키워드로 서비스를 조회한다.
> EFS 화면에서 파일 시스템을 생성한다.
> 파일 시스템 내의 네크워크 > 보안그룹 탭에서 ClusterSharedNodeSecurityGroup을 모든 가용영역에 추가한다. 
> 생성 후, 발급된 파일 시스템 ID를 복사해 둔다.

```
export FILE_SYSTEM_ID=fs-0315cd7f047660128 (수정필요)
```

#### 2. Kubernetes 서비스 계정과 IAM 역할 연결 
 
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

#### 3. Cluster에 EFS CSI 드라이버 설치 

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

#### 4. 파일시스템으로 StorageClass 생성 
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

#### TEST: PVC 생성 
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: aws-efs
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
---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Persistent Volume

## Instruction

주어진 12번가 이벤트스토밍 모델을 기반으로, MSA-Ez가 제공하는 쿠버네티스 오브젝트 생성을 위한 배포 모델링 도구를 활용해 스토리지를 위한 메니페스트를 자동 생성하고 이를 클러스터에 적용해 본다.

## 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/mallbasic-for-ops](https://www.msaez.io/#/storming/mallbasic-for-ops)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 아래처럼 주문, 배송, 상품으로 구성된 12번가 이벤트스토밍 기본 모델이 출력된다.   
- 로딩된 모델은 우측 팔레트 영역에 스티커 목록이 나타나지 않는다. 상단 메뉴영역에서 포크 아이콘(FORK)을 클릭해 주어진 모델을 복제한다. 
![image](https://github.com/acmexii/demo/assets/35618409/1e16e849-7ae9-4b33-b39c-db4ef0939507)
- 우측 팔레트 영역에 스티커 목록들이 나타나는 것이 확인된다.


## 배포 모델링

- Fork된 모델에 Ingress 토핑을 추가하자. 
- Ingress 토핑 추가는 메뉴에서 'Code' > 'Preview' > 'Toppings' 에서 아래처럼 Service Mesh 하위의 Ingress를 체크 하기만 하면 된다.
![image](https://github.com/acmexii/demo/assets/35618409/a55fc02b-2c67-492e-a233-10aee09d3cee)

- Ingress가 적용된 상태에서 모델 상단 메뉴의 'DEPLOY'를 클릭한다.
![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

- 아래 그럼처럼 쿠버네티스 기본 배포모형인 Service와 Deployment를 가진 서비스 상단에 Ingress 도식이 추가되어 나타난다.
![image](https://github.com/acmexii/demo/assets/35618409/9a3ffc7d-4910-4b6f-b3a7-0178f15abb17)
- 또한, Ingress 게이트웨이에서 각 단위 서비스로 라우팅되는 패스(path) 이름이 자동으로 설정되어 보인다.

- Cloud IDE를 활용해 각 서비스의 이미지를 생성하고 푸쉬한 다음, 생성한 이미지 이름을 Deployment 객체에 설정한다. 

## Persistence 객체 모델링

- 모델링 도구영역에서 'Persistence' > 'PersistentVolumeClaim'을 선택해 PVC 스티커를 생성한다.
![image](https://github.com/acmexii/demo/assets/35618409/5d4b0cc8-7159-4aab-ab72-9c424efd896f)

- 생성한 PVC 스티커를 더블 클릭하여 주문서비스를 위한 스토리지 정보를 아래와 같이 입력한다. 
> Name : o-data
> Access Modes : ReadWriteOnce
> Storage : 10 Gi
> Volume Mode : Filesystem
![image](https://github.com/acmexii/demo/assets/35618409/298d7014-97f7-4eb8-b5e1-c8949989ca51)
- 이때, YAML 스펙의 14라인(storageClassName 항목)을 삭제하여 대다수 CSP들에 설정된 디폴드 스토리지 클래스(Provisioner)를 사용하도록 한다.
- 그런 다음, 'order' Deployment 객체를 클릭하여 화살표 도구를 이용, 'o-data' PVC로 매핑을 설정한다.
![image](https://github.com/acmexii/demo/assets/35618409/be3accc4-bda3-473d-8745-3e04eae4c2ac)
- 매핑이 설정되고 나면, 주문서비스 배포 YAML 스펙에는 o-data 스토리지를 사용하는 volume 마운트 정보가 자동으로 주입된다.
![image](https://github.com/acmexii/demo/assets/35618409/22696b78-e9a3-4b2e-afa9-06845f376174)
- 나머지 배송과 상품서비스에 대해서도 동일하게 볼륨 모델링을 적용한다.
![image](https://github.com/acmexii/demo/assets/35618409/e7f9d971-148c-4f7d-a9a0-ea90e3fdf300)


## 클러스터에 배포하기

- 설정된 클러스터 컨텍스트상에서 클라이언트(kubectl)을 활용해 수동으로 배포한다.
```
kubectl apply -f kubernetes/template/template.yml
```
- 대상 클러스터에 Kafka가 설치되지 않은 경우, Helm으로 Kafka를 설치한다.
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-kafka bitnami/kafka --version 23.0.5
```
- Ingress Controller가 없을 경우, Ingress Controller도 설치한다.
```
helm repo add stable https://charts.helm.sh/stable
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
kubectl create namespace ingress-basic

helm install nginx-ingress ingress-nginx/ingress-nginx --namespace=ingress-basic
```

- 생성된 PVC 배포를 조회해 본다.
```
kubectl get pvc 
```
- 다음과 같이 배포된 PVC 스펙이 조회되어 출력된다. (GCP 예시)
```
NAME              STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
d-data            Bound    pvc-05cadaa8-0dd4-407f-85f5-d25fbb02939b   10Gi       RWO            standard-rwo   49m
data-my-kafka-0   Bound    pvc-676d0c9d-043d-41bd-ba57-b9397e63b565   8Gi        RWO            standard-rwo   125m
o-data            Bound    pvc-6b3a94e4-d7e6-42f3-9c4c-d4cc675db94d   10Gi       RWO            standard-rwo   49m
p-data            Bound    pvc-ab492454-4c05-4e58-8462-67d8e0f7c3aa   10Gi       RWO            standard-rwo   49m
```

## 주문 컨테이너 스토리지 확인

- 주문 컨테이너에 접속하여 바인딩된 스토리지를 확인하고 데이터를 생성해 본다. 
```
kubectl exec -it pod/ORDER 객체 -- /bin/sh
ls /data
```
- 클라우드 서비스 제공자가 지원하는 스토리지가 PVC 클레임에 명시된 사이즈만큼 조회된다.


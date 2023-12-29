---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# 자동확장(HPA) 배포

## Instruction

주어진 12번가 이벤트스토밍 모델을 기반으로, MSA-Ez가 제공하는 쿠버네티스 오브젝트 생성을 위한 배포 모델링 도구를 활용해 워크로드 자동확장(HPA) 메니페스트를 모델링하여 이를 클러스터에 적용해 본다.


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

## HPA 객체 모델링

- HPA는 워크로드 리소스를 자동으로 업데이트하며, 워크로드의 크기를 수요에 맞게 자동으로 스케일링해 주는 객체이다. 
- 모델링 도구영역에서 'Autoscaler' > 'Horizontal Pod Authscaler'을 선택해 HPA 스티커를 생성한다.
![image](https://github.com/acmexii/demo/assets/35618409/5cc1cdf8-11e0-4fc0-a47a-14173c3317e8)

- 생성한 HPA 스티커를 더블 클릭하여, 주문서비스를 위한 HPA 객체 정보를 아래와 같이 입력한다. 
> Name : order-hpa
> Replicas : Min-1, Max-5
> Resource Type : cpu
> AverageUtilization : 20
- 'order-hpa'와 Deployment 'order'를 매핑한다.
![image](https://github.com/acmexii/demo/assets/35618409/ea13ad2b-ba9d-417f-88bc-1e624e4f5317)

- 상품서비스에도  HPA 객체 정보를 아래와 같이 입력한다.
> Name : product-hpa
> Replicas : Min-1, Max-5
> Resource Type : memory
> AverageUtilization : 20
- 'product-hpa'와 Deployment 'product'를 매핑한다.
![image](https://github.com/acmexii/demo/assets/35618409/5f863b49-842c-4482-be62-4399c6e143c8)

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

- 생성된 주문서비스와 상품서비스의 HPA 객체를 조회한다.
```
kubectl get hpa
```
```
NAME          REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
order-hpa     Deployment/order     80%/20%   1         5         5          17m
product-hpa   Deployment/product   51%/20%   1         5         5          17m
```

## 워크로드 자동확장 동작 확인

- 먼저, 워크로드 생성을 위한 Pod를 설치한다.
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

- 생성된 siege pod에 접속하여 주문서비스에 접속되는지 테스트 해본다.
```
kubectl exec -it siege -- /bin/bash
siege -c1 -t2S -v http://order:8080/orders
```

- 현재 주문서비스 인스턴스는 1개이며, 'siege' Pod 내에서 주문 서비스로 워크로드를 생성한다. 
```
siege -c20 -t40S -v http://order:8080/orders
```
- 부하가 가해짐에 따라 주문서비스는 부하량에 따라 설정된 임계치를 상회해 사용함을 알 수 있다.
```
NAME          REFERENCE            TARGETS     MINPODS   MAXPODS   REPLICAS   AGE
order-hpa     Deployment/order     422%/20%   1         5         5          22m
product-hpa   Deployment/product   55%/20%     1         5         5          22m
```

- 오토스케일러가 주문 및 주문서비스가 사용하는 상품서비스를 자동으로 Scale Out 했음을 알 수 있다.
```
kubectl get pod -l app=order
NAME                     READY   STATUS    RESTARTS   AGE
order-55498f4b8f-b99xx   2/2     Running   0          9m5s
order-55498f4b8f-rsqdk   2/2     Running   0          9m19s
order-55498f4b8f-x9rlr   2/2     Running   0          5h59m
order-857878887c-64dnd   2/2     Running   0          9m19s
order-857878887c-ggd6k   2/2     Running   0          9m5s
```

```
kubectl get pod -l app=product
NAME                       READY   STATUS    RESTARTS   AGE
product-66d57b87db-4wqsv   2/2     Running   0          9m55s
product-66d57b87db-5wkgv   2/2     Running   0          9m25s
product-66d57b87db-n5tqt   2/2     Running   0          9m25s
product-66d57b87db-r7ljp   2/2     Running   0          11m
product-66d57b87db-zw8gw   2/2     Running   0          10m
```


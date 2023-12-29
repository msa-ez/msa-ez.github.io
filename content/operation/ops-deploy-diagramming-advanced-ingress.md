---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Ingress 배포모델 설계

## Instruction

주어진 12번가 이벤트스토밍 모델을 기반으로, MSA-Ez가 제공하는 쿠버네티스 오브젝트 생성을 위한 배포 모델링 도구를 활용해 메니페스트 YAML을 자동 생성하고 이를 적용해 본다.

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

- 이전 랩(12st Mall 배포 모델 다이어그래밍과 활용)과 동일하게, Cloud IDE를 활용해 비즈니스 로직을 완성하고, 모든 서비스에서 대해 도커 이미지를 생성(도커라이징)하고 저장소에 푸쉬한다.
- 주문(order) 서비스의 경우,
```
cd order
mvn package -B -Dmaven.test.skip=true
docker build -t [dockerhub ID]/order:v1 .     
docker image ls
docker push [dockerhub ID]/order:v1 .
``` 

- 각 서비스의 Deployment 객체 모형을 클릭해 나타나는 속성창에서 이미지를 아래처럼 입력한다.
![image](https://github.com/acmexii/demo/assets/35618409/936467d7-be76-4686-97f5-fe592786831b)

- 배포 모델 우측 상단의 'KUBECTL'을 클릭하여 배포 매니페스트 YAML을 확인한다.
![image](https://github.com/acmexii/demo/assets/35618409/97cdb8d0-2c87-4f1d-a464-e63df1540556)

- Ingress를 포함하여 설정한 배포 스펙들이 하나의 YAML로 머지되어 template.yml 상에서 조회된다.

## 클러스터에 수동으로 배포하기

- 설정된 클러스터 컨텍스트상에서 클라이언트(kubectl)을 활용해 수동으로 배포한다.
```
kubectl apply -f kubernetes/template/template.yml
```
- Ingress Controller가 없을 경우, Helm으로 Ingress Controller를 설치해 준다.
```
helm repo add stable https://charts.helm.sh/stable
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
kubectl create namespace ingress-basic

helm install nginx-ingress ingress-nginx/ingress-nginx --namespace=ingress-basic
```

- 배포 결과를 조회해 본다.
```
kubectl get ingress -o yaml 
```
- 다음과 같이 배포된 Ingress 라우팅 스펙이 조회되어 출력된다. 
```
apiVersion: v1
items:
- apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    annotations:
    ...
    ...
  spec:
    rules:
    - http:
        paths:
        - backend:
            service:
              name: order
              port:
                number: 8080
          path: /orders
          pathType: Prefix
        - backend:
            service:
              name: product
              port:
                number: 8080
          path: /products
          pathType: Prefix
        - backend:
            service:
              name: delivery
              port:
                number: 8080
          path: /deliveries
          pathType: Prefix
    ...
    ...          
```

## On-Prem MSA-Ez 배포 이해

- On-Prem MSA-Ez에는 마이크로서비스를 빌드하고 배포하는 자동화된 툴-체인들이 제공된다. 
- 기본적으로 이벤트스토밍 모델 버전에 따라, 각 서비스 이미지들이 태깅되어 빌드되고 구성된 Harbor 컨테이너 레지스트리에 이미지가 푸쉬된다.
- 이에 따라 매니페스트 YAML이 업데이트되고 GitOps 설정에 따라 Argo CD가 이를 탐지하여 설정된 클러스터에 자동 배포가 이루어진다.
![image](https://github.com/acmexii/demo/assets/35618409/4a51c1e3-400f-4d5b-8d0a-edb742f12e94)

- Argo 엔드포인트를 조회한다.
```
kubectl get svc argocd-server -n argocd
```

- 브라우저에서 앤드포인트에 접속한다.
```
ID : admin
password : kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

- 설정된 배포 전략에 따른 배포 진행 조회 및 배포 결과는 아래와 같이 확인 가능하다.
![image](https://github.com/acmexii/demo/assets/35618409/930147fa-8cac-4691-9e4a-dcbcbe1bca60)


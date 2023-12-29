---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# 12st Mall Basic Deploy

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

- 생성된 모델 상단 메뉴에서 'DEPLOY'를 클릭한다.
![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

- 아래 그럼처럼 쿠버네티스 기본 배포모형인 Service와 Deployment가 바운디드 컨텍스트별로 그려져 나타난다.
![image](https://github.com/acmexii/demo/assets/35618409/ad81f353-7b71-4381-bd42-3ceb25a1a698)

- 먼저, Cloud IDE를 활용해 비즈니스 로직을 완성하고, 모든 서비스에서 대해 도커 이미지를 생성(도커라이징)하고 저장소에 푸쉬한다.
- 주문(order) 서비스의 경우,
```
cd order
mvn package -B -Dmaven.test.skip=true
docker build -t [dockerhub ID]/order:v1 .     
docker image ls
docker push [dockerhub ID]/order:v1 .
``` 

- 각 서비스의 Deployment 객체 모형을 클릭해 나타나는 속성창에서 이미지를 아래처럼 입력한다.
![image](https://github.com/acmexii/demo/assets/35618409/0aa6cb13-65b0-49b9-a243-e78b7d21a709)

- 배포 모델 우측 상단의 'KUBECTL'을 클릭하여 배포 매니페스트 YAML을 확인한다.
![image](https://github.com/acmexii/demo/assets/35618409/70cfdffa-bacd-4f63-bc4e-5f40b9ad8999)

- 설정한 배포 스펙들이 하나의 YAML로 머지되어 template.yml 상에서 조회된다.

## 클러스터에 수동으로 배포하기

- 설정된 클러스터 컨텍스트상에서 클라이언트(kubectl)을 활용해 수동으로 배포한다.
```
kubectl apply -f kubernetes/template/template.yml
```

- 배포 결과를 조회해 본다.
```
kubectl get all 
```
- 다음과 같이 12번가 서비스를 구성하는 Pod들이 정상적으로 조회된다.
```
NAME                            READY   STATUS    RESTARTS   AGE
pod/delivery-7d748d7678-wnpcq   1/1     Running   0          37s
pod/order-647876474-lj9ls       1/1     Running   0          37s
pod/product-5849b8c769-d48vp    1/1     Running   0          37s

NAME                 TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/delivery     ClusterIP   10.36.14.79   <none>        8080/TCP   37s
service/kubernetes   ClusterIP   10.36.0.1     <none>        443/TCP    26m
service/order        ClusterIP   10.36.7.182   <none>        8080/TCP   37s
service/product      ClusterIP   10.36.9.129   <none>        8080/TCP   36s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/delivery   0/1     1            1           37s
deployment.apps/order      0/1     1            1           38s
deployment.apps/product    0/1     1            1           37s

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/delivery-7d748d7678   1         1         1       37s
replicaset.apps/order-647876474       1         1         1       37s
replicaset.apps/product-5849b8c769    1         1         1       37s
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
![image](https://github.com/acmexii/demo/assets/35618409/f9201dfb-5a29-42eb-9b89-df90b380609d)




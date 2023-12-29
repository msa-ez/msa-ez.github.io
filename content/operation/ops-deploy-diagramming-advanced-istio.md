---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Istio Mesh

## Instruction

주어진 12번가 이벤트스토밍 모델을 기반으로, MSA-Ez가 제공하는 쿠버네티스 오브젝트 생성을 위한 배포 모델링 도구를 활용해 서비스 메쉬 Istio Traffic Management의 핵심인 VirtualService와 DestinationRule 메니페스트를 자동 생성하고 이를 클러스터에 적용해 본다.


## 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/mallbasic-for-ops](https://www.msaez.io/#/storming/mallbasic-for-ops)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 아래처럼 주문, 배송, 상품으로 구성된 12번가 이벤트스토밍 기본 모델이 출력된다.   
- 로딩된 모델은 우측 팔레트 영역에 스티커 목록이 나타나지 않는다. 상단 메뉴영역에서 포크 아이콘(FORK)을 클릭해 주어진 모델을 복제한다. 
![image](https://github.com/acmexii/demo/assets/35618409/1e16e849-7ae9-4b33-b39c-db4ef0939507)
- 우측 팔레트 영역에 스티커 목록들이 나타나는 것이 확인된다.


## 배포 모델링 

- Fork된 모델에 Istio 토핑을 추가하자. 
- Ingress 토핑 추가는 메뉴에서 'Code' > 'Preview' > 'Toppings' 에서 아래처럼 Service Mesh 하위의 Istio를 체크 하기만 하면 된다.
![image](https://github.com/acmexii/demo/assets/35618409/4dfd204a-39c0-4f34-a2e6-d14802cd5d7b)

- Istio 토핑 추가 후, 코드 목록에서 Kubernetes 폴더를 보면, 'template' > 'istio.yml'이 추가된 것을 확인할 수 있다.
![image](https://github.com/acmexii/demo/assets/35618409/5ed07284-52d9-4058-82e4-40c343d41b3f)
- MSA-Ez가 추가한 Istio CRDs 객체는 다음과 같다.
> Gateway : Istio Ingressgateway를 기본으로 하는 Istio Gateway  
> VirtualService : 요청이 어떤 서비스(또는, Subset)에 얼마 만큼의 트래픽을 라우팅할지를 결정하는 객체
> DestinationRule : 서비스별 컨테이너에 대한 Subset(stable, canary) 정의 및 라우팅 정책(로더밸런싱, 컨넥션 풀, etc)을 설정하는 객체 


## Istio 객체 상세 설계

- 모델 상단 메뉴의 'DEPLOY'를 클릭한다.
![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

- 아래 그럼처럼 Istio 객체 모델이 나타난다.
![image](https://github.com/acmexii/demo/assets/35618409/e4ee1273-bf3a-43bb-8b8b-604307c677be)
> Istio Ingressgateway를 사용하는 'main-gw' Gateway 객체
> 2개의 Subset(stable, canary)을 가지는 'drule-order' DestinationRule 객체
> Subset별 가중치 기반으로 'order' Service를 라우팅하는 'vsvc-order' VirtualService 객체
  > 다양한 조건(uri, method, headers, port, source Labels, gateways, queryParams)의 라우팅 설정 가능
  > 기본으로 생성된 두 Subset(stable, canary)이 동일하므로 가중치를 수정해도 동일 서비스로 라우팅되나, 향후 Blue Green 및 카나리 배포에 활용 가능
- 배송, 상품 서비스에 대해서도 동일한 Istio CRDs 객체들이 아래처럼 자동으로 생성된다.
![image](https://github.com/acmexii/demo/assets/35618409/32f67182-ef3e-4773-bfe1-fe7b49bc96b6)


## 클러스터에 배포하기

- 설정된 클러스터 컨텍스트상에서 클라이언트(kubectl)을 활용해 수동으로 배포한다.
```
kubectl apply -f kubernetes/template/template.yml
kubectl apply -f kubernetes/template/istio.yml
```
- 대상 클러스터에 istio가 설치되지 않은 경우, 아래 명령으로 Istio를 설치한다.
```
export ISTIO_VERSION=1.18.6
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=$ISTIO_VERSION TARGET_ARCH=x86_64 sh -
```
- Istio 패키지 폴더로 이동허고 실행 Path를 설정한다.
```
cd istio-$ISTIO_VERSION
export PATH=$PWD/bin:$PATH
```

- Istio를 'demo' 프로파일로 설치한다.
```
istioctl install --set profile=demo --set hub=gcr.io/istio-release
```
```
    ✔ Istio core installed
    ✔ Istiod installed
    ✔ Egress gateways installed
    ✔ Ingress gateways installed
    ✔ Installation complete
```
- 'default' 네임스페이스에 Istio가 적용되도록 설정한다.
```
kubectl label namespace default istio-injection=enabled
```

- 생성된 istio.yml과 12st Mall 배포 yaml을 실행한다.
```
kubectl apply -f kubernetes/template/template.yml
```

- 배포된 서비스와 생성된 Istio CRDs 객체를 조회한다.
```
kubectl get pod
```
```
NAME                        READY   STATUS    RESTARTS   AGE
delivery-588b45cc85-r9bsn   2/2     Running   0          3m54s
my-kafka-0                  2/2     Running   0          5m58s
order-55498f4b8f-x9rlr      2/2     Running   0          3m54s
product-75f5b7c4fd-9wxnr    2/2     Running   0          3m54s
```
- 배포된 서비스별 라우팅 룰 CRDs 객체를 조회한다.
```
kubectl get VirtualService
```
```
NAME            GATEWAYS      HOSTS   AGE
vsvc-delivery   ["main-gw"]   ["*"]   8m8s
vsvc-order      ["main-gw"]   ["*"]   8m8s
vsvc-product    ["main-gw"]   ["*"]   8m7s
```
- 각 서비스에 설정된 라우팅 정책 CRDs 객체를 조회한다.
```
kubectl get DestinationRule
```
```
destrule-delivery   delivery   9m22s
destrule-order      order      9m22s
destrule-product    product    9m21s
```

- Istio IngressGateay 주소를 획득하여 주문서비스 URI(/orders)로 접속해 본다.
```
curl GET [ISTIO INGRESS GATEWAY]/orders
```
```
HTTP/1.1 200 OK
content-type: application/hal+json
date: Tue, 19 Dec 2023 01:55:41 GMT
server: istio-envoy
transfer-encoding: chunked
vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers
x-envoy-upstream-service-time: 10

{
    "_links": {
        "orders": {
            "href": "http://34.22.90.243/orders{?page,size,sort}",
            "templated": true
        },
        "profile": {
            "href": "http://34.22.90.243/profile"
        }
    }
}
```
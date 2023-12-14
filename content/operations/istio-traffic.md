---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# [Service Mesh] Istio 를 통한 동적 트래픽 라우팅

## Traffic Mgmt & Canary 배포

예제를 통해 Istio가 지원하는 동적 트레픽 라우팅을 이해하고, 앞서 설치한 Add-on 서버들의 시각화된 화면으로 적용 결과를 확인한다.

대표적인 서비스 메시의 카나리(Canary) 배포전략을 실습해 보고 Advanced한 서비스 리자일런스를 학습한다.


### Istio Tutorial 셋업

- Tutorial을 위한 네임스페이스 생성 및 Istio Enabling
```
kubectl create namespace tutorial
kubectl label namespace tutorial istio-injection=enabled
```

- Istio 설치한 폴더로 이동
```
cd istio-1.18.1
```

### Tutorial에 필요한 샘플 애플리케이션 설치
```
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml -n tutorial

service/details created
serviceaccount/bookinfo-details created
deployment.apps/details-v1 created
service/ratings created
serviceaccount/bookinfo-ratings created
deployment.apps/ratings-v1 created
service/reviews created
serviceaccount/bookinfo-reviews created
deployment.apps/reviews-v1 created
deployment.apps/reviews-v2 created
deployment.apps/reviews-v3 created
service/productpage created
serviceaccount/bookinfo-productpage created
deployment.apps/productpage-v1 created
```

#### 애플리케이션이 시작되고 각 Pod들이 준비상태가 된다. Istio Sidecar들이 같이 배포되었을 것이다.

```
kubectl get services -n tutorial

NAME          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
details       ClusterIP   10.0.0.212      <none>        9080/TCP   29s
productpage   ClusterIP   10.0.0.57       <none>        9080/TCP   28s
ratings       ClusterIP   10.0.0.33       <none>        9080/TCP   29s
reviews       ClusterIP   10.0.0.28       <none>        9080/TCP   29s
```

- 그리고 다음과 같이 확인한다:

```
 kubectl get pods -n tutorial

NAME                              READY   STATUS    RESTARTS   AGE
details-v1-558b8b4b76-2llld       2/2     Running   0          2m41s
productpage-v1-6987489c74-lpkgl   2/2     Running   0          2m40s
ratings-v1-7dc98c7588-vzftc       2/2     Running   0          2m41s
reviews-v1-7f99cc4496-gdxfn       2/2     Running   0          2m41s
reviews-v2-7d79d5bd5d-8zzqd       2/2     Running   0          2m41s
reviews-v3-7dbcdcbc56-m8dph       2/2     Running   0          2m41s
```

>   모든 Pod 가 `2/2`로 표시될때까지 기다린다 
>   모든 상태가 `Running` 이 될때까지 기다린다
  

### Open Applications to outside traffic 

애플리케이션이 잘 디플로이 되었지만 외부에서는 접근이 되지 않은 상태이다. 외부접속이 가능하게 하기위해서는 Istio의 Ingress Gateway를 설정해야 한다. 

#### 애플리케이션들을 Istio Gateway 에 묶기위한 설정들을 배포한다:

```
kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml -n tutorial

gateway.networking.istio.io/bookinfo-gateway created
virtualservice.networking.istio.io/bookinfo created
```


#### 발생한 문제가 없는지 확인한다:

```
istioctl analyze -n tutorial

✔ No validation issues found when analyzing namespace: tutorial.
```


### 브라우저로 배포된 애플리케이션 확인

설치된 Istio 인그레스의 접속 주소(EXTERNAL-IP)를 확인한다. 
```
kubectl get svc istio-ingressgateway -n istio-system
```

### Verify external access 

- 조회된 EXTERNAL-IP로 아래 URL을 완성하여 브라우저 새 탭에서 Bookinfo application이 잘 동작하는지 확인한다.

```
http://GATEWAY_EXTERN-IP/productpage
```
Bookinfo product page 를 여러번 새로고침해 본다.


### 서비스 메쉬 및 추적 서비스 확인
- (이전 랩에서) 열어둔 Kali와 Jaeger 서버로부터 Service Mesh를 모니터링/추적 해본다.

#### Kiali를 통한 서비스 메쉬 모니터링

- Kiali 화면에서 Namespace를 tutorial로 설정하고, 왼쪽 Graph 메뉴를 선택한다.
- 우측 상단의 적절한 Data 범위를 주어 배포된 애플리케이션의 시각화된 서비스 메쉬를 확인한다.
![image](https://github.com/acmexii/demo/assets/35618409/926945a0-8a93-4d3f-a0e6-6ada6c011b9d)


#### Jaeger를 통한 서비스 트레이싱

- Jaeger 화면에서 Service를 productpage.tutorial로 설정하고, 아래 'Find Traces'를 클릭해 조회한다.
![image](https://github.com/acmexii/demo/assets/35618409/4899c6da-4b30-450e-b19a-14379989966d)


### 동적 트래픽 제어 테스트

- Review 서비스의 종류별 유입을 동적으로 변경하여 Canary 배포등의 시나리오에 적용하는 예시.


- DestinationRule을 먼저 배포하여 SubSet을 정의:
```
kubectl apply -f samples/bookinfo/networking/destination-rule-reviews.yaml -n tutorial
```

- VirtualService 를 통해 트래픽을 제어를 위한 설정을 배포한다:
- 아래 정책을 적용하여 리뷰서비스 v1으로 80 %, v2로 20%의 트래픽을 유입시킨다.
```
kubectl apply -f samples/bookinfo/networking/virtual-service-reviews-80-20.yaml -n tutorial
```

- 좀더 많은 70%의 트래픽을 v2로 유입시킨다. 
```
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
  namespace: tutorial
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 30
    - destination:
        host: reviews
        subset: v2
      weight: 70
EOF
```

- 모든 트래픽(100%)을 v2로 라우팅시킨다. 
```
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
  namespace: tutorial
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v2
      weight: 100
EOF
```

- 이처럼 점진적으로 새로운 버전으로의 유입률을 증가시켜 가면서, 혹시 모를 배포 피해를 최소화하는 전략을 Canary(카나리) 배포라고 한다. 



### 웹 요청정보 기반 스마트 라우팅 

- 랜덤한 라우팅에서 확장하여 유입되는 요청의 브라우저, 또는 사용자 Profile 정보기반 라우팅이 가능하다. 
- 서비스 소관부서에서, 해당 사업부로, 종국에는 B2C 사용자로 신규 버전을 점진적으로 공개한다.

- 접속 브라우저가 Firefox 일때, v2로 라우팅하는 설정 예시
```
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
  namespace: tutorial
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        baggage-user-agent:
          regex: .*Firefox.*
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v1
EOF
```

- Firefox 브라우저로 접속하거나, Curl Cli로도 확인 가능
```
curl -A Firefox http://GATEWAY_EXTERN-IP/productpage
```

- 단일 진입점인 Gateway에서 Filter를 통해 Request 헤더에 필요한 Value 설정이 가능하다.
- 로그인한 사용자 조직이 주문팀일 경우, 요청 Header 설정값 예시: organization = orderTeam


#### 삭제

- Traffic Management에 사용된 CRD 객체(DestinationRule, VirtualService)는 필요없을 시, 다음 명령으로 삭제 가능하다.
```
kubectl delete dr recommendation -n tutorial
kubectl delete vs recommendation -n tutorial
```
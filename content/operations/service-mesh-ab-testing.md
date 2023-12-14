---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Istio based A/B testing 배포

## 새버전 배포에 A/B 테스트 적용하기

- AB 테스트의 목적은 더 가치 있는 변수를 식별하여 최적의 시안을 선정하는 것이다.
- 유사한 크기의 두 대상 그룹에 상이한 버전을 보여주고, 통계 분석을 사용하여 미리 설정된 목표에 근접한 버전을 결정한다. 

- 본 Lab에서는 UI가 다른 신규 서비스 2개를 배포하고, 서로 다른 대상그룹을 각 서비스로 라우팅해 테스트 하고 각 대상그룹별 테스트 결과에 대한 통계분석은 생략한다.

- 시안 A
![image](https://user-images.githubusercontent.com/59052363/230538179-9b8f9b51-f283-4613-afa4-82740300394f.png)
- 시안 B
![image](https://user-images.githubusercontent.com/59052363/230537803-c2410522-f4d5-4dc1-acae-28a82d2eb397.png)


### 사전 환경

- Istio 기반에서 ab-test 네임스페이스를 생성하고, Sidecar가 인젝션되도록 설정한다.

```
kubectl create namespace ab-test
kubectl label namespace ab-test istio-injection=enabled
```

### 테스트 대상 서비스 배포

신규 서비스의 메인 화면 중앙 영역의 이미지가 서로 다른 2개의 서비스를 배포한다.

- 첫번째 대조군 서비스(A)를 배포한다.
```
kubectl apply -f https://raw.githubusercontent.com/msa-school/Lab-required-Materials/main/Ops/ab-test-a.yaml -n ab-test
```            

- 2번째 실험군 서비스(B)를 배포한다.
```
kubectl apply -f https://raw.githubusercontent.com/msa-school/Lab-required-Materials/main/Ops/ab-test-b.yaml -n ab-test
```

- Order Service를 생성하고, Istio IngressGateway에서 라우팅되도록 등록한다.
```
kubectl apply -f https://raw.githubusercontent.com/msa-school/Lab-required-Materials/main/Ops/ab-test-svc.yaml -n ab-test
```

### 테스트 대상 서비스 식별 및 적용

새로운 두 (대조군/실험군) 서비스를 식별하고 테스트 기준에 따른 라우팅 룰을 설정한다.

#### A/B 테스트 대상 서비스 식별

```
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: ab-test-dr
  namespace: ab-test   
spec:
  host: order
  subsets:
  - labels:
      ver: a
    name: ver-a
  - labels:
      ver: b
    name: ver-b
EOF
```

### A/B 테스트 대상군별 라우팅 룰 설정

#### 1. 사용 브라우저에 따른 A/B 라우팅

Firefox 브라우저를 사용하는 사용자는 버전 A로, Chrome 브라우저를 사용자는 버전 B로 라우팅 되도록 설정한다.

```
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ab-test-routing
  namespace: ab-test  
spec:
  hosts:
  - "*"
  gateways:
  - ab-test-gateway
  http:
  - match:
    - headers:
        baggage-user-agent:
          regex: .*Firefox.*
    route:
    - destination:
        host: order
        subset: ver-b
  - route:
    - destination:
        host: order
        subset: ver-a
EOF
```

- Firefox 브라우저를 사용해 실험군 서비스(ver-b)로 라우팅 되는지 확인한다.
- 로컬 브라우저에서 다음 URL로 접속한다.
- 웹 브라우저에서도 해당 URL로 접속해 본다.
```
http [Istio-ingressgateway EXTERNAL-IP]/order/
```

#### 2. 사용 단말에 따른 A/B 라우팅 

모바일 단말을 사용하는 사용자는 버전 A로, 모바일 단말 외 사용자는 버전 B로 라우팅 되도록 설정한다.

```
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ab-test-routing
  namespace: ab-test  
spec:
  hosts:
  - "*"
  gateways:
  - ab-test-gateway
  http:
  - match:
    - headers:
        baggage-user-agent:
          regex: .*Mobile.*
    route:
    - destination:
        host: order
        subset: ver-a
  - route:
    - destination:
        host: order
        subset: ver-b
EOF
```

- 모바일 단말을 사용해 실험군 서비스(ver-b)로 라우팅 되는지 확인한다.
```
http [Istio-ingressgateway EXTERNAL-IP]/order/
```
- 웹 브라우저에서도 해당 URL로 접속해 본다.

#### 3. 사용자 속성 정보에 따른 A/B 라우팅

- 요청 헤더에 Gender 속성을 설정한다.
- 남성(gender = male)일 경우, 50%의 확률로 Version A 또는 Version B로, 여성일 경우 Version B로만 라우팅 되도록 한다.

```
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ab-test-routing
  namespace: ab-test  
spec:
  hosts:
  - "*"
  gateways:
  - ab-test-gateway
  http:
  - match:
    - headers:
        gender:
          exact: male
    route:
    - destination:
        host: order
        subset: ver-b
      weight: 50
    - destination:
        host: order
        subset: ver-a
      weight: 50
  - route:
    - destination:
        host: order
        subset: ver-b
EOF
```

- 커맨드 라인으로 확인하는 방법은 다음과 같다.
```
# Inject "male" to http Request "gender" Header value.
http [Istio-ingressgateway EXTERNAL-IP]/order/ "gender:male"
```

- 커맨드를 계속 호출하면 Version A, Version B가 랜덤하게 출력되는 것이 확인된다.

- 두 테스트 집단의 피드백으로부터 유의미한 결과분석을 통해, 새로운 서비스 배포 후보를 선정해 Rollout 한다.
---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# [Service Mesh] Istio 를 통한 서비스 회복성 Part1 - 타임아웃/재시도

### Istio Timeout & Retry

- 주문서비스와 배송서비스를 활용해 이스티오가 제공하는 Service Resiliency 기능 중, '타임아웃'과 '재시도'에 대해 실습한다. 
tutorial 네임스페이스로부터 이전 Lab에서 사용된 애플리케이션을 먼저 삭제한다.
```
kubectl delete deployment,service --all -n tutorial
```
 
### 1. Timeout

- 주문서비스로부터 응답시간 임계치를 초과하는 경우, 이를 타임아웃 처리하는 Fault Isolation 기능을 실습한다. 

#### 주문서비스를 배포한다.

```bash
kubectl apply -f - <<EOF
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: order
    namespace: tutorial
    labels:
      app: order
  spec:
    replicas: 1
    selector:
      matchLabels:
        app: order
    template:
      metadata:
        labels:
          app: order
      spec:
        containers:
          - name: order
            image: jinyoung/order:timeout
            ports:
              - containerPort: 8080
            resources:
              limits:
                cpu: 500m
              requests:
                cpu: 200m
EOF
```

- Order 서비스 생성
```
kubectl expose deploy order --port=8080 -n tutorial
```

#### Order 서비스 Timeout 설정
- 배포된 order 서비스에 타임아웃 임계치(3초)를 가지는 Istio Policy를 생성한다.
- 
```bash
kubectl apply -f - <<EOF
    apiVersion: networking.istio.io/v1alpha3
    kind: VirtualService
    metadata:
      name: vs-order-network-rule
      namespace: tutorial
    spec:
      hosts:
      - order
      http:
      - route:
        - destination:
            host: order
        timeout: 3s
EOF
```
#### Siege를 통한 워크로드 생성 및 타임아웃 확인

- 워크로드 생성기인 Siege Pod를 생성한다.
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: siege
  namespace: tutorial
spec:
  containers:
  - name: siege
    image: apexacme/siege-nginx
EOF
```

- Siege에 접속하여 워크로드가 잘 전달되는지 테스트해 본다.
```
kubectl exec -it siege -c siege -n tutorial -- /bin/bash
siege -c1 -t4S -v --content-type "application/json" 'http://order:8080/orders POST {"productId": "1001", "qty":5}'
```

#### 타임아웃(Timeout) 트랜잭션 확인

- 적절한 부하를 발생시킨다.
```
siege -c30 -t20S -v --content-type "application/json" 'http://order:8080/orders POST {"productId": "1001", "qty":5}'
```

- Order 서비스에 설정된 Timeout 임계치를 초과하는 쓰레드에 대해, 사이드카에서 차단(Fail-fast)되는 것이 확인된다.
- 이로써 구현 단계가 아닌 런타임 시점에 폴리글랏 언어기반 컨테이너에 대해 적용 가능함을 알 수 있다. 

### 2. Retry

- Order 서비스에 대한 'Retry' Rule을 추가한다.
- Retry가 발생하는 상황을 연출하고, Jaeger 화면을 통해 사이드카를 추가 수행한 호출을 확인한다. 


#### Order 서비스에 'Retry' Rule 추가

```bash
kubectl apply -f - <<EOF
  apiVersion: networking.istio.io/v1alpha3
  kind: VirtualService
  metadata:
    name: vs-order-network-rule
    namespace: tutorial
  spec:
    hosts:
    - order
    http:
    - route:
      - destination:
          host: order
      timeout: 3s
      retries:
        attempts: 3
        perTryTimeout: 2s
        retryOn: 5xx,retriable-4xx,gateway-error,connect-failure,refused-stream
EOF
```

#### Retry 확인 시나리오

- 새로운 주문을 한건 생성한다.
- 생성된 주문을 취소(DELETE Order ID)하려할 때, 존재하지 않는 배송서비스를 호출하도록 프로그래밍 되어 있는데
- 배송서비스 부재(우리가 배포한 적이 없다)로, '500'오류를 리턴하게 되고,
- 이를 수신한 Envoy Proxy가 'attempts' 설정횟수 만큼의 Retry를 실행한다.

```
kubectl exec -it siege -c siege -n tutorial -- /bin/bash

# 새로운 주문 생성
http POST http://order:8080/orders qty=5

# 생성된 주문 Key를 가지는 주문정보 삭제
http DELETE http://order:8080/orders/[생성된 Order ID]
```
- 이때, 데이터 플레인 엔보이 프락시에서 설정된 정책에 따라 내부적으로 재시도가 일어난다.


#### 재시도(Retry) 결과확인

- 추척 서비스인 예거를 접속해 발생한 주문서비스의 재시도를 확인해 본다.

- 검색조건: Service : siege.tutorial
- 화면 오른쪽 검색결과에서  총 4번의 추가 호출이 데이터플레인의 사이드카에서 요청되었음을 확인할 수 있다.

![image](https://user-images.githubusercontent.com/35618409/135967043-086c621e-c04a-4089-8432-e3db8a999a95.png)

- 해당 요청을 클릭하면 상세 요청 명세를 조회할 수 있다.
![image](https://user-images.githubusercontent.com/35618409/135967305-a6c93ef4-b2f1-48dd-8186-1ac20025b7f7.png)

#### Order 서비스에 대해 Retry를 1회로 하는 Policy를 적용해 보고, 반영결과를 확인해 보자.
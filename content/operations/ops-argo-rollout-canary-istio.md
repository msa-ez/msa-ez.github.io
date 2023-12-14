---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# [GitOps] Argo Rollout 와 Istio 를 통한 카나리 배포

## Argo Rollout 을 기반한 카나리 배포

<iframe width="1155" height="722" src="https://www.youtube.com/embed/KDrDEMfWygo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 
---
- Argo Rollout 과 Istio 의 Traffic Management 를 통하여 안정적인 카나리아 배포를 실습한다.


### Argo Rollout 설치
터미널에 아래를 입력하여 Argo rollout Plug-in을 설치한다.

```
kubectl create ns argo-rollouts

kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

### Argo Rollout 객체의 생성

다음 내용으로 rollout.yaml 파일을 생성한다.
```
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: example-rollout
spec:
  replicas: 10
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.19.10
        ports:
        - containerPort: 80
  minReadySeconds: 30
  revisionHistoryLimit: 3
  strategy:
    canary: #Indicates that the rollout should use the Canary strategy
      maxSurge: "25%"
      maxUnavailable: 0
      steps:
      - setWeight: 10
      - pause:
          duration: 10s # 1 
      - setWeight: 20
      - pause:
          duration: 10s # 1 hour
      - setWeight: 30
      - pause:
          duration: 10s # 1 hour
      - setWeight: 40
      - pause:
          duration: 10s # 1 hour


---

  apiVersion: "v1"
  kind: "Service"
  metadata: 
    name: "nginx"
    labels: 
      app: "nginx"
  spec: 
    ports: 
      - 
        port: 80
        targetPort: 80
    selector: 
      app: "nginx"
    type: "LoadBalancer"
```

#### Rollout을 배포한다.
```
kubectl apply -f rollout.yaml
```

### Argo CLI / Dashboard 의 설치
argo CLI kubectl Plugin 설치:

```
curl -LO https://github.com/argoproj/argo-rollouts/releases/latest/download/kubectl-argo-rollouts-linux-amd64
chmod +x ./kubectl-argo-rollouts-linux-amd64
sudo mv ./kubectl-argo-rollouts-linux-amd64 /usr/local/bin/kubectl-argo-rollouts
```
```
# 설치 버전 확인 
kubectl argo rollouts version  
```

Argo Dashboard 웹 서비스를 로컬에 올린다:

```
kubectl argo rollouts dashboard
# Argo Rollout 3100 Port-forwarding
# GitPod에서 3100 포트를 Public으로 설정하고 접속해 본다.
```

![Argo Dashboard](https://argoproj.github.io/argo-rollouts/dashboard/rollouts-list.png)

GUI환경이 지원되지 않을 때, Argo CLI로 모니터링하기:
```
kubectl argo rollouts get rollout example-rollout --watch
```
argo rollout 으로 배포를 실시한다:
```
kubectl argo rollouts set image example-rollout  nginx=jinyoung/app:blue
```
- Argo Rollout Dashboard 를 통하여 배포가 진행되는 과정을 살펴본다
- 브라우저를 통하여 배포된 서비스의 주소로 접속, 배포 과정에서 실제 서비스의 접속시 배경색이 흰색(nginx:1.19.x)에서 푸른색(jinyoung/app:blue)으로 교차되는 것을 확인한다.
```
# LoadBalancer Type으로 새성된 Nginx EXTERNAL-IP를 복사하여 접속
# 브라우저 '새로고침'이 아닌, 주소창에 마우스를 눌러 엔터키로 확인 (Because of Cache)
```

- 브라우저 리프래시가 힘들면 다음과 같이 watch 명령을 통하여 html 이 교차하면서 변경됨을 확인:
```
watch http <Rollout 서비스의 EXTERNAL IP>
```
## Istio를 통한 카나리 배포
- 다음의 Rollout 은 Virtual Service 의 Traffic 배분을 매 10초 간격으로 조정하면서 카나리 배포를 실시한다:
- Istio기반 Canary 배포와 함께 Argo rollout의 배포관련 추가 오퍼레이션을 학습한다.
- 다음 내용으로 canary.yaml 파일을 생성한다.
```
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: rollout-order
spec:
  replicas: 5
  strategy:
    canary:
      trafficRouting:
        istio:
          virtualService: 
            name: rollout-vsvc        # required
            routes:
            - primary                 # required
          destinationRule:
            name: rollout-destrule    # required
            canarySubsetName: canary  # required
            stableSubsetName: stable  # required
      steps:
      - setWeight: 5
      - pause:
          duration: 10s
      - setWeight: 20
      - pause:
          duration: 10s
      - setWeight: 40
      - pause:
          duration: 10s
      - setWeight: 60
      - pause:
          duration: 10s
      - setWeight: 80
      - pause:
          duration: 10s

  revisionHistoryLimit: 2
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
        image: "jinyoung/app:blue"
        ports:
        - name: http
          containerPort: 80
          protocol: TCP
        resources:
          requests:
            memory: 32Mi
            cpu: 5m

--- 
apiVersion: "networking.istio.io/v1alpha3"
kind: "Gateway"
metadata: 
  name: "shopping-gateway"
spec: 
  selector: 
    istio: "ingressgateway"
  servers: 
    - 
      port: 
        number: 80
        name: "http"
        protocol: "HTTP"
      hosts: 
        - "*"
---
  apiVersion: "v1"
  kind: "Service"
  metadata: 
    name: "order"
    labels: 
      app: "order"
  spec: 
    ports: 
      - 
        port: 80
        targetPort: 80
    selector: 
      app: "order"
    type: "LoadBalancer"

--- 

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: rollout-vsvc
spec:
  gateways:
  - shopping-gateway
  hosts:
  - "*"
  http:
  - name: primary       # referenced in canary.trafficRouting.istio.virtualService.routes
    match: 
    - uri: 
        exact: "/orders"
    rewrite:
      uri: "/"
    route:
    - destination:
        host: order
        subset: stable  # referenced in canary.trafficRouting.istio.destinationRule.stableSubsetName
      weight: 100
    - destination:
        host: order
        subset: canary  # referenced in canary.trafficRouting.istio.destinationRule.canarySubsetName
      weight: 0


---

apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: rollout-destrule
spec:
  host: order
  subsets:
  - name: canary   # referenced in canary.trafficRouting.istio.destinationRule.canarySubsetName
    labels:        # labels will be injected with canary rollouts-pod-template-hash value
      app: order
  - name: stable   # referenced in stable.trafficRouting.istio.destinationRule.stableSubsetName
    labels:        # labels will be injected with stable rollouts-pod-template-hash value
      app: order

```

위의 파일을 적용하고, 다음의 명령들을 통해 배포, 롤백, 다시 배포 (빠르게), 그리고 다시 롤백 (빠르게) 하는 방법을 수행한다:

```
# 반영
kubectl apply -f canary.yaml 

# 새버전 반영
kubectl argo rollouts set image rollout-order order=nginx

# 롤백 (카나리 롤백)
kubectl argo rollouts undo rollout-order

# 다시반영 (빠르게 - 카나리 off)
kubectl argo rollouts set image rollout-order order=jinyoung/app:blue
kubectl argo rollouts promote rollout-order --full

# 다시 롤백 (빠르게 - 카나리 off)
kubectl argo rollouts undo rollout-order
kubectl argo rollouts promote rollout-order --full
```

- 진행과정을 모니터링하기 위해 위의 GUI 대시보드 및 Order 서비스 관찰
```
# LoadBalancer Type으로 새성된 order EXTERNAL-IP를 복사하여 접속
# 브라우저 '새로고침'이 아닌, 주소창에 마우스를 눌러 엔터키로 확인 (Because of Cache)
```

- 다음의 커맨드로도 Text 기반 모니터링이 가능하다:

```
kubectl argo rollouts get rollout rollout-order --watch
```

- 또는, 서비스를 접속확인 하기 위해서 istio-ingress 주소를 얻어서 watch 로 변화를 확인한다:
- 얻어낸 external ip 뒤에 "/orders" 를 넣어서 watch 한다:
```
kubectl get svc istio-ingressgateway -n istio-system
watch http [istio-ingressgateway external ip]/orders
```


참고기사:  https://dev.to/stack-labs/canary-deployment-with-argo-cd-and-istio-406d
---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# 애플리케이션 패키징,도커라이징,클러스터 배포

### 12st 클라우드 네이티브 앱 배포

- Code > ProjectIDE로 GitPod에 진입한다.
- 터미널을 열어서 order 와 inventory, delivery, gateway 폴더로 각각 이동하여 아래 명령어를 실행한다.
- 마이크로서비스들이 EDA 통신하기 위한 Kafka 서버를 내 클러스터에 설치한다.

````
cd order
mvn package -B -Dmaven.test.skip=true
````
- target 폴더에 jar 파일이 생성이 되었는지 확인한다.
```
ls target/
java -jar target/order-0.0.1-SNAPSHOT.jar
```
명령으로 실행이 가능한지 확인한다.
- ctrl+c 를 눌러서 jar 실행에서 빠져 나온다.

### 1. 도커라이징

- order 와 delivery, gateway 의 최상위 root 에 Dockerfile이 있는지 확인한다.
- Dockerfile 파일이 있는 프로젝트 루트에서 아래 명령을 실행한다.  

````
 docker login # 최초, 한번만 실행해도 됨
 docker build -t [dockerhub ID]/order:[오늘날짜] .     
 docker image ls
 docker push [dockerhub ID]/order:[오늘날짜]  
````
- Docker hub에서 image 확인

### 2. 클러스터에 배포

#### 클러스터에 Event Store(kafka) 설치

Helm(패키지 인스톨러) 설치 (1회만 수행) 

- Linux : Helm 3.x 설치
```bash
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```
- Windows  : Helm 설치 참조 : https://lifeplan-b.tistory.com/37

#### helm으로 Kafka 설치 
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-kafka bitnami/kafka --version 23.0.5
```

- 설치 확인 
```
kubectl get all
```

#### 주문서비스 yaml로 배포

- order/kubernetes 폴더내의 deployment.yaml을 오픈한다.
- image: 부분을 push 한 이미지 명으로 수정한다:  [dockerhub ID]/order:[오늘날짜]  
- 저장후, 다음명령:
```
kubectl apply -f kubernetes/deployment.yaml

kubectl apply -f kubernetes/service.yaml
```

- 배포 확인 
```
kubectl get all
```

### 3. product, delivery, gateway에 대해서도 동일작업 수행

- 12stMall을 구성하는 다른 서비스에 대해서도 반복 실행하여 배포한다.

### 서비스 확인
- 게이트웨이 주소 확인
    - kubectl get svc
		
- Pod 생성 확인
    - kubectl get po 

- 재고 생성
    ```
    http [gateway IP]:8080/inventories id=1 stock=100
    ``` 
		
- 주문 생성
    ```
    http [gateway IP]:8080/orders
    http [gateway IP]:8080/orders productId=1 productName="TV" qty=3
    ``` 

### Kafka 클라이언트로 이벤트 확인

#### Kafka 메시지 확인하기
```
kubectl run my-kafka-client --restart='Never' --image docker.io/bitnami/kafka:3.5.0-debian-11-r21 --namespace default --command -- sleep infinity
kubectl exec --tty -i my-kafka-client --namespace default -- bash
kafka-console-consumer.sh --bootstrap-server my-kafka.default.svc.cluster.local:9092 --topic modelforops --from-beginning
```


### 잘 안될때
1. 쿠버네티스 객체 들이 이미 존재하는 경우, 다음을 통하여 객체들을 제거:
```
kubectl delete deploy --all
kubectl delete svc --all
```
1. External IP 로 접속이 되지 않는 경우
```
kubectl port-forward svc/order 8080:8080 
```
한 후, localhost:8080 으로 접속

1. ImagePullBackOff: 이미지 명이 잘못되었거나 push가 안된 경우 


### 더 많은 테스트
```
kubectl delete po --all
# 한후, 서비스 접속 -> 좀있다가 회복
kubectl get po   # po가 다시 생성되었음을 확인

kubectl scale deploy order --replicas=3
kubectl get po 
# order를 위한 pod가 3개가 생성됨을 확인
```

### 상세설명
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/0hTlS54gqxA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
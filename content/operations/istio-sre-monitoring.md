---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Service Reliability Engineering

## 주문서비스 SRE 모니터링 

- 주문서비스 SRE 엔지니어는 주문팀 내의 개발과 운영간 균형을 맞추기 위해 서비스 수준 지표와 목표를 측정하고 이를 모니터링하여 장애 발생에 따른 적절한 릴리스 주기를 조정한다. 
- 이를 위한 SRE 모니터링 대쉬보드를 작성해 본다.


### 실행 환경

- 클러스터에 Istio 서비스 메쉬와 Addon 서버가 설치되어 있어야 한다.
- (설치되어 있지 않은 경우,)
  - 다운로드한 Istio 폴더에서 Addon Server 설치
```
kubectl apply -f samples/addons
```  

#### SRE 모니터링 대상 서비스 배포

```
kubectl create ns shop
kubectl label namespace shop istio-injection=enabled
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/order-liveness.yaml -n shop
kubectl expose deploy order --port=8080 -n shop
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/delivery-rediness-v1.yaml -n shop
kubectl expose deploy delivery --port=8080 -n shop
# Client Pod deploy
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/siege-pod.yaml -n shop
# 배포확인
kubectl get pod -w -n shop
```

#### 새로운 터미널에서 Siege 컨테이너에 접속한다.

```
kubectl exec -it siege -n shop -- /bin/bash
siege -c1 -t3S -v http://order:8080/orders
```

#### Grafana WebUI 접속 
```
kubectl patch service/grafana -n istio-system -p '{"spec": {"type": "LoadBalancer"}}'
kubectl get service -n istio-system --field-selector metadata.name=grafana
```
- Grafana service EXTERNAL-IP에 접속한다.
- 아래와 같은 Grafana main WebUI가 나타난다.
![image](https://user-images.githubusercontent.com/35618409/183338028-f5ac4664-d30d-445b-8596-630afad7fc2c.png)


### 주문 SRE Dashboard 템플릿 로딩

다음 <a href="https://raw.githubusercontent.com/msa-school/Lab-required-Materials/main/Ops/Order-SRE-Monitoring.json" target="_blank">[ SRE Dashboard JSON 템플릿 ]</a> 링크를 클릭해 모든 내용을 복사하고 내 로컬 머신에 SRE-Template.json 이름으로 저장한다. 

- Create > Import > Upload JSON file 메뉴로 저장한 템플릿을 업로드 한다.
![image](https://user-images.githubusercontent.com/35618409/230059618-4da6b6cb-d26c-4207-b2bf-17664aa44768.png)

- Import를 클릭해 템플릿을 로드한다.
![image](https://user-images.githubusercontent.com/35618409/230060252-dd76d986-14b5-45d6-824b-9cced7b9babd.png)


#### SRE 대쉬보드에 설정된 디폴트 환경변수를 확인한다.

![image](https://user-images.githubusercontent.com/35618409/231659456-33e4139b-4457-485b-a2f9-12369136f9e7.png)

```
service_requests_error_count : istio_requests_total{app="order", response_code=~"5.*"}
service_requests_total_count : istio_requests_total{app="order"}
alerts_filter_criteria : app="order"
service_slo_target : 95
error_budget : 0.001389
correction_factor : 100
```
- 환경변수 설명
```
- 주문서비스에 적용된 SLI는 에러율(Error Rate)이며, (오류코드 요청수 ÷ 총 요청수)로 구할 수 있다.
- SLO(Service level objectives, 서비스 수준 목표)는 95%로 설정한다.
- Error Budget(오류 허용한도)는 60분으로 합의한다. (30일 * 24시간 * 0.001339 = 60분)
- 보정계수(correction_factor)로 Error Budget의 소진율(Burnout Rate) 조정이 가능하다.
```

- 다음과 같이 주문서비스 기본 SRE 대쉬보드가 나타난다.
![image](https://user-images.githubusercontent.com/35618409/231661245-68f2c9ff-82c7-4154-8e8b-21ab745f1208.png)

- 우측 상단의 데이터 범위와 갱신주기를 각각 1hour, 10s로 설정한다.


### 주문 SRE 테스트

- Siege 터미널에서 주문서비스에 워크로드를 발생한다.
```
siege -c5 -t120S -v http://order:8080/orders --delay=3S   
```

#### 장애발생(5xx)에 따른 Error Budget 차감 확인

- Siege로 서비스 내에 오류상황을 만들고, 장애 호출을 보낸다.
```
http PUT http://order:8080/actuator/down
siege -c5 -t180S -v http://order:8080/actuator/health --delay=3S
```

#### Error Budget 소진이 멈춘 이유

- 오류발생에 따라 소진되던 Error Budget은 주문 서비스에 설정된 Liveness Probe에 의해 Self-Healing 되어 더 이상 소진되지 않는다.
```
kubectl get po -n shop
NAME                        	READY   STATUS    RESTARTS       	AGE  
delivery-675bb9cc75-z98zj   	2/2     Running   0              		5h40m
order-577987bf74-kx9dn      	2/2     Running   1 (104s ago)   	  5h41m
siege                       	2/2     Running   0              		5h40m
```

- 다시 한번, 오류상황 발생 및 장애 트래픽을 생성해 보자.
```
http PUT http://order:8080/actuator/down
siege -c5 -t180S -v http://order:8080/actuator/health --delay=3S
```

#### Error Budget 확인

- 시스템 장애 요청 증가에 따라 SLO 수위가 낮아지고, 이에 따라 배포 가능한 허용 예산인 에러버젯이 차감하게 된다.
- Error Budget이 한계 수준이하로 내려가게 되면, SRE 엔지니어 및 DevOps개발자들에게 Alert이 전달된다. 
- Error Budget이 소진되면, 해당 팀은 새 버전 릴리즈를 중단하고 서비스 안정화(디버깅, 테스트, 자동화) 업무에 주력해야 한다.
---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# [Service Mesh] MSA 모니터링 w/ Istio addon Grafana

## Prometheus/Grafana기반 K8s 통합 모니터링

- 프로메테우스는 SoundCloud 에서 만든 go언어 기반 오픈소스 모니터링 툴
- kubernetes 환경에서 모니터링하기 원하는 리소스로부터 metirc을 수집하고 해당 메트릭을 이용해서 모니터링
- 이상 증세가 발생했을 때 Slack, Mail 또는 다른 Webhook을 이용해서 알림을 주는 등 확장 기능 제공


### 모니터링 서버 설치하기 (If not Installed)
- 다운로드한 Istio 폴더에서 Addon Server YAML로 설치
```
kubectl apply -f samples/addons
```

#### 모니터링 대상 마이크로서비스 배포 
- Shop 네임스페이스를 만들고, 주문과 배송서비스를 배포한다.
- 클라이언트용 Pod도 배포한다.
```
kubectl create ns shop
kubectl label namespace shop istio-injection=enabled
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/order-liveness.yaml -n shop
kubectl expose deploy order --port=8080 -n shop
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/delivery-rediness-v1.yaml -n shop
kubectl expose deploy delivery --port=8080 -n shop
# Client Pod deploy
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/siege-pod.yaml -n shop
```

### PromQL Test in Expression Browser

- 먼저, (External-IP 개수 제약에 따라) Istio 다른 Dashboard들의 Service Type을 ClusterIP로 수정해 두자.
```
kubectl patch svc kiali -n istio-system -p '{"spec": {"type": "ClusterIP"}}'
kubectl patch svc tracing -n istio-system -p '{"spec": {"type": "ClusterIP"}}'
```

- - Prometheus UI 사용을 위해 Service Scope을 LoadBalancer Type으로 수정한다.
```
kubectl patch service/prometheus -n istio-system -p '{"spec": {"type": "LoadBalancer"}}'
```
- Prometheus service EXTERNAL-IP:9090에 접속한다.
- 아래와 같은 PromQL Playground WebUI가 나타난다.
![image](https://user-images.githubusercontent.com/35618409/204709566-2bb3035e-631a-458e-aa4c-d1f4dfb94d3d.png)

- 계속하기 전 주문 서비스 엔드 포인트를 조회한다.
```
kubectl exec -it pod/siege -n shop -- /bin/bash
http GET http://order:8080
http GET http://order:8080/orders
```

- 다시 Expression 브라우저 화면에서
- 입력란에 커서를 두고, 메트릭을 입력하면 사용 가능한 메트릭이 자동완성되어 나타난다. 
- istio_requests 입력하고, 나타난 메트릭 중 'istio_requests_total'을 입력하고 실행(Execute 클릭) 한다.
![image](https://user-images.githubusercontent.com/35618409/204707729-ef1279f4-9cfa-4540-8591-4c901ede7e99.png)

- 조회된 결과는 해당 메트릭으로 가능한 모든 라벨(메트릭의 필터)을 보여준다.

- 이번엔 라벨을 활용하여 주문서비스 모든 요청횟수를 조회해 본다.
```
istio_requests_total{destination_service_name="order",app="order"}
```

- 멀티 라벨로 주문서비스의 다차원 데이터 모델을 조회해 본다.
```
istio_requests_total{app="order", destination_service="order.shop.svc.cluster.local", response_code = "200"}
istio_requests_total{app="order", destination_service="order.shop.svc.cluster.local", response_code != "500"}
```
- 아래와 같이 Kubernetes 메타정보와 응답코드를 포함한 Label 정보가 출력된다.
![image](https://user-images.githubusercontent.com/35618409/204709400-86633082-50ec-46a7-af14-c29dfc1d069e.png)

- 이번엔 Siege로 주문서비스에 부하를 발생한다.
```
siege -c30 -t40S -v http://order:8080
```
- Expression Browser에 아래 쿼리로 모니터링한다.
```
rate(istio_requests_total{app="order",destination_service="order.shop.svc.cluster.local",response_code="200"}[5m])
```
- 'Graph' 탭을 클릭한다.
- 지난 5분간 Data로 PromQL기반의 그래프가 나타난다.
![image](https://user-images.githubusercontent.com/35618409/183346842-1dda3245-d264-452e-9a2a-9c016ff7318e.png)
- 보다 상세한 Istio기반 메트릭은 아래 링크를 참조한다.
- [Istio Standard Metrics 참조](https://istio.io/latest/docs/reference/config/metrics/)
- 이제, Istio 메트릭 기반으로 Grafana를 통해 대쉬보드를 시각화해 보자


## 서비스 모니터링 in Grafana  

- Grafana 서비스 Open 
```
kubectl patch service/grafana -n istio-system -p '{"spec": {"type": "LoadBalancer"}}'
```
- Grafana service EXTERNAL-IP에 접속한다.
- 아래와 같은 Grafana main WebUI가 나타난다.
![image](https://user-images.githubusercontent.com/35618409/183338028-f5ac4664-d30d-445b-8596-630afad7fc2c.png)

#### Built-in Dashboard 뷰
- 왼쪽 Search 아이콘 메뉴를 클릭 후, Istio 폴더를 펼친다.
- 목록 중, Istio Service Dashboard를 클릭한다.
- 조회 조건에서 order.shop.svc.cluster.local 설정하면 istio Built-in Dashboard가 나타난다.


#### Grafana providing Dashboard 활용하기
- 왼쪽 메뉴 중, 돋보기 아래 '사각형 4개가 모여있는' 메뉴를 클릭한다.
![image](https://user-images.githubusercontent.com/35618409/204796971-0e1840ce-4781-421c-90a0-680bebcbb172.png)
- Grafana dashboard id 입력란에 '6417'번을 입력하고 Load를 클릭 후, 로딩된 차트를 확인한다.
- 동일한 방법으로 Grafana dashboard id 입력란에 '315'번을 입력하고 차트를 로딩한다.
- 접속한 Siege 터미널에서 주문서비스로 부하를 발생시킨다.
``` 
kubectl exec -it pod/siege -n shop -- /bin/bash
siege -c20 -t30S -v http://order:8080
```
- 부하량에 따른 서비스 차트의 실시간 Gauge를 확인한다.
- 아래와 같이 Network IO, CPU, Memory 사용량이 실시간 증가한다.
![image](https://user-images.githubusercontent.com/35618409/183344194-8f4e571b-3640-4c54-8896-e7b7c6b3a7ca.png)


### Dashboard Customizing

- '315' id의 쿠버네티스 모니터링 차트에서 주문서비스 요청율(rps)을 상단에 추가해 본다.
- 화면 상단의 'Add panel'을 클릭하여 empty panel을 추가한다.
![image](https://user-images.githubusercontent.com/35618409/183352278-f8e02a99-cb2d-4fa3-9e20-5a1b55a147e0.png)


- 새로운 패널을 추가할 수 있는 Blank 페이지가 로딩된다.
- UI 오른쪽에 Panel title에 '주문서비스 요청율'을 입력한다.
- 왼쪽 아래 Metric Browser 란에 아래 PromQL을 입력한다.
- (이때, Builder가 아닌, 'Code'를 선택하여 직접 붙여넣는다.)
```
rate(istio_requests_total{app="order",destination_service="order.shop.svc.cluster.local"}[5m])
```
![grafana-edit](https://github.com/acmexii/demo/assets/35618409/1c5f5aa8-8a78-447c-a451-32c461f73ec9)
- apply를 눌러 적용한다.

- 패널을 추가한 다음, 패널의 모서리를 클릭하여 전체 크기로 조정한다.
- 상단의 저장 아이콘을 눌러 차트를 저장한다.
![grafana-customized](https://github.com/acmexii/demo/assets/35618409/af02a248-c7f0-4467-95ae-780bda93fbda)

- 클러스터 현황과 주문팀 요청율을 모니터링할 수 있는 대쉬보드가 완성되었다.

#### Dashboard 참조 URL
- 아래 링크를 통해 Grafana가 제공하는 더 많은 대쉬보드를 검색하여 참고할 수 있다.
- [Grafana Dashboard 참조](https://grafana.com/grafana/dashboards/)


### 이상감지 & Alerting

#### 가상 시나리오
- 외부로부터 주문서비스로의 DDOS 공격에 대한 트래픽 임계치를 설정하고 이상이 감지되었을 때 이를 설정된 채널에 얼럿팅해 본다.
- 얼럿팅 채널은 슬랙(Slack)을 적용한다.   

#### Alert 조건 설정
- 수정한 쿠버네티스 클러스터 차트(id: 315)의 '주문서비스 요청율' Graph를 편집한다.
- 하단의 3번째 탭인 Alert을 클릭하여 Alert Rule을 생성한다.
![image](https://user-images.githubusercontent.com/35618409/204773849-5f135040-fc0e-4213-82fb-424f93b3ea49.png)

#### 1. Set a query and alert Condition
![grafana-alert-1](https://github.com/acmexii/demo/assets/35618409/fcdccf29-12d0-4285-9bf9-025b5ae0ffb0)
- Alert을 위한 Query와 임계치를 설정한다.
- 임계치를 "평균 초당 RPS 20"으로 설정한다.
- Condition WHEN > avg() 선택, IS ABOVE > 20 입력

#### 2. Alert evauation
![grafana-alert-2](https://github.com/acmexii/demo/assets/35618409/ed83486e-bc9c-478c-bb96-4ea6df44c345)
- 매 10초마다 체크하되, 임계치를 초과하여 15초 이상 지속되면 DDOS 공격으로 간주한다.

#### 3. Add Alert details
![grafana-alert-3](https://github.com/acmexii/demo/assets/35618409/f91fafd4-2cf5-4aca-9a4f-e432709fdd65)
- 저장 폴더와 그룹정보를 설정한다.
- Folder는 istio를 선택하고, Group에는 'shop'을 입력한다.

#### 4. Save and Confim the Alert
![grafana-alert-4](https://github.com/acmexii/demo/assets/35618409/8bebe366-dbe4-40d1-8603-5967c8f11a40)
- 최종 설정된 Alert을 확인한다. (Normal)상태로 조회된다.
- 임계치를 초과하면 Pending으로, 설정된 10초이상 지속되면 Firing 상태로 전환된다.

- Alert이 설정된 차트 제목앞에 ♥가 붙는다.
- 설정 내용을 정리해 보면,
- 10초 주기로 평가해서 요청율이 20을 넘게되면 "Pending" 상태로 바뀌고, 15초 동안 지속되면 Alert이 "Firing"된다.
- 이때, 요청율이 15초 동안 지속되지 않으면 다시 "Normal" 상태로 전환된다.
- 차트 제목앞에 붙는 ♥의 색상으로도 Alert 상태 구분 가능 (녹색:Normal, 황색:Alert Pending, 적색:Alert Firing)


#### 명시적 Alert 발생(DDOS Attack)

- Siege 부하로 초당 요청율이 임계치를 상회하도록 워크로드를 발생시킨다..
```
kubectl exec -it pod/siege -n shop -- /bin/bash
siege -c10 -t40S -v http://order:8080
```
- Alerting 메뉴의 Alert rules 탭을 보면 'PENDING' 상태를 가진 '주문서비스 요청율'이 목록에서 조회된다.
- (15초 이상 경과되면, 설정된 DDOS 공격으로 간주되어 'Firing' 상태로 바뀐다.
![grafana-alert-5](https://github.com/acmexii/demo/assets/35618409/b8608379-9cc5-42f4-aeb1-87efb55e7aef)


### Notification 설정

Alert이 Firing 될때마다 슬랙(Slack) 채널로 수신해 보자.

- Alerting 메뉴의 두번째 메뉴인 "Contact points"를 클릭한다.
![image](https://user-images.githubusercontent.com/35618409/204790130-ab2c09b4-1079-45ab-b682-44b4dd541bfa.png)
- 기본 Contact points를 Slack으로 받기 위해 grafana-default-email 편집 아이콘(몽당 연필)을 누른다.

- grafana-default-email 이름을 가진 Email 타입의 Alert rules 이 보이는데 편집 아이콘(몽당 연필)을 눌러 본다.
![image](https://user-images.githubusercontent.com/35618409/204790625-5b3ce11b-257d-44d8-9078-5c177322accb.png)
- 이름을 grafana-default-slack으로 수정한다.
- Contact point type을 'Slack'으로 지정한다.

#### Slack 설정 

```
Recipient : #microservice-digging
Token : 

# Optional Slack settings 을 펼쳐 아래 내용을 추가
Title : {{len .Alerts.Firing}} firing, {{len .Alerts.Resolved}} resolved
Text Body : {{range.Alerts}}{{.Status}}: {{.Labels.alertname}}{{end}}
```
- 테스트를 눌러 동작 여부를 확인한다.
![image](https://user-images.githubusercontent.com/35618409/204793483-96d8333d-3445-41fc-b57e-9f6d33114d97.png)

- Token과 API 설정이 올바르다면 얼럿 메시지가 수신된다.
- ![image](https://user-images.githubusercontent.com/35618409/204793841-591eeacf-23f6-4844-b422-ba1bc38a3be3.png)  

- 테스트까지 종료 후, Save contact point 를 눌러 저장한다.


#### 테스트 Slack Notification

- 다시 Siege 부하로 워크로드를 발생시키고 Alerting 상태와 Slack을 모니터한다...
```
kubectl exec -it pod/siege -n shop -- /bin/bash
siege -c10 -t40S -v http://order:8080
```

- 슬랙 채널에 DDOS 공격에 의한 Alet 메시지 수신이 자동으로 확인된다.
![image](https://user-images.githubusercontent.com/35618409/204797293-59740055-385a-4ecd-8ad5-9ca3c3ef2ae8.png)


### 기타 Notification Type 

Kafka를 포함한 다양한 Contact point Type과 각 Type별 필요한 추가정보를 설정을 할 수 있다.

#### E-Mail

- Notification이 Email 인 경우, 수신자 메일주소를 등록한다.
- 'Test' 버튼을 눌러보자.
  > SMTP 정보를 grafana.ini에 등록해야 한다는 메시지가 출력된다.

```
kubectl edit cm grafana -n istio-system
```

- default 설정
```
  grafana.ini: |
    [analytics]
    check_for_updates = true
    [grafana_net]
    url = https://grafana.net
    [log]
    mode = console
    [paths]
    data = /var/lib/grafana/
    logs = /var/log/grafana
    plugins = /var/lib/grafana/plugins
    provisioning = /etc/grafana/provisioning
```
- 아래 내용을 추가한다. (GMail 일 경우, 예시)
```
    [smtp]
    enabled = true
    host = smtp.gmail.com:587
    user = gmail-user@gmail.com  # Mail Account
    password = ************             # Password
    skip_verify = true
```
- 편집 후, Grafana Pod를 재시작한다.
```
kubectl delete pod/GRAFANA-POD-객체 -n istio-system
```
- SMTP 설정은 메일 서버의 2-Factor인증에 따라 제대로 working하지 않을 수 있다.


#### 기타 Notification 설정 참조 URL
https://grafana.com/docs/grafana/latest/alerting/contact-points/notifiers/
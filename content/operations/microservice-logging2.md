---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# 마이크로서비스 통합 로깅 with Loki stack

## 마이크로서비스 Loggregation w/ Loki-stack

Promtail, Loki, Grafana를 사용하여 12st Mall의 로그들을 통합하여 모니터링해 본다.

### Install PLG Stack

- Promtail은 각 노드의 애플리케이션 로그나 시스템 로그를 Loki로 전송하는 수집기
- Loki는 로그수집기인 Promtail에서 전송해주는 데이터를 저장하는 File기반 저장소
- Grafana는 Loki 저장소로부터 데이터를 조회해 다양한 차트로 보여주는 시각화 서버

### Promtail 동작유형

- DaemonSet 방식(default) : 각 노드마다 Promtail 파드가 실행되며 해당 노드장비에서 실행중인 파드의 로그를 추적 
- Sidecar 방식 : 각 파드에 컨테이너로 추가되어서 실행되며 해당 파드내부에서 로그파일을 읽어서 Loki로 전송

## Install with Helm

- if Helm is not available.
```
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```

- Helm에 Grafana 저장소 추가
```
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

- grafana 저장소에서 제공하는 loki-stack 에는 Promtail, Loki, Grafana에 Prometheus까지 기본 구성
- grafana 에서 제공하는 loki-stack 스크립트(values.yaml)를 수정하여 설치 
- loki-stack 설치 스크립트 다운로드
```
helm show values grafana/loki-stack > ./loki-stack-values.yaml
```

- loki-stack-values.yaml을 편집하여 아래처럼 PLG 스텍만('true'로 수정) 선택한다.
```
test-pod: enabled: false
loki: enabled: true
promtail: enabled: true
fluent-bit: enabled: false
grafana: enabled: true
prometheus: enabled: false
filebeat: enabled: false
logstash: enabled: false
```

- Helm으로 PLG 스텍 설치 
```
kubectl create namespace logging
helm install loki-stack grafana/loki-stack --values ./loki-stack-values.yaml -n logging
```

- 설치된 Pod 목록을 확인한다.
```
kubectl get pod -n logging
```
- Loki Pod는 StatefulSet으로 설치된다.


### 통합 로깅 대상 서비스 설치
```
kubectl create ns shop
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/order-liveness.yaml -n shop
kubectl expose deploy order --port=8080 -n shop
kubectl apply -f https://raw.githubusercontent.com/acmexii/demo/master/edu/delivery-rediness-v1.yaml -n shop
kubectl expose deploy delivery --port=8080 -n shop
```

## Grafa Dashboard 보기

- Grafana External-IP 생성
```
kubectl patch svc loki-stack-grafana -n logging -p '{"spec": {"type": "LoadBalancer"}}'
```

- 발급된 External-IP로 브라우저에서 접속한다.
![image](https://github.com/acmexii/demo/assets/35618409/a1be85e0-030d-474f-9d9e-b39b5499815d)

- username에는 'admin', Password에는 아래 명령어 결과를 복사하여 Login 한다.
```
kubectl get secret loki-stack-grafana -n logging -ojsonpath='{.data.admin-password}' | base64 -d
```

- Grafana Main(8.3.5)이 출력된다.
![image](https://github.com/acmexii/demo/assets/35618409/38ade0db-3480-419d-a12a-ad78e70144ab)


### Loki Data Source 확인

- 왼쪽탭 톱니바퀴 아이콘을 클릭하여 Loki Data Source를 확인하고 페이지 하단 'Test' 버튼을 클릭한다.
![image](https://github.com/acmexii/demo/assets/35618409/710e4251-0ea7-4f29-83d7-84e1ac95c59b)

### Log 확인

- 왼쪽탭 나침반(Explore) 아이콘을 클릭하고, 우측 상단에 Loki 데이터소스를 확인한다.
![image](https://github.com/acmexii/demo/assets/35618409/5a011683-a222-44eb-a846-cb7fb879a412)

- "Log browser >" 입력창에 LogQL을 입력하거나, "Log Browser >"를 클릭하여 앱 레이블을 선택한다.
- "app" 탭에서 "delivery" 와 "order"를 컨트롤 키를 눌러 동시에 선택하고 아래 "Show logs" 버튼을 클릭한다.
![image](https://github.com/acmexii/demo/assets/35618409/ffb26178-88ed-40c1-b400-57dcfc8bf45d)

- 실행시간에 따른 주문, 배송서비스 로그가 로그리게이션되어 나타난다.
![image](https://github.com/acmexii/demo/assets/35618409/3ac86853-4e65-40c6-966c-88e2f280476a)


## LogQL: Log Query Language 

- Loki는 LogQL 이라는 Loki Server에서 로그를 쿼리하기 위한 질의어를 제공한다. (선택 label을 가진 분산 grep으로 이해)

### Log Stream Selector

- 쿼리 표현식의 label 부분을 중괄호 {}로 묶은 다음 key value 구문을 사용하여 label을 선택
- 다수의 label 표현식들은 쉼표로 구분
```
{app="mysql",name="mysql-backup"}
{name=~"mysql.+"}
{name!~"mysql.+"}
```
- Prometheus Label Selectors에 적용되는 규칙이 Loki Log Stream Selectors에 동일하게 적용

### Filter Expression

- Log Stream Selector를 작성한 후 검색 표현식을 작성하여 결과값을 추가로 필터링 한다.
- 검색 표현식은 단순 텍스트 또는 정규 표현식이 가능하다.
```
{job="mysql"} |= "error"
{name="kafka"} |~ "tsdb-ops.*io:2003"
```

### Related links

- https://grafana.com/docs/loki/latest/logql/
- https://github.com/grafana/loki/tree/master/production/helm
- https://github.com/grafana/loki/blob/master/docs/querying.md

## Uninstall Loki Stack
```
helm uninstall loki-stack -n logging
kubectl delete ns logging
```
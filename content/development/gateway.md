---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# API Gateway

### 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/lab-shop-gateway](https://www.msaez.io/#/storming/lab-shop-gateway)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 아래처럼 렙에 필요한 이벤트스토밍 기본 모델이 출력된다.   
![image](https://github.com/acmexii/demo/assets/35618409/39ccf71e-3977-4093-9bae-7c2a1254d710)


### API Gateway를 사용하여 마이크로 서비스들의 엔드포인트 단일화

- 메뉴의 CODE > ProjectIDE 를 선택하여, 연결된 브라우져 IDE를 로딩한다.
- 터미널에서 http 클라이언트를 설치하고 kafka를 Local에 컨테이너 기반으로 실행한다.
```
pip install httpie
cd infra
docker-compose up
```

- monolith 마이크로 서비스를 실행한다.
```
cd monolith
mvn spring-boot:run
```

- gateway 마이크로 서비스를 실행한다.
```
cd gateway
mvn spring-boot:run
```

- 기동된 monolith 서비스를 호출하여 주문 1건을 요청한다.
```
  http localhost:8081/orders productId=1 qty=3
  http localhost:8081/orders
```
    
- 게이트웨이를 통하여 같은 url 을 port 를 변경하여 실행한다.
```
 http localhost:8088/orders productId=1 qty=1
 http localhost:8081/orders  # can find the order item here
 http localhost:8088/orders  # can find the order item here also
```
  
- inventory 마이크로 서비스를  실행한다.
- 게이트웨이서비스의 application.yaml 의 spring.cloud.gateway.routes 에 아래 설정을 추가하여 inventory 서비스로의 라우팅을 추가한다. (indent 에 주의해주세요)
```yaml
      - id: inventory
        uri: http://localhost:8082
        predicates:
          - Path=/inventories/** 
```

- 게이트웨이 서비스를 재기동 한다.
- 8082 포트로  서비스를 호출하여 보고, 게이트웨이를 통하여 서비스를 호출한다.  
```
http localhost:8082/inventories
http localhost:8088/inventories
```

### 게이트웨이 커스터마이징 방법
https://www.baeldung.com/spring-cloud-custom-gateway-filters
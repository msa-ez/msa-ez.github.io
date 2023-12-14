---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Choreography Saga with Axon Framework

## Axon Saga Labs

12st Mall에 Axon Framework 템플릿으로 EDA 통신을 적용해 본다.
기본적으로 생성된 템플릿 코드에 Biz 로직을 추가해 주문 프로세스가 동작하도록 코드를 완성해 본다.

- Axon은 Event Sourcing 사상으로 매번 Replay를 통해 데이터 상태를 주입한다.
- Axon Server 자체로 Event Store 기능을 수행하며, Offset은 각 서비스들이 자체 관리한다.

### GitPod Start

- Code > Project IDE를 눌러 모델코드를 GitPod 환경에서 로딩한다.


### Axon Server 

#### infra > docker-compose.yml 

- Axon Server는 대시보드를 위한 8024, 메시지 gRPC를 위한 8124 포트를 사용한다.
- 각 서비스들의 Offset Token 관리를 위한 Token Store(MySQL)가 Lab 실행시 생성된다.

## Order Service

- 기본적으로 생성된 모델기반 코드에 Biz Logic을 추가해 서비스 코드를 완성한다.

#### OrderAggregate

- api 패키지에 Command와 Query를 위한 Controller가 위치한다.
- aggregate 패키지에 있는 OrderAggregate.java에서 CommandGateway를 통해 실행될 Command와 EventSourcingHandler가 확인된다.
- 각 EventSourcingHandler에 Command에 따른 Biz Logic(Domain State Changing) 코드를 삽입해 보자.
```
# 61 line, When order placed.
        setStatus("OrderPlaced");

# 67 line, When order completed.
        setStatus("OrderCompleted");       
```

- 이로써, 커맨드에 따른 상태변화 정보가 Event Store에 저장된다.

#### PolicyHandler

- policy 패키지 PolicyHandler.java에 배송시작에 따라 주문 완료처리 코드를 삽입한다.
```
# 34 line, Insert following ACL Code. 
        command.setOrderId(deliveryStarted.getOrderId());  
```

#### CQRS Handler

- query 패키지에 있는 CQRS 구현코드를 확인한다.
- @EventHandler에서 Query Model을 구현하며, @QueryHandler에서 이를 조회한다.


## Delivery Service

- 배송서비스도 주문에 따른 (1)배송프로세스 시작 로직과 (2)배송 상태정보 변경 로직을 삽입해 본다.
```
# (1) PolicyHandler.java, Line 34에 아래 코드를 추가
        command.setUserId(orderPlaced.getUserId());
        command.setAddress("SEOUL AMSADONG");
        command.setOrderId(orderPlaced.getOrderId());
        command.setProductId(orderPlaced.getProductId());
        command.setQty(orderPlaced.getQty());
        // command.setStatus("DeliveryStarted");  EventSourcingHandler에서 Status 설정
```

```
# (2) DeliveryAggregate.java, Line 54에 아래 코드를 추가
		setStatus("DeliveryStarted");
```

## Product Service

- 상품서비스도 주문에 따른 (1)상품재고 차감 로직과 (2) 상품 상태정보 변경 로직을 삽입해 본다.

```
# (1) PolicyHandler.java, Line 34에 아래 코드를 추가
        command.setProductId(orderPlaced.getProductId());
        command.setStock(orderPlaced.getQty());
```

```
# (2) ProductAggregate.java, Line 57에 아래 코드를 추가
		setStock(getStock() - event.getStock());
```

## 12st Mall 테스트

- Rest API를 활용해 생성된 Axon Saga 기반 몰을 테스트 한다.

- 먼저 Common API를 빌드한다.
```
cd common-api
mvn clean install
```

- 각 마이크로 서비스를 실행한다.
```
# new terminal
cd order
mvn clean spring-boot:run

# new terminal
cd product
mvn clean spring-boot:run

# new terminal
cd delivery
mvn clean spring-boot:run
```

- 상품서비스(:8082)에 테스트용 상품을 등록한다.
```
# new terminal
http POST :8082/products productName=TV stock=100
```

- 등록된 상품 Id를 복사해 둔다.
![image](https://user-images.githubusercontent.com/35618409/229345799-6a86743c-d3b1-43b7-9a94-91c4e50cfd9b.png)

- 복사한 상품 Id로 10개의 TV를 구매하는 주문을 생성한다.
```
http POST :8081/orders productId=[상품 Id] productName=TV qty=10 userId=1001
```

- 생성된 주문 Id를 복사해 둔다.
![image](https://user-images.githubusercontent.com/35618409/229346264-89d2c227-5dc8-454d-acb0-1c24bc0da63d.png)


### 12st Mall 테스트 검증

#### 주문 서비스

- 주문 Id로 조회 했을 때, status가 'OrderCompleted' 로 확인된다.
```
http GET http :8081/orders/[주문 Id]
```

#### 상품 서비스

- 상품 Id로 조회했을 때, 재고 수량이 90개로 확인된다.
```
http GET :8082/products/[상품 Id]
```

#### 주문 서비스 Event 이력 조회

```
http GET http :8081/orders/[주문 Id]/events
```


#### 배송 서비스
```
http GET :8083/deliveries
```
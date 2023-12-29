---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Choreography Saga

Event Sourcing, Domain driven Development 개발 및 CQRS를 지원하는 전문 Framework 중 하나인 Axon을 활용하여 Event driven한 12st Mall 을 구현하는 과정을 실습힌다. 특히, Domain 이벤트에 따라 커맨드를 Orchestration하는 프레임워크 레벨의 코드를 학습한다.

### 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/axon-mallorchestrationsaga:v1.5](https://www.msaez.io/#/storming/axon-mallorchestrationsaga:v1.5)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 로딩된 모델은 우측 팔레트 영역에 스티커 목록이 나타나지 않는다. 상단 메뉴영역에서 포크 아이콘(FORK)을 클릭해 주어진 모델을 복제한다. 
- 우측 팔레트 영역에 스티커 목록들이 나타나는 것이 확인된다.

### Orchestration Saga 시나리오

- 주문 커맨드에 따라 OrderPlaced 이벤트가 생성된다.
- OrderPlaced 이벤트로 Order Saga 프로세스가 구동된다.
- Saga Process는 배송시작 커맨드를 호출하고 DeliveryStarted 이벤트를 생성한다.
- 이어, 재고차감 커맨드가 호출되고 StockDecreased 이벤트를 생성한다.
- 최종 주문상태를 업데이트하는 절차로 Saga Process는 종료된다.
- 각 커맨드 호출시, 오류가 발생하면 이의 처리를 위해 Compensation Logic이 각각 실행된다. 

### Saga Modeling

- 모델 상단의 Fork 메뉴를 클릭한다.
- 복제돤 모델을 다음과 같이 오케스트레이션 한다.

### Process Orchestration 

오케스트레이션 Saga 모델링 규칙은 다음과 같다.
> 1. 스티커를 선으로 연결한다. 'From Sticker' > 'To Sticker'
> 2. 매핑 릴레이션을 클릭하여, 레이블을 부여한다. 레이블은 실행 순서를 의미
> 3. 레이블 중, '가 붙은 프로세스는 보상처리(Compensation Trx) 프로세스 임 
- OrderPlaced > Order Saga, (1.start)
- Order Saga > start delivery, (2)
- DeliveryStarted > Order Saga, (3)
- Order Saga > decrease stock, (4)
- StockDecreased > Order Saga, (5)
- Order Saga > update status, (6)
- OrderCompleted > Order Saga, (7.end)
- Order Saga > order cancel, (2')
- Order Saga > cancel delivery, (4')

#### 오케스트레이션 Saga 모델링 결과는 다음과 같이 보여진다.

![image](https://user-images.githubusercontent.com/35618409/229645326-3a24d5e3-81f3-4ecb-9e6f-2101302eb697.png)


### Code 생성 및 내 Git 리파지토리에 푸쉬 

- Code Preview > Git 아이콘을 눌러 내 레파지토리에 푸쉬한다.
![image](https://user-images.githubusercontent.com/35618409/229663138-ec1a8a2c-a50f-4c3c-ba4c-75c1ea9057ad.png)

![image](https://user-images.githubusercontent.com/35618409/229649084-15d388b9-3246-43b2-956c-d1012f47ce12.png)

- GitPod 환경에서 로딩한다.
![image](https://user-images.githubusercontent.com/35618409/229649200-cd48e7fb-54bb-46af-9806-0f893d9375bb.png)


### Axon Server 확인

#### infra > docker-compose.yml 
- Axon Server는 대시보드를 위한 8024, 메시지 gRPC를 위한 8124 포트를 사용한다.
- 각 서비스들의 Offset Token 관리를 위한 Token Store(MySQL)가 Lab 실행시 생성된다.


## Orchestration Saga Code Completion 

### Product Service

상품 Domain 코드에 Biz 로직을 완성한다.

- 재고 부족시 도메인 오류 발생코드를 추가한다.
```
# ProductAggregate - @DecreaseStockCommand 재고부족시 Exception 발생 
	if(this.getStock() < command.getStock()) throw new IllegalStateException("Out of Stock. !");  // 코드추가
```

- product > ProductAggregate.java 내 다음 코드를 추가한다.
```
# @EventSourcingHandler :: StockIncreasedEvent : 
    setStock(getStock() + event.getStock());  // 코드추가

#  @EventSourcingHandler :: StockDecreasedEvent : 
    setStock(getStock() - event.getStock());  // 코드추가
```


### Order Service

주문 Domain 코드에 Biz 로직을 완성한다.

- order > OrderAggregate.java 내 다음 코드를 추가한다.
```
# @EventSourcingHandler :: OrderPlacedEvent :
     setStatus("OrderPlaced"); 			// 코드추가
# @EventSourcingHandler :: OrderCompletedEvent : 
     setStatus("OrderCompleted"); 		// 코드추가
# @EventSourcingHandler :: OrderCancelledEvent :      
      setStatus("OrderCancelled");		// 코드추가
```

### Delivery Service

배송 Domain 코드에 Biz 로직을 완성한다.

- delivery > DeliveryAggregate.java 내 다음 코드를 추가한다.
```
# @EventSourcingHandler :: DeliveryStartedEvent :
      setStatus("DeliveryStarted"); 		// 코드추가
# @EventSourcingHandler :: DeliveryCancelledEvent : 
      setStatus("DeliveryCancelled"); 		// 코드추가
```

### OrderSaga 

주문 오케스트레이션을 수행하도록 OrderSaga 코드를 완성한다.

#### 1. Saga Start

- OrderPlaced 이벤트로부터 Correlation key 설정 : 24 라인
```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 2. 배송시작 Command 생성 및 호출 : 27라인
``` 
command.setOrderId(event.getOrderId());
command.setProductId(event.getProductId());
command.setQty(event.getQty());
command.setUserId(event.getUserId());

# 배송실패시, 주문취소 Compensation 처리 : OrderCancelCommand
orderCancelCommand.setOrderId(event.getOrderId());  	// 코드추가
```

#### 3. DeliveryStartedEvent 이벤트로부터 Correlation key 설정

```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 4. 재고차감 Command 생성 및 호출 
```
command.setProductId(event.getProductId());
command.setStock(event.getQty());	
command.setOrderId(event.getOrderId());

# 재고차감 실패시, 배송취소 Compensation 처리 : CancelDeliveryCommand
cancelDeliveryCommand.setDeliveryId(event.getDeliveryId());	// 코드추가
```

#### 5. StockDecreasedEvent 이벤트로부터 Correlation key 설정

```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 6. 주문완료 Command 생성 및 호출 
```
command.setOrderId(event.getOrderId());
```

#### 7. Saga End

- OrderCompletedEvent 이벤트로부터 Correlation key 설정
```
	@SagaEventHandler(associationProperty = "orderId")
```
- Saga Process 종료



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


## 12st Mall Saga Compensation 검증

### 주문 생성

- 상품 Id로 100개의 TV를 구매하는 주문을 생성하고 주문번호를 복사해 두자.
```
http POST :8081/orders productId=[상품 Id] productName=TV qty=100 userId=1001
```

- 재고 개수(90)보다 많은 주문으로 상품서비스에서 오류를 리턴한다.


- 주문 번호로 생성된 주문의 최종 상태와 이벤트 이력을 조회해 본다.
```
http GET :8081/orders/[주문번호]
http GET :8081/orders/[주문번호]/events
```

- 배송서비스의 배송 상태를 조회해 본다.
```
http GET :8083/deliveries
```

### [확장 미션] - 주문서비스 Debugging

- 주문서비스를 종료한다.
- OrderSaga 에 SagaEventHandler별로 Break Points를 추가한다.
- 주문서비스를 디버그 모드로 실행한다.

- 새로운 주문을 생성한 다음 Debug Point를 확인하면서 Orchestration 흐름을 식별한다.
- 재고보다 많은 수량을 넣어 Debug Point를 확인한다.
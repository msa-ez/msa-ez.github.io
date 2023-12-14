---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Orchestration Saga with Axon Framework



## Axon Saga Labs

Apply Orchestration type with high Process Visibility to 12st Mall order process.
Add Biz logic to the basically created template code to complete the code so that the ordering process works.

### Scenario

- OrderPlaced event is being created by order command.
- Order Saga process runs after OrderPlaced event.
- Saga Process calls start delivery command and creates DeliveryStarted event.
- Then, decrease stock command is being called and creates StockDecreased event.
- The Saga Process ends with updating final order status.
- When calling each commands, the Compensation Logic runs to handle errors.


### Saga Modeling

- Click Fork button at the top of the model.
- Orchestrate the copied model as below.

![image](https://user-images.githubusercontent.com/35618409/229645326-3a24d5e3-81f3-4ecb-9e6f-2101302eb697.png)

#### Process Orchestration ( > direction, () Label)
- OrderPlaced > Order Saga, (1.start)
- Order Saga > start delivery, (2)
- DeliveryStarted > Order Saga, (3)
- Order Saga > decrease stock, (4)
- StockDecreased > Order Saga, (5)
- Order Saga > update status, (6)
- OrderCompleted > Order Saga, (7.end)
- Order Saga > order cancel, (2')
- Order Saga > cancel delivery, (4')


#### Code Push & Load on GitPod

- Click Git icon from Code Preview to push the code into your own repository.
![image](https://user-images.githubusercontent.com/35618409/229663138-ec1a8a2c-a50f-4c3c-ba4c-75c1ea9057ad.png)

![image](https://user-images.githubusercontent.com/35618409/229649084-15d388b9-3246-43b2-956c-d1012f47ce12.png)

- Load it on GitPod IDE.
![image](https://user-images.githubusercontent.com/35618409/229649200-cd48e7fb-54bb-46af-9806-0f893d9375bb.png)


### Axon Server 

#### infra > docker-compose.yml 

- Axon Server uses port 8024 for dashboard and 8124 for message gRPC.
- When running the Lab, Token Store(MySQL) to manage Offset Token of each services.


## Orchestration Code Completion 

### Product Service

Complete Biz logic at product domain code.

- Add domain error generating code when out of stock.
```
# ProductAggregate - @DecreaseStockCommand Exception occurs when out of stock 
	if(this.getStock() < command.getStock()) throw new IllegalStateException("Out of Stock. !");  // Add code
```

- Add the following code at product > ProductAggregate.java
```
# @EventSourcingHandler :: StockIncreasedEvent : 
    setStock(getStock() + event.getStock());  // Add code

#  @EventSourcingHandler :: StockDecreasedEvent : 
    setStock(getStock() - event.getStock());  // Add code
```


### Order Service

Complete Biz logic at order domain code.

- Add the following code at order > OrderAggregate.java
```
# @EventSourcingHandler :: OrderPlacedEvent :
     setStatus("OrderPlaced"); 			// Add code
# @EventSourcingHandler :: OrderCompletedEvent : 
     setStatus("OrderCompleted"); 		// Add code
# @EventSourcingHandler :: OrderCancelledEvent :      
      setStatus("OrderCancelled");		// Add code
```

### Delivery Service

Complete Biz logic at delivery domain code.

- Add the following code at delivery > DeliveryAggregate.java
```
# @EventSourcingHandler :: DeliveryStartedEvent :
      setStatus("DeliveryStarted"); 		// Add code

# @EventSourcingHandler :: DeliveryCancelledEvent : 
      setStatus("DeliveryCancelled"); 		// Add code
```

### OrderSaga 

Complete OrderSaga code to perform order orchestration.

#### 1. Saga Start

- Set Correlation key from OrderPlaced event : Line 24
```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 2. Create and call Delivery Start Command : Line 27
``` 
command.setOrderId(event.getOrderId());
command.setProductId(event.getProductId());
command.setQty(event.getQty());
command.setUserId(event.getUserId());

# When deivery fails, compensate by cancelling order : OrderCancelCommand
orderCancelCommand.setOrderId(event.getOrderId());  	// Add code
```

#### 3. Set Correlation key from DeliveryStarted event

```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 4. Create and call Stock Decrease Command
```
command.setProductId(event.getProductId());
command.setStock(event.getQty());	
command.setOrderId(event.getOrderId());

# When stock decrease fails, compensate by cancelling delivery : CancelDeliveryCommand
cancelDeliveryCommand.setDeliveryId(event.getDeliveryId());	// Add code
```

#### 5. Set Correlation key from StockDecreased event

```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 6. Create and call Order Complete Command
```
command.setOrderId(event.getOrderId());
```

#### 7. Saga End

- Set Correlation key from OrderCompleted event
```
	@SagaEventHandler(associationProperty = "orderId")
```
- Saga Process end



## 12st Mall Test

- Test shopping mall application based on Axon Saga by Rest API.

- First, build Common API.
```
cd common-api
mvn clean install
```

- Run each microservices.
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

- Add test product at product service(:8082)
```
# new terminal
http POST :8082/products productName=TV stock=100
```

- Copy the Id of added product.
![image](https://user-images.githubusercontent.com/35618409/229345799-6a86743c-d3b1-43b7-9a94-91c4e50cfd9b.png)

- Create an order to purchase 10 TVs with the copied productId.
```
http POST :8081/orders productId=[product Id] productName=TV qty=10 userId=1001
```

- Copy the Id of created order.
![image](https://user-images.githubusercontent.com/35618409/229346264-89d2c227-5dc8-454d-acb0-1c24bc0da63d.png)


## Verifying 12st Mall Saga Compensation

### Create an order

- Create an order to purchase 100 TVs by productId and copy the order number.
```
http POST :8081/orders productId=[productId] productName=TV qty=100 userId=1001
```

- The product service returns an error with orders greater than the number of stocks(90).


- Check the final status and event history of the order created with the orderNumber.
```
http GET :8081/orders/[orderNumber]
http GET :8081/orders/[orderNumber]/events
```

- Check the delivery status from delivery service.
```
http GET :8083/deliveries
```

### [Extension Mission] - Debugging Order Service

- End order service.
- Add breakpoints at OrderSaga for each SagaEventHandler.
- Run order service in debug mode.

- Create new order and identify the orchestration flow while checking the debug point.
- Check debug point by putting more quantity than stock.
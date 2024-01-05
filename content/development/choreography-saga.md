---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Choreography Saga

We will go through the process of implementing the 12st Mall using Axon, a specialized framework supporting Event Sourcing, Domain-Driven Development, and CQRS.

Specifically, we'll learn about framework-level code that orchestrates commands based on domain events.

### EventStorming Model Preparation

- Open the model in a new tab using the link below:
[Model Link](https://www.msaez.io/#/storming/axon-mallorchestrationsaga:v1.5)
- If the model doesn't load, click on the avatar icon (person shape) in the upper right, log in with your Github account, and then reload.
- Verify that the stickers appear in the right palette area.
- Click on the Fork icon in the top menu to clone the model.

### Orchestration Saga Scenario

- An OrderPlaced event is generated in response to an order command.
- The Order Saga process is triggered by the OrderPlaced event.
- The Saga Process invokes the start delivery command and generates a DeliveryStarted event.
- Subsequently, a stock deduction command is invoked, leading to the creation of a StockDecreased event.
- The Saga Process concludes with the procedure to update the final order status.
- If an error occurs during any command invocation, Compensation Logic is executed for each.

### Saga Modeling

- Click on the Fork menu at the top.
- Orchestrate the cloned model as follows:

### Process Orchestration 

The rules for orchestrating the Saga model are as follows:
> 1. Connect stickers with lines: 'From Sticker' > 'To Sticker'
> 2. Click on mapping relations to label them. Labels indicate the execution order.
> 3. Among the labels, processes marked with '가' are Compensation Trx processes.
- OrderPlaced > Order Saga, (1.start)
- Order Saga > start delivery, (2)
- DeliveryStarted > Order Saga, (3)
- Order Saga > decrease stock, (4)
- StockDecreased > Order Saga, (5)
- Order Saga > update status, (6)
- OrderCompleted > Order Saga, (7.end)
- Order Saga > order cancel, (2')
- Order Saga > cancel delivery, (4')

#### The orchestrated Saga model looks like this:

![image](https://user-images.githubusercontent.com/35618409/229645326-3a24d5e3-81f3-4ecb-9e6f-2101302eb697.png)


### Code Generation and Push to My Git Repository

- Click on Git icon in Code Preview to push the generated code to your repository.
![image](https://user-images.githubusercontent.com/35618409/229663138-ec1a8a2c-a50f-4c3c-ba4c-75c1ea9057ad.png)

![image](https://user-images.githubusercontent.com/35618409/229649084-15d388b9-3246-43b2-956c-d1012f47ce12.png)

- GitPod 환경에서 로딩한다.
![image](https://user-images.githubusercontent.com/35618409/229649200-cd48e7fb-54bb-46af-9806-0f893d9375bb.png)


### Verify Axon Server

#### infra > docker-compose.yml 
- Axon Server uses port 8024 for the dashboard and 8124 for gRPC messaging.
- A Token Store (MySQL) for managing offset tokens is created during Lab execution.

## Orchestration Saga Code Completion 

### Product Service

Complete the business logic in the product domain code.

- Add code to throw a domain error if there is insufficient stock in the @DecreaseStockCommand.
```
# ProductAggregate - @DecreaseStockCommand throw an exception for insufficient stock
	if(this.getStock() < command.getStock()) throw new IllegalStateException("Out of Stock. !");  // Add this line
```

- Add the following code to ProductAggregate.java in the product service:
```
# @EventSourcingHandler :: StockIncreasedEvent : 
    setStock(getStock() + event.getStock());  // Add this line

#  @EventSourcingHandler :: StockDecreasedEvent : 
    setStock(getStock() - event.getStock());  // Add this line
```


### Order Service

Complete the business logic in the order domain code.

- Add the following code to OrderAggregate.java in the order service:
```
# @EventSourcingHandler :: OrderPlacedEvent :
     setStatus("OrderPlaced"); 			// Add this line
# @EventSourcingHandler :: OrderCompletedEvent : 
     setStatus("OrderCompleted"); 		// Add this line
# @EventSourcingHandler :: OrderCancelledEvent :      
      setStatus("OrderCancelled");		// Add this line
```

### Delivery Service

Complete the business logic in the delivery domain code.

- Add the following code to DeliveryAggregate.java in the delivery service:
```
# @EventSourcingHandler :: DeliveryStartedEvent :
      setStatus("DeliveryStarted"); 		// Add this line
# @EventSourcingHandler :: DeliveryCancelledEvent : 
      setStatus("DeliveryCancelled"); 		// Add this line
```

### OrderSaga 

Complete the OrderSaga code to perform the order orchestration.

#### 1. Saga Start

- Set correlation key from the OrderPlaced event: Line 24
```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 2. Generate and Invoke Start Delivery Command: Line 27
``` 
command.setOrderId(event.getOrderId());
command.setProductId(event.getProductId());
command.setQty(event.getQty());
command.setUserId(event.getUserId());

# If delivery fails, handle compensation: OrderCancelCommand
orderCancelCommand.setOrderId(event.getOrderId());  	// Add this line
```

#### 3. Set Correlation Key from DeliveryStartedEvent

```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 4. Generate and Invoke Decrease Stock Command 
```
command.setProductId(event.getProductId());
command.setStock(event.getQty());	
command.setOrderId(event.getOrderId());

# If stock deduction fails, handle compensation: CancelDeliveryCommand
cancelDeliveryCommand.setDeliveryId(event.getDeliveryId());	// Add this line
```

#### 5. Set Correlation Key from StockDecreasedEvent

```
	@SagaEventHandler(associationProperty = "orderId")
```

#### 6. Generate and Invoke Order Completed Command
```
command.setOrderId(event.getOrderId());
```

#### 7. Saga End

- Set Correlation Key from OrderCompletedEvent
```
	@SagaEventHandler(associationProperty = "orderId")
```
- End Saga Process



## 12st Mall Test

- Test the Axon Saga-based mall using Rest API.

- First, build the Common API:
```
cd common-api
mvn clean install
```

- Run each microservice:
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

- Register a test product in the product service (:8082):
```
# new terminal
http POST :8082/products productName=TV stock=100
```

- Copy the product ID.
![image](https://user-images.githubusercontent.com/35618409/229345799-6a86743c-d3b1-43b7-9a94-91c4e50cfd9b.png)

- Create an order for purchasing 10 TVs using the copied product ID:
```
http POST :8081/orders productId=[상품 Id] productName=TV qty=10 userId=1001
```

- Copy the order ID.
![image](https://user-images.githubusercontent.com/35618409/229346264-89d2c227-5dc8-454d-acb0-1c24bc0da63d.png)


## 12st Mall Saga Compensation Verification

### Create an Order

- Create an order to purchase 100 TVs using the product ID, and copy the order number:
```
http POST :8081/orders productId=[상품 Id] productName=TV qty=100 userId=1001
```

- The product service returns an error since the quantity exceeds the available stock.


- Check the final status and event history of the created order using the order number:
```
http GET :8081/orders/[Order Number]
http GET :8081/orders/[Order Number]/events
```

- Check the delivery status in the delivery service:
```
http GET :8083/deliveries
```

### [Extension Mission] - Order Service Debugging

- Stop the order service.
- Add breakpoints for each SagaEventHandler in OrderSaga.
- Run the order service in debug mode.

- Create a new order and observe the orchestration flow by checking the Debug Points.
- Test by placing an order with a quantity greater than the available stock.
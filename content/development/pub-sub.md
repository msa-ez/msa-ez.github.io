---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Pub/Sub Integration

<div style = "height:400px; object-fit: cover;">
<iframe style = "width:100%; height:100%;" src="https://www.youtube.com/embed/QvRiuKCZUmM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div><br>

In this hands-on exercise, we will practice the Pub/Sub pattern for event messaging between microservices. Specifically, when an order event (OrderPlaced) is triggered in the Order service, the Inventory service will subscribe to this event and adjust (decrease) the inventory level accordingly.

### Event Storming Model Preparation

- Load the model from the following link in a new tab:
**[Model Link](https://www.msaez.io/#/storming/labshoppubsub-2:2023-pubsub2)**
- If the model doesn't load in the browser, click the avatar icon in the upper right corner, log in with your **GitHub** account, and reload.
- Confirm that the required Event Storming basic model is displayed.

![image](https://github.com/acmexii/demo/assets/35618409/39ccf71e-3977-4093-9bae-7c2a1254d710)


### Order Service Event Publishing

Open the GitPod IDE by selecting CODE > ProjectIDE from the menu.

- Run the Order microservice.
> Navigate to the order folder > Open In Terminal > Execute the following command.
> The order service will run on port 8081.
```
mvn spring-boot:run
```

- Make a request to the running order service to place an order.
```
http localhost:8081/orders productId=1 productName=TV qty=3
```
- Add a new terminal in GitPod.

- Enter the Kafka utility with Docker to get a shell in the Kafka location:

```
cd kafka
docker-compose exec -it kafka /bin/bash
cd /bin
```

- Check the Event from kafka Consumer.

``` 
./kafka-console-consumer --bootstrap-server localhost:9092 --topic labshoppubsub  --from-beginning
```


### Inventory Service Event Subscription
- Examine the PolicyHandler.java code in the Inventory service.
- PolicyHandler.java calls the Port method (decreaseStock) of Inventory.java (Aggregate).
- The logic we need to implement in decreaseStock is as follows:
```
repository().findById(Long.valueOf(orderPlaced.getProductId())).ifPresent(inventory->{
    
    inventory.setStock(inventory.getStock() - orderPlaced.getQty()); // do something
    repository().save(inventory);


    });
```

- Run the inventory service.
```
mvn spring-boot:run
```
- Confirm that the inventory service is running on port 8082.
- Observe the inventory level decreasing in response to the OrderPlaced event:

```
http :8082/inventories id=1 stock=10
http :8081/orders productId=1 qty=5
http :8082/inventories/1
```
Result:
```
{
    "_links": {
        "inventory": {
            "href": "http://localhost:8082/inventories/1"
        },
        "self": {
            "href": "http://localhost:8082/inventories/1"
        }
    },
    "stock": 5
}
```


### Extension Mission
- Create a Delivery Bounded Context, model and implement a policy to add one delivery for each order.
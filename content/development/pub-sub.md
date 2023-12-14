---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Pub/Sub Communication

### Publish & Subscribe Events
- Practice how to Publish and Subscribe event message from the communication between microservices.
- When OrderPlaced event was published from Order service, Inventory service subscribes the event and decreases the amount of stock.

#### Publishing Event of Order Service

- Run order microservice.
> Open a terminal from order folder and put in the command.
> Order service is running on port 8081.
```
mvn spring-boot:run
```

- Make an order by calling a order service.
 ```
http localhost:8081/orders productId=1 productName="TV" qty=3
```
- Add new terminal at Gitpod.
- To  get access to kafka utility, get into the shell through docker:
```
cd kafka
docker-compose exec -it kafka /bin/bash
cd /bin
```
- Check the event at kafka Consumer
``` 
./kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic shopmall --from-beginning
```

#### Subscribing Event of Inventory Service
- Check the codes from Inventroy PolicyHandler.java.
- PolicyHandler.java would call the Port Method (decreaseStock) of Inventory.java (Aggregate).
- The logic we must put in decreaseStock is:

```          
        repository().findById(Long.valueOf(orderPlaced.getProductId())).ifPresent(inventory->{
            
            inventory.setStock(inventory.getStock() - orderPlaced.getQty()); // do something
            repository().save(inventory);


         });  
      
```


- Run inventory service (mvn spring-boot:run)
- Check if inventory service is running on port 8082
- Check if the stock decreases in response to OrderPlaced event:
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


### Mission
- Create Bounded Context 'delivery' and implement a policy to make a delivery for an order.
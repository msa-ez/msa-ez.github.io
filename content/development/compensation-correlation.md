---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Pub/Sub Communication - Compensation & Correlation

### Compensation and Correlation

Compensation is a process to rollback or compensate the customer for any changes that have occurred from an event or if the transaction is to be cancelled for any technical reason. 

And Correlation is a relationship between data of microservices which has to be cancelled by connecting their key values.


### Scenario

We published an event called OrderPlaced, which creates an order.
In this lab, we'll publish an event called OrderCancelled to cancel an order from Order service, and carry out a Compensation from Inventory to rollback the stock for the order.
For the inventory, the rollback is made by adding the quantity of stock that were initially ordered by having the productId as a Correlation Key.


### Working Process  

#### Eventstorming 
- Attach the Command "cancel". This command must be attached on the left side of Order Aggregate.
- Double click on cancel command and select "DELETE" for http method.
- Attach an Event "OrderCancelled" on the right side of Order Aggregate, so the event could be published following the cancel command.

- Click Sync Attributes on OrderCancelled event to duplicate the attributes from the Aggregate.
- Connect a line between cancel command and OrderCancelled event.
- Add a Policy at inventory bounded context and name it "increase stock"
- Connect a line between OrderCancelled Event and "increase stock" Policy.

#### Code Generation

- order/../ Order.java
```
   @PreRemove
    public void onPreRemove() {
        OrderCancelled orderCancelled = new OrderCancelled(this);
        orderCancelled.publishAfterCommit();
    }
```

- order/../   OrderCancelled.java & inventory/../ OrderCancelled.java
```
package labshopcompensation.domain;

import java.util.*;
import labshopcompensation.domain.*;
import labshopcompensation.infra.AbstractEvent;
import lombok.*;

@Data
@ToString
public class OrderCancelled extends AbstractEvent {

    private Long id;
    private String productId;
    private Integer qty;
    private String customerId;
    private Double amount;
    private String status;
    private String address;

    public OrderCancelled(Order aggregate) {
        super(aggregate);
    }

    public OrderCancelled() {
        super();
    }
    // keep

}

```
- wheneverOrderCancelled_increaseStock method from inventory/../ PolicyHandler.java 
```
    @StreamListener(
        value = KafkaProcessor.INPUT,
        condition = "headers['type']=='OrderCancelled'"
    )
    public void wheneverOrderCancelled_IncreaseStock(
        @Payload OrderCancelled orderCancelled
    ) {
        OrderCancelled event = orderCancelled;
        System.out.println(
            "\n\n##### listener IncreaseStock : " + orderCancelled + "\n\n"
        );

        // Sample Logic //
        Inventory.increaseStock(event);
    }

```

- increaseStock method from inventory/../ Inventory.java
```
    public static void increaseStock(OrderCancelled orderCancelled) {

        /** fill out following code  */

    }
```

#### Cancel an Order & Check the Event
- Save the generated codes and re-run order service.
- Set the initial amount of stock.
```
http :8082/inventories id=1  stock=10
```
- Create an order by the command below.
```
http localhost:8081/orders productId=1 productName=TV qty=3
```
- Check the left amount of stock after the order.
```
http :8082/inventories/1    # stock=7
```
- Cancel the order.
```
http DELETE localhost:8081/orders/1
```
- Check the left amount of stock after cancelling the order.
```
http :8082/inventories/1    # stock=10
```
- Use Kafka consumer to check if OrderCancelled event is being published.
```
cd kafka
docker-compose exec -it kafka /bin/bash
cd /bin

./kafka-console-consumer --bootstrap-server localhost:9092 --topic labshopcompensation --from-beginning
```


#### Implementing Inventory Service
- Implement increaseStock method at Inventory.java, the Aggregate of inventory service:
```
    public static void increaseStock(OrderCancelled orderCancelled) {

        repository().findById(Long.valueOf(orderCancelled.getProductId())).ifPresent(inventory->{
            
            inventory.setStock(inventory.getStock() - orderCancelled.getQty()); 
            repository().save(inventory);


         });

    }


```

### Scenario Extension: Cancel an order when the order has been deleted from delivery service
---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Circuit Breaker for Req/Res

### Blocking fault propagation with Circuit Breaker

#### Eventstorming

To test Circuit Breaker, make a GET call for stock of inventory from the order Command. 

- Draw a line from order Command to Inventory Aggregate. 

<img width="899" alt="image" src="https://user-images.githubusercontent.com/487999/190903135-a6bb95c0-d1f6-424e-9444-1bbf0119386a.png">

- Double-click on the line and name it: Get Availability
- Turn on the Circuit Breaker option 

<img width="452" alt="image" src="https://user-images.githubusercontent.com/487999/190903010-1f789fc6-bc4e-4ad5-a7fd-a2a51b11c940.png">


#### Check & Implement the created codes

- @PrePersist of order/../Order.java
```
@PrePersist
public void onPrePersist() {
    // Get request from Inventory
    labshoporder.external.Inventory inventory =
        OrderApplication.applicationContext.getBean(labshoporder.external.InventoryService.class)
        .getInventory(Long.valueOf(getProductId()));

    if(inventory.getStock() < getQty()) throw new RuntimeException("Out of Stock!");

}
```
> Add a logic to call inventory service for stock information and make an error if the stock cannot afford the amount of an order.
- order/../external/InventoryService.java
```
@FeignClient(name = "inventory", url = "${api.url.inventory}")
public interface InventoryService {
    @RequestMapping(method = RequestMethod.GET, path = "/inventories/{id}")
    public Inventory getInventory(@PathVariable("id") Long id);

  ...
}
```
> Check FeignClient Interface of the GET call for stock info.



#### Call before setting Circuit Breaker
- Run order & inventory service. 
- Register enough stock of inventory.
```
http :8082/inventories id=1 stock=10000
```
- Make an order of two concurrent users for 10 seconds by siege tool.
```
siege -c2 -t10S  -v --content-type "application/json" 'http://localhost:8081/orders POST {"productId":1, "qty":1}'
```
> Install siege tool by the commands below:
```
sudo apt update -y
sudo apt install siege -y
```
		
> Every calls are successfully done(201 Code).

#### Setting Circuit Breaker

- Modify settings of application.yaml from order service as below:

````yaml
feign:
    hystrix:
    enabled: true

hystrix:
    command:
    default:
        execution.isolation.thread.timeoutInMilliseconds: 610
````

- Put in a delay code to make it slower to GET Inventory.java of inventory service.  


````java
@PostLoad
public void makeDelay(){
    try {
        Thread.currentThread().sleep((long) (400 + Math.random() * 220));
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

}
````

- Re-run inventory service.
- Put in enough amount of stock :
```
http :8082/inventories id=1 stock=10000
```
- Make an order by using seige tool.
```
siege -c2 -t10S  -v --content-type "application/json" 'http://localhost:8081/orders POST {"productId":1, "qty":1}'
```
> We can check that the code 201 & 500 are repeating as the delay occurs, and it's controlling the overload with inventory.
> Eventually, the service maintains with 60~90% of availability.

- Check the log of order service:
```
java.lang.RuntimeException: Hystrix circuit short-circuited and is OPEN
```
> We can check that an error occurred as the Circuit Breaker works.

[Tip] Test by modifying critical values or delays.

#### Handling fallback (proper replacement in case of failure)

- Make an order in status of inventory service is not running. (500 error)
```
http localhost:8081/orders productId=1 qty=1 
```
- Give a fallback option to the FeignClient of InventoryService.java from order service.
    
```java
@FeignClient(name = "inventory", url = "${api.url.inventory}", fallback = InventoryServiceFallback.class)
```
- Make a Fallback implementation at order service:
````java
package labshoporder.external;

import org.springframework.stereotype.Service;

@Service
public class InventoryServiceFallback implements InventoryService{
    public Inventory getInventory(Long id){
        Inventory fallbackValue = new Inventory();
        fallbackValue.setStock(1L);

        return fallbackValue;
    }
}
````

- Re-run order service and make an order. (order available)
    - The inventory service must be stop running at this point.
    - We can check that the method getInventory() of InventoryServiceImpl returned a proper fake value of 1, so it pretends to have a stock left.

```
http localhost:8081/orders productId=1 qty=1   # will succeed!
```

- Make an order with more amount of qty (over 1).
```
http localhost:8081/orders productId=1 qty=3   # will fail!
```
#### Other Circuit Breakers
https://dzone.com/articles/comparing-envoy-and-istio-circuit-breaking-with-ne?fbclid=IwAR0wYnXPiAZSVtluJ-17Ywb9dK3xrytAMo3ImIZv8KwoOo2WGGnyTKm6c04
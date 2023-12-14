---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# MSA Communication by Req/Res

### Check the Working Process of Monolith Service
 
Requirements of this Lab : Separate inventory service from Monolith-based shopping mall service and making Microservice-based shopping mall by using Feign Client.

Feign Client is a way of transforming with minimizing the change of the legacy codes by 
following the existing local object interfaces while making it available to communication between services by remote call (Request/Response).


- Running the Monolith Service
```
cd monolith
mvn spring-boot:run

http localhost:8081
``` 
- Check if the delivery is on process through local object 'inventory' at Order.java:
```

    @PostPersist
    public void onPostPersist() {
        inventoryService().decreaseStock(Long.valueOf(getProductId()), new DecreaseStockCommand(getQty()));

    }

    @PrePersist
    public void checkAvailability(){
        if(inventoryService().getInventory(Long.valueOf(getProductId())).getStock() < getQty()) throw new RuntimeException("Out of stock");
    }

    public static InventoryService inventoryService(){
        InventoryService inventoryService = MonolithApplication.applicationContext.getBean(
            InventoryService.class
        );

        return inventoryService; // set breakpoint here
    }


```

- Place a debug point on the method inventoryService() of Order.java.
- When you click on the left side of "return inventoryService;" line's line number, a red circle(breakpoint) comes out.
- Place an order  
```
http localhost:8081/orders productId=1 quantity=3 customerId="1@uengine.org" customerName="hong" customerAddr="seoul"
```

- Check if it's a Monolith which is being handled by InventoryServiceImpl.java

### Separating areas from Monolith to Microservices

To edit the base model of this lab, FORK this model and customize it by following the instruction.

#### Eventstorming
- Add a bounded context and name it "inventory"
- Group the objects of inventory aggregate and move them into inventory bounded context

<img width="874" alt="image" src="https://user-images.githubusercontent.com/487999/190896320-72973cf1-c1dc-44f4-a46a-9be87d072284.png"> 

- Add a Command to decrease inventory: Add a Command sticker into inventory BC and name it "decrease inventory". The Command sticker should be placed on the left of Inventory Aggregate.
- Setting Command: Double click on "decrease inventory" command and select "Controller". Add name: qty, type: Integer for Attribute.

<img width="784" alt="image" src="https://user-images.githubusercontent.com/487999/190896393-30889e96-6cbc-4e7f-9631-25c0d004635d.png">

- Link a remote calling line: Link OrderPlaced Event sticker of monolith BC and decrease inventory Command sticker of inventory BC. A mark called Req/res appears.

<img width="859" alt="image" src="https://user-images.githubusercontent.com/487999/190896427-f91962cd-f8ab-4113-bd85-5abe1ada3bcd.png">

#### Check & implement the codes from the calling side
- Create codes resulted from eventstorming, push them, then update the codes.
> Send the code to your GitHub by "Commit & Push on Git" from Code Preview menu.
> In order to do that, MSAEz must be signed up with your GitHub token.
- Check the sample codes created inside @PostPersist from monolith/../ Order.java and edit them as the part //here:
```
    @PostPersist
    public void onPostPersist() {
        //Following code causes dependency to external APIs
        // it is NOT A GOOD PRACTICE. instead, Event-Policy mapping is recommended.

        labshopmonolith.external.DecreaseStockCommand decreaseStockCommand = new labshopmonolith.external.DecreaseStockCommand();
        decreaseStockCommand.setQty(getQty()); //here
        
        // mappings goes here
        MonolithApplication.applicationContext
            .getBean(labshopmonolith.external.InventoryService.class)
            .decreaseStock(Long.valueOf(getProductId()), decreaseStockCommand); //here

        OrderPlaced orderPlaced = new OrderPlaced(this);
        orderPlaced.publishAfterCommit();
    }


```
> We are calling decreaseStock stub method as calling a local object, but actually it would be resulted as calling a remote object of inventory.
> To modify the amount of inventory, deliver productId as the Command object to deliver the value of qty  and the first argument to deliver id of the product by path.


- Refer the Stub codes related to FeignClient created inside monolith/../ external package (InventoryService.java, DecreaseStockCommand.java, Inventory.java)
```
@FeignClient(name = "inventory", url = "${api.url.inventory}")
public interface InventoryService {
    @RequestMapping(
        method = RequestMethod.PUT,
        path = "/inventories/{id}/decreasestock"
    )
    public void decreaseStock(
        @PathVariable("id") Long id,
        @RequestBody DecreaseStockCommand decreaseStockCommand
    );

}
```
> FeignClient will create proxy object that calls remote objects of inventory. An implementation of a remote call calling the PUT method to the corresponding path is filled with the url of set value of api.url.inventory from application.yaml.

#### Check & implement the source code from called side
- inventory/.. /infra/InventoryController.java
```
public class InventoryController {

    @Autowired
    InventoryRepository inventoryRepository;

    @RequestMapping(
        value = "inventories/{id}/decreasestock",
        method = RequestMethod.PUT,
        produces = "application/json;charset=UTF-8"
    )
    public Inventory decreaseStock(
        @PathVariable(value = "id") Long id,
        @RequestBody DecreaseStockCommand decreaseStockCommand,
        HttpServletRequest request,
        HttpServletResponse response
    ) throws Exception {
        System.out.println("##### /inventory/decreaseStock  called #####");
        Optional<Inventory> optionalInventory = inventoryRepository.findById(
            id
        );

        optionalInventory.orElseThrow(() -> new Exception("No Entity Found"));
        Inventory inventory = optionalInventory.get();
        inventory.decreaseStock(decreaseStockCommand);

        inventoryRepository.save(inventory);
        return inventory;
    }
}
```
> This is a REST Service Mapping that can receive the remote call about decreaseStock.
> When it receives a call, it takes the role of input adapter that delivers it to the inventory aggregator's decision stock(hexagonal architecture). The real business logic(inventory decrease) must be implemented with ubiquotous language only inside Aggregate.

- Implementing inventory/../Inventory.java
```
    public void decreaseStock(DecreaseStockCommand decreaseStockCommand) {
        setStock(getStock() - decreaseStockCommand.getQty().longValue());
    }

```

#### Test of inventory service

- Run inventory service and test if the service could be called properly by using httpie tool:
```
cd inventory
mvn spring-boot:run

#New Terminal
http :8082/inventories id=1 stock=10
http PUT :8082/inventories/1/decreasestock qty=3
http :8082/inventories/1  # stock must be 7
```

#### Calling test for inventory by monolith

- Run the monolith and check if the inventory could be called by ordermonolith:

```
cd monolith
mvn spring-boot:run

#New Terminal
http :8081/orders productId=1 qty=5
http :8082/inventories/1  # stock must be 2
```
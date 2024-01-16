---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Request/Response Communication in MSA Integration

<div style = "height:400px; object-fit: cover;">
<iframe style = "width:100%; height:100%;" src="https://www.youtube.com/embed/jL_i3o0IEbY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div><br>

In this guide, we will follow the steps to separate a specific part from a monolithic service and have the monolith and microservices communicate using a Req/Res (Request/Response) approach.

## EventStorming Model Preparation

- Open the model in a new tab using the link :
**[Model Link](https://www.msaez.io/#/storming/labshopmonolith-230822)**
- If the model doesn't load, click on the avatar icon (person shape) in the upper right, log in with your **Github** account, and then reload.
- Verify that the model, as needed for the level, is displayed.

![image](https://github.com/acmexii/demo/assets/35618409/7950c0df-eee8-44e3-a79f-7448a4caa30e)
- Ensure that the model is loaded, and if not, fork it using the Fork icon.

### Separating a Part from the Existing Monolith

Utilize the given model to guide you through the process of modeling, separating the product service from the monolith.

### EventStorming

- Limit the monolith's bounded context to the order domain sticker only.
- Add a new bounded context and name it **inventory.**
- Select and move the aggregate objects of the inventory bounded context.

<img width="874" alt="image" src="https://user-images.githubusercontent.com/487999/190896320-72973cf1-c1dc-44f4-a46a-9be87d072284.png">

- Add a command to decrease the stock: Add the **decrease stock** command sticker to the inventory BC, and copy the command name below:
```
decrease stock
```
- Attach the Command sticker to the left of the Inventory Aggregate sticker.
- Configure the **decrease stock** command: Double-click on the **decrease stock** command sticker, choose **Extend Verb URI** for Method Type, and add an attribute with type: Integer and name: qty.
- After adding the attribute, click **Add Attribute** or press Enter to confirm.

<img width="784" alt="image" src="https://user-images.githubusercontent.com/487999/190896393-30889e96-6cbc-4e7f-9631-25c0d004635d.png">

- Connect the OrderPlaced Event sticker in the monolith to the **decrease stock** Command sticker in the inventory. The connection should indicate Req/Res.

<img width="859" alt="image" src="https://user-images.githubusercontent.com/487999/190896427-f91962cd-f8ab-4113-bd85-5abe1ada3bcd.png">

## Code Generation and Push to Git Repository
- Click on **CODE** > **Code Preview** in the modeling menu.
- In the dialog that appears, select **Create New Repository**, and click **CREATE**.

> Since you logged in with your **Github** account initially, your Git information is automatically displayed.
![image](https://github.com/acmexii/demo/assets/35618409/dcb1966e-e0d1-43f3-9920-457660923259)
- The model-based code is pushed to your Github.
![image](https://github.com/acmexii/demo/assets/35618409/6581f400-adb8-4963-bf03-511d459c5e32)
- Click on **IDE** in the left menu, and then click **Open GitPod** in the Cloud IDE list.

### Check the Source Code on the Calling Side
- Check the generated sample code in monolith/../Order.java within the @PostPersist section:

```
@PostPersist
public void onPostPersist() {
    labshopmonolith.external.DecreaseStockCommand decreaseStockCommand = new labshopmonolith.external.DecreaseStockCommand();

  // Load the order quantity information into the command object.
    decreaseStockCommand.setQty(getQty()); 
    
  // Make a remote call through the InventoryService Proxy with the command object.
    MonolithApplication.applicationContext
        .getBean(labshopmonolith.external.InventoryService.class)
        .decreaseStock((Long.valueOf(getProductId())), decreaseStockCommand);
}
```
> Even though we call the decreaseStock stub method as if we were calling a local object, it will actually result in a remote call to the inventory object. 
> We pass the qty value to the Command object for modifying the stock amount and the product id as the first argument to productId in the path.


- Check the generated FeignClient-related stub code in monolith/../external package (InventoryService.java, DecreaseStockCommand.java, Inventory.java):
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
> The FeignClient will actually create a proxy object that calls the inventory remote object. The implementation of the remote call, which sends a PUT method to the specified path using the configured url in application.yaml under api.url.inventory, will be filled.

## Check and Implement the Code on the Called Side
- inventory/.. /infra/InventoryController.java
```
public class InventoryController {

    @Autowired
    InventoryRepository inventoryRepository;

    @RequestMapping(value = "inventories/{id}/decreasestock", method = RequestMethod.PUT, produces = "application/json;charset=UTF-8")
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
> This is the REST service mapping for receiving the remote call for decreaseStock.
> It acts as an input adapter, passing the input to the decreaseStock method inside the Inventory aggregate, where the actual business logic (decreasing stock) is implemented using ubiquitous language.

- Implement the decreaseStock method in inventory/../Inventory.java:
```
    public void decreaseStock(DecreaseStockCommand decreaseStockCommand) {
        setStock(getStock() - decreaseStockCommand.getQty().longValue());  // Copy & Paste this code
    }
```

### Test Synchronous Call via Proxy Object

#### Test the inventory service

- Run the inventory service and test whether the service is called correctly using the httpie tool:
```
cd inventory
mvn spring-boot:run
```

- Register a test product in the inventory and perform a pre-check:
```
http :8083/inventories id=1 stock=10
http PUT :8083/inventories/1/decreasestock qty=3
http :8083/inventories/1  # stock must be 7
```

#### Call inventory synchronously through monolith

- Run the monolith and verify if inventory is called through an actual order:

```
cd monolith
mvn spring-boot:run

#In a new terminal
http :8082/orders productId=1 qty=5
http :8083/inventories/1  # stock must be 2
```

# References
1. To download files: Open the terminal > zip -r test.zip ./ > Download the generated test.zip by right-clicking.
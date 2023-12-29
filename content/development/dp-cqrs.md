---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Data Projection with CQRS

We will design a Query Model (Materialized View) based on the detailed models of the Order Service and Delivery Service.

## EventStorming Model Preparation

- Open the model in a new tab using the link below:
[Model Link : https://www.msaez.io/#/storming/labcqrs-231022](https://www.msaez.io/#/storming/labcqrs-231022)
- If the model doesn't load, click on the avatar icon (person shape) in the upper right, log in with your Github account, and then reload.
- Verify that the model, as needed for the level, is displayed.
- If the loaded model doesn't show the sticker list in the right palette, click the FORK icon in the top menu to clone the given model.
![image](https://github.com/acmexii/demo/assets/35618409/c9a4575c-d8e2-424b-9587-7ca789dca2e1)
- Confirm that the sticker list is now visible in the right palette.

## CQRS 모델링 

- Assume the establishment of a new Customer Center team launching the 'MyPage' service.
- Design a Query Model (Materialized View) based on the detailed models of the Order Service and Delivery Service.

### MODELING
- Add the 'customercenter' BC.
- Add a green sticker ('MyPage') for the Read Model.
- Define Read Model attributes:
> Long orderId 
> String productId
> String deliveryStatus
> String orderStatus

<img width="982" alt="image" src="https://user-images.githubusercontent.com/487999/191055790-5d6a529f-e2f7-49ab-8ee0-74d371f06090.png">

- Detailed design for Read Model CRUD
<img width="434" alt="image" src="https://user-images.githubusercontent.com/487999/191056403-fbdec62b-42ea-4261-8e4e-b631c6c6779a.png">

### Code Preview 
- Review the View Model code after the detailed design.
- Push to my GitHub and load it into the GitPod environment.

### Complete Service codes
- Complete the domain code for the Delivery microservice.
- Delivery.java > addToDeliveryList Port method
```
Delivery delivery = new Delivery();
delivery.setAddress(orderPlaced.getAddress());
delivery.setQuantity(orderPlaced.getQty());
delivery.setCustomerId(orderPlaced.getCustomerId());
repository().save(delivery);
```

- For the Customer microservice, configure automatic ID generation in MyPage.java:
```
 @GeneratedValue(strategy=GenerationType.AUTO)  // Uncomment this line
```

### Run Microservices
- Run the Order, Delivery, and Customer Center microservices individually:
```
mvn spring-boot:run
```
- If there's an error in the customer center, check the implementation of ViewHandler.java (findByOrderId --> findById):
```
    @StreamListener(KafkaProcessor.INPUT)
    public void whenDeliveryStarted_then_UPDATE_1(@Payload DeliveryStarted deliveryStarted) {
        try {
            if (!deliveryStarted.validate()) return;
                // View object lookup
            Optional<MyPage> myPageOptional = myPageRepository.findById(deliveryStarted.getOrderId());

            if( myPageOptional.isPresent()) {
                 MyPage myPage = myPageOptional.get();
            // Set the eventDirectValue of the event to the view object
                myPage.setDeliveryStatus("Started");    
                // Save to the view repository
                 myPageRepository.save(myPage);
                }


        }catch (Exception e){
            e.printStackTrace();
        }
    }

```
- After registering one order, check the contents of MyPage:
```
http :8082/orders productId=1 qty=1
http :8085/myPages
```
- Shut down the Delivery service (8084) and verify that the service remains stable by checking the contents of MyPage.
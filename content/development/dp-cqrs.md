---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Data Projection with CQRS


### CQRS Modeling Practice

- Refer to the specific model of Order/Inventory services and design a Query Model(Materialized View).

#### SCENARIO
- Customer service team is newly established and launching 'my page' service.

#### MODELING
- Add customercenter BC
- Add Green Sticker(Read Model) and name it 'MyPage'.
- Define the Attributes of Read Model
> orderId 
> productId
> deliveryStatus
> orderStatus

<img width="982" alt="image" src="https://user-images.githubusercontent.com/487999/191055790-5d6a529f-e2f7-49ab-8ee0-74d371f06090.png">

- Detailed Design of Read Model CRUD

<img width="434" alt="image" src="https://user-images.githubusercontent.com/487999/191056403-fbdec62b-42ea-4261-8e4e-b631c6c6779a.png">



#### Code Preview
- Review the View Model codes which has done detail design.

#### Run
- If error occurs at customer-center, check the implementation of ViewHandler.java below: (findByOrderId --> findById)
```
    @StreamListener(KafkaProcessor.INPUT)
    public void whenDeliveryStarted_then_UPDATE_1(@Payload DeliveryStarted deliveryStarted) {
        try {
            if (!deliveryStarted.validate()) return;
                // inquiring view object
            Optional<MyPage> myPageOptional = myPageRepository.findById(deliveryStarted.getOrderId());

            if( myPageOptional.isPresent()) {
                 MyPage myPage = myPageOptional.get();
						// set eventDirectValue of event at view object
                myPage.setDeliveryStatus("Started");    
								// save it to view repository
                 myPageRepository.save(myPage);
                }


        }catch (Exception e){
            e.printStackTrace();
        }
    }

```
- Register an order and check MyPage.
```
http :8081/orders productId=1 qty=1
http :8084/myPages
```
- Run delivery service and check MyPage.
- Kill delivery service and check if the service is stable even if we check MyPage.
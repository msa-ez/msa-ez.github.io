---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# food delivery

![image](https://user-images.githubusercontent.com/487999/79708354-29074a80-82fa-11ea-80df-0db3962fb453.png)

Source: https://github.com/msa-ez/example-food-delivery

This example is configured to cover all stages of analysis/design/implementation/operation including MSA/DDD/Event Storming/EDA. It includes example answers to pass the checkpoints required for the development of cloud-native applications.
- Checkpoint : https://workflowy.com/s/assessment-check-po/T5YrzcMewfo4J6LW

## service scenario

Covering the nation of delivery - https://1sung.tistory.com/106

Functional Requirements<br>
1. The customer selects the menu and places an order<br>
2. The customer pays<br> 
3. When the order is placed, the order details are transmitted to the store owner<br> 
4. The store owner confirms, cooks and starts delivery<br> 
5. The customer orders<br> 
6. If the order is canceled, the delivery is canceled<br> 
7. The customer inquires the order status in the middle<br> 
8. Every time the order status changes, a notification is sent via KakaoTalk.<br>
<br><br>

Non-Functional Requirements<br>
1. Transactions<br>
   - 1. Transactions should not be established for unpaid orders. Sync call<br>
2. Failure isolation<br>
   - 1. Orders should be received 24 hours a day, 365 days a year, even if the store management function is not performed Async (event- driven), Eventual Consistency
   - 2. When the payment system is overloaded, it induces users to make payments after a while without accepting them for a while Circuit breaker, fallback<br>
3. Performance<br>
   - 1. Customers can check the delivery status frequently in the store management order system (front end) CQRS
   - 2. Every time the delivery status changes, it should be possible to notify via KakaoTalk, etc. Event driven<br>



## checkpoint

- analytical design

  - Event Storming:
    - Do you properly understand the meaning of each sticker color object and properly reflect it in the design in connection with the hexagonal architecture?
    - Is each domain event defined at a meaningful level?
    - Aggregation: Are Commands and Events properly grouped into ACID transaction unit Aggregate?
    - Are functional and non-functional requirements reflected without omission?
 
  - Separation of subdomains, bounded contexts
    - Is the sub-domain or Bounded Context properly separated according to the team's KPIs, interests, and different distribution cycles, and is the rationality of the separation criteria sufficiently explained?
        - Separation of at least 3 services
    - Polyglot design: Have you designed each microservice by adopting various technology stack and storage structures according to the implementation goals and functional characteristics of each microservice?
    - In the service scenario, for the use case where the ACID transaction is critical, is the service not excessively and densely separated?

  - Context Mapping / Event Driven Architecture
    - Can you distinguish between task importance and hierarchy between domains? (Core, Supporting, General Domain)
    - Can the request-response method and event-driven method be designed separately?
    - Fault Isolation: Is it designed so that the existing service is not affected even if the supporting service is removed?
    - Can it be designed (open architecture) so that the database of existing services is not affected when new services are added?
    - Is the Correlation-key connection properly designed to link events and policies?


  - Hexagonal Architecture
    - Did you draw the hexagonal architecture diagram according to the design result correctly?
    
- avatar
  - [DDD] Was the realization developed to be mapped according to the color of each sticker and the hexagonal architecture in the analysis stage?
    - Have you developed a data access adapter through JPA by applying Entity Pattern and Repository Pattern?
    - [Hexagonal Architecture] In addition to the REST inbound adapter, is it possible to adapt the existing implementation to a new protocol without damaging the domain model by adding an inbound adapter such as gRPC?
    - Is the source code described using the ubiquitous language (terms used in the workplace) in the analysis stage?

  - Implementation of service-oriented architecture of Request-Response method
    -  How did you find and call the target service in the Request-Response call between microservices? (Service Discovery, REST, FeignClient)
    - Is it possible to isolate failures through circuit breakers?
  - Implementing an event-driven architecture
    - Are more than one service linked with PubSub using Kafka?
    - Correlation-key: When each event (message) processes which policy, is the Correlation-key connection properly implemented to distinguish which event is connected to which event?
    - Does the Message Consumer microservice receive and process existing events that were not received in the event of a failure?
    - Scaling-out: Is it possible to receive events without duplicates when a replica of the Message Consumer microservice is added?
    - CQRS: By implementing Materialized View, is it possible to configure the screen of my service and view it frequently without accessing the data source of other microservices (without Composite service or join SQL, etc.)?


  - polyglot programming
    - Are each microservices composed of one or more separate technology stacks?
    - Did each microservice autonomously adopt its own storage structure and implement it by selecting its own storage type (RDB, NoSQL, File System, etc.)?

  - API Gateway
    - Can the point of entry of microservices be unified through API GW?
    - Is it possible to secure microservices through gateway, authentication server (OAuth), and JWT token authentication?

- operation
  - SLA Compliance
    - Self-Healing: Through the Liveness Probe, as the health status of any service continuously deteriorates, at what threshold can it be proven that the pod is regenerated?
    - Can fault isolation and performance efficiency be improved through circuit breaker and ray limit?
    - Is it possible to set up an autoscaler (HPA) for scalable operation?
    - Monitoring, alerting:

  - Nonstop Operation CI/CD (10)
    - When the new version is fully serviceable through the setting of the Readiness Probe and rolling update, it is proved by siege that the service is converted to the new version of the service.
    - Contract Test: Is it possible to prevent implementation errors or API



## Analysis/Design


**AS-IS Organization (Horizontally-Aligned)**
  ![image](https://user-images.githubusercontent.com/487999/79684144-2a893200-826a-11ea-9a01-79927d3a0107.png)

**TO-BE Organization (Vertically-Aligned)**
  ![image](https://user-images.githubusercontent.com/487999/79684159-3543c700-826a-11ea-8d5f-a3fc0c4cad87.png)

**[Eventstorming results modeled with MSAEz](http://www.msaez.io/#/storming/nZJ2QhwVc4NlVJPbtTkZ8x9jclF2/a77281d704710b0c2e6a823b6e6d973a)**

**event derivation**
![image](https://user-images.githubusercontent.com/487999/79683604-47bc0180-8266-11ea-9212-7e88c9bf9911.png)

**Drop out of an ineligible event**
![image](https://user-images.githubusercontent.com/487999/79683612-4b4f8880-8266-11ea-9519-7e084524a462.png)

- Performs the task of filtering out wrong domain events derived during the process
    - When ordering>Menu category selected, When ordering>Menu searched: Excluded because it is an event of the UI and not a business event

**Easy to read by attaching actors and commands**
![image](https://user-images.githubusercontent.com/487999/79683614-4ee30f80-8266-11ea-9a50-68cdff2dcc46.png)

**bind with aggregation**
![image](https://user-images.githubusercontent.com/487999/79683618-52769680-8266-11ea-9c21-48d6812444ba.png)

- Order of app, order processing of store, and payment history of payment are grouped together as units in which transactions must be maintained by commands and events connected to them.

**Bind to Bounded Context**

![image](https://user-images.githubusercontent.com/487999/79683625-560a1d80-8266-11ea-9790-40d68a36d95d.png)

- domain sequence separation 
    - Core Domain: app (front), store: It is an indispensable core service, and the annual up-time SLA level is set at 99.999%, and the distribution cycle is less than once a week for apps and less than once a month for stores.
    - Supporting Domain: marketing, customer: This is a service to increase competitiveness, and the SLA level is aimed at uptime of 60% or more per year.
    - General Domain: pay: It is highly competitive to use a 3rd party external service as a payment service (to be converted to pink later)

**Attach the policy (parentheses are the subject of execution, and it does not matter if you attach the policy in the second step. The entire linkage is revealed at the beginning)**

![image](https://user-images.githubusercontent.com/487999/79683633-5aced180-8266-11ea-8f42-c769eb88dfb1.png)

**Policy movement and context mapping (dashed lines are Pub/Sub, solid lines are Req/Resp)**

![image](https://user-images.githubusercontent.com/487999/79683641-5f938580-8266-11ea-9fdb-4e80ff6642fe.png)

**Completed first model**

![image](https://user-images.githubusercontent.com/487999/79683646-63bfa300-8266-11ea-9bc5-c0b650507ac8.png)

- Add View Model

**Verification that functional/non-functional requirements for the first complete version are covered**

![image](https://user-images.githubusercontent.com/487999/79684167-3ecd2f00-826a-11ea-806a-957362d197e3.png)

- The customer selects the menu and places an order (ok)
- The customer pays (ok)
- When an order is placed, the order details are delivered to the store owner (ok)
- The store owner confirms, cooks and starts delivery (ok)


![image](https://user-images.githubusercontent.com/487999/79684170-47256a00-826a-11ea-9777-e16fafff519a.png)

- Customer can cancel order (ok)
- If the order is canceled, the delivery is canceled (ok)
- The customer inquires the order status in the middle (addition of View-green sticker is ok)
- Send a notification through KakaoTalk whenever the order status changes (?)


**Modify the model**
![image](https://user-images.githubusercontent.com/487999/79684176-4e4c7800-826a-11ea-8deb-b7b053e5d7c6.png)

- The modified model covers all requirements.

**Verification of non-functional requirements**

![image](https://user-images.githubusercontent.com/487999/79684184-5c9a9400-826a-11ea-8d87-2ed1e44f4562.png)

- Transaction processing for scenarios that cross microservices
    - Payment processing for customer orders: ACID transaction is applied in accordance with the management's long-standing belief (?) that orders that have not been paid will never be accepted. Request-Response method processing for payment processing at the time of order completion
    - Store owner connection and delivery processing when payment is completed: In the process of transferring an order request from the App (front) to the Store Microservice, the Store Microservice has a separate distribution cycle, so the transaction is processed in the Eventual Consistency method.
    - All other inter-microservice transactions: In most cases, the timing of data consistency is not critical, such as processing KakaoTalk for all events such as order status and delivery status, so Eventual Consistency is adopted as the default.

**Hexagonal Architecture Diagram Derivation**
![image](https://user-images.githubusercontent.com/487999/79684772-eba9ab00-826e-11ea-9405-17e2bf39ec76.png)

- Distinguish between inbound adapter and outbound adapter by referring to Chris Richardson, MSA Patterns
- Distinguish between PubSub and Req/Resp in the call relationship
- Separation of sub-domains and bounded contexts: Each team's KPIs share their interest implementation stories as follows



## avatar

According to the hexagonal architecture derived from the analysis/design phase, microservices representing each BC were implemented with Spring Boot and Python. The method to run each implemented service locally is as follows (each port number is 8081 ~ 808n)


```
cd app
mvn spring-boot:run

cd pay
mvn spring-boot:run 

cd store
mvn spring-boot:run  

cd customer
python policy-handler.py 
```

### · Application of DDD

- The core Aggregate Root object derived within each service is declared as an Entity: (Example: pay microservice). At this time, I tried to use the language (ubiquitous language) used in the field as it is possible. However, in some implementations, it is not possible to continue using the method because it may not be possible to execute it if it is not in English. (It was confirmed that an error occurs when identifiers are used in Korean for Maven pom.xml, topic id of Kafka, service id of FeignClient, etc.)

```
package fooddelivery;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.List;

@Entity
@Table(name="Payment history_table")
public class Payment history {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private String orderId;
    private Double Price;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public Double get Price() {
        return Price;
    }

    public void set Price(Double Price) {
        this.Price = Price;
    }

}

```
- By applying Entity Pattern and Repository Pattern, RestRepository of Spring Data REST was applied to automatically create a data access adapter so that there is no separate processing for various data source types (RDB or NoSQL) through JPA.
```
package fooddelivery;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface Payment history Repository extends PagingAndSortingRepository<Payment history, Long>{
}
```
- REST API test after application
```
# app order processing of services
http localhost:8081/orders item="chicken"

# store Delivery of services
http localhost:8083/order processing orderId=1

# Check order status
http localhost:8081/orders/1

```


### · Polyglat Persistence

The app front (app) decided to use Mongo DB, a Document DB / NoSQL database, rather than RDB due to the influx of many users and the need to store various contents of product information due to the characteristics of the service. To this end, the declaration of order is marked with @Document instead of @Entity, and it is attached to MongoDB only by applying the existing Entity Pattern and Repository Pattern and setting the database product (application.yml) without any special work. 

```
# Order.java

package fooddelivery;

@Document
public class Order {

    private String id; // mongo db When applied id is a fixed value Because the key is a field that is automatically issued You don't need to give @Id or @GeneratedValue .
    private String item;
    private Integer Quantity;

}


# OrderRepository.java
package fooddelivery;

public interface OrderRepository extends JpaRepository<Order, UUID>{
}

# application.yml

  data:
    mongodb:
      host: mongodb.default.svc.cluster.local
    database: mongo-example

```

### · polyglot programming

The team decided to implement the function to send KakaoTalk messages to customers according to the change of order status and delivery status, which are scenarios of customer management service (customer), using python. The corresponding Python implementation is implemented as a Kafka consumer that receives and processes each event, and the code is as follows: 
```
from flask import Flask
from redis import Redis, RedisError
from kafka import KafkaConsumer
import os
import socket


# To consume latest messages and auto-commit offsets
consumer = KafkaConsumer('fooddelivery',
                         group_id='',
                         bootstrap_servers=['localhost:9092'])
for message in consumer:
    print ("%s:%d:%d: key=%s value=%s" % (message.topic, message.partition,
                                          message.offset, message.key,
                                          message.value))

    # Kakao Talk API
```

The Docker file for compiling and running the Python application is as follows (Is this work to be done in the operational stage? No, this is up to the developer to do. Immutable Image):
```
FROM python:2.7-slim
WORKDIR /app
ADD . /app
RUN pip install --trusted-host pypi.python.org -r requirements.txt
ENV NAME World
EXPOSE 8090
CMD ["python", "policy-handler.py"]
```


### · Synchronous Invocation and Fallback Handling

As one of the conditions in the analysis stage, the call between order (app) -> payment (pay) was decided to be processed as a transaction that maintains synchronous consistency. The calling protocol allows the REST service already exposed by the Rest Repository to be called using FeignClient

- Implement service proxy interface (Proxy) using stub and (FeignClient) to call payment service  

```
# (app) PaymentHistoryService.java

package fooddelivery.external;

@FeignClient(name="pay", url="http://localhost:8082")//, fallback = PaymentHistoryServiceFallback.class)
public interface PaymentHistoryService {

    @RequestMapping(method= RequestMethod.POST, path="/PaymentHistoryServices")
    public void payment(@RequestBody PaymentHistoryService pay);

}
```

- Process to request payment immediately after receiving the order (@PostPersist)
```
# Order.java (Entity)

    @PostPersist
    public void onPostPersist(){

        fooddelivery.external.PaymentHistory pay = new fooddelivery.external.PaymentHistory();
        pay.setOrderId(getOrderId());
        
        Application.applicationContext.getBean(fooddelivery.external.PaymentHistory Service.class)
                .payment(pay);
    }
```

- Confirm that synchronous calls result in time coupling with the time of the call, and that orders cannot be taken if the payment system fails:


```
# payment (pay) put down service (ctrl+c)

#order processing
http localhost:8081/orders item=chicken storeId=1   #Fail
http localhost:8081/orders item=Pizza storeId=2   #Fail

#Restart payment service
cd payment
mvn spring-boot:run

#order processing
http localhost:8081/orders item=chicken storeId=1   #Success
http localhost:8081/orders item=Pizza storeId=2   #Success
```

- Also, in case of excessive request, service failure can occur like dominoes. (Circuit breaker and fallback processing will be explained in the operation phase.)


### · Asynchronous call / temporal decoupling / fault isolation / eventual consistency test


The act of notifying the store system after payment is made is not synchronous, but asynchronous, so that the payment order is not blocked for the store system to process. 
 
- To this end, after leaving a record in the payment history, a domain event indicating that the payment has been approved is immediately sent to Kafka (Publish). 

 
```
package fooddelivery;

@Entity
@Table(name="PaymentHistory_table")
public class PaymentHistory {

 ...
    @PrePersist
    public void onPrePersist(){
        PaymentApproved = new PaymentApproved();
        BeanUtils.copyProperties(this, PaymentApproved);
        PaymentApproved.publish();
    }

}
```
- In store service, implement PolicyHandler to receive payment approval event and handle its own policy:

```
package fooddelivery;

...

@Service
public class PolicyHandler{

    @StreamListener(KafkaProcessor.INPUT)
    public void wheneverPaymentApproved_ReceiveOrderInformation(@Payload PaymentApproved PaymentApproved){

        if(PaymentApproved.isMe()){
            System.out.println("##### listener ReceiveOrderInformation : " + PaymentApproved.toJson());
            // Now that we've received the order information, we should start cooking soon...
            
        }
    }

}

```
In actual implementation, the store owner will receive a notification through KakaoTalk, etc., and after cooking is completed, the order status will be entered into the UI.
  
```
  @Autowired OrderManagementRepository OrderManagementRepository;
  
  @StreamListener(KafkaProcessor.INPUT)
  public void wheneverPaymentApproved_ReceiveOrderInformation(@Payload PaymentApproved PaymentApproved){

      if(PaymentApproved.isMe()){
          KakaoTalk(" The order has arrived! : " + PaymentApproved.toString(), order.getStoreId());

          OrderManagement order = new OrderManagement();
          order.setId(PaymentApproved.getOrderId());
          OrderManagementRepository.save(order);
      }
  }

```
Since the store system is completely separate from order/payment and is processed according to the reception of events, there is no problem in receiving orders even if the store system is temporarily down due to maintenance:
```
# Put down store services (store) for a while (ctrl+c)

#OrderProcessing
http localhost:8081/orders item=chicken storeId=1   #Success
http localhost:8081/orders item=Pizza storeId=2   #Success

#Order Status Check
http localhost:8080/orders     # Confirm that the order status has not changed

#shop service startup
cd shop
mvn spring-boot:run

#order status check
http localhost:8080/orders     # Check the status of all orders as "shipped"
```


## operation

### · CI/CD settings


Each implementation was configured in their own source repository, the CI/CD platform used was GCP, and the pipeline build script was included in cloudbuild.yml under each project folder.


### · Synchronous call / circuit breaking / fault isolation

* Choice of circuit breaking framework: Implemented using Spring FeignClient + Hystrix option

The scenario is implemented by linking the connection at the time of the terminal app-->pay with RESTful Request/Response, and when the payment request is excessive, fault isolation through CB. 

- Set Hystrix: Set the CB circuit to close (fail and block requests quickly) when the processing time starts to exceed 610 millimeters in the request processing thread and is maintained for a certain amount. 
```
# application.yml
feign:
  hystrix:
    enabled: true
    
hystrix:
  command:
    # Global settings
    default:
      execution.isolation.thread.timeoutInMilliseconds: 610

```

- Random load handling of the called service (payment: pay) - It fluctuates from 400 millimeters to 220 millimeters.
```
# (pay) Payment history.java (Entity)

    @PrePersist
    public void onPrePersist(){  //Save the payment history and drag the appropriate time

        ...
        
        try {
            Thread.currentThread().sleep((long) (400 + Math.random() * 220));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
```

- Check circuit breaker operation with load tester siege tool:
- 100 concurrent users
- run for 60 seconds

```
$ siege -c100 -t60S -r10 --content-type "application/json" 'http://localhost:8081/orders POST {"item": "chicken"}'

** SIEGE 4.0.5
** Preparing 100 concurrent users for battle.
The server is now under siege...

HTTP/1.1 201     0.68 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.68 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.70 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.70 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.73 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.75 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.77 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.97 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.81 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.87 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.12 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.16 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.17 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.26 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.25 secs:     207 bytes ==> POST http://localhost:8081/orders

* Excessive request triggers CB Block request

HTTP/1.1 500     1.29 secs:     248 bytes ==> POST http://localhost:8081/orders   
HTTP/1.1 500     1.24 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     1.23 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     1.42 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     2.08 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.29 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     1.24 secs:     248 bytes ==> POST http://localhost:8081/orders

* After returning some of the requests, the previously delayed tasks have been processed, and the circuit is closed to start receiving requests again.

HTTP/1.1 201     1.46 secs:     207 bytes ==> POST http://localhost:8081/orders  
HTTP/1.1 201     1.33 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.36 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.63 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.65 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.68 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.69 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.71 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.71 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.74 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.76 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     1.79 secs:     207 bytes ==> POST http://localhost:8081/orders

* The requests start to pile up again, and the processing time per case starts to slightly exceed 610 milliseconds => open circuit => handle request failure

HTTP/1.1 500     1.93 secs:     248 bytes ==> POST http://localhost:8081/orders    
HTTP/1.1 500     1.92 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     1.93 secs:     248 bytes ==> POST http://localhost:8081/orders

* Condition improved faster than expected - (processing time per case (per thread) returned to less than 610 millimeters) => request accepted

HTTP/1.1 201     2.24 secs:     207 bytes ==> POST http://localhost:8081/orders  
HTTP/1.1 201     2.32 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.16 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.19 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.19 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.19 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.21 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.29 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.30 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.38 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.59 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.61 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.62 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     2.64 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.01 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.27 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.33 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.45 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.52 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.57 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.69 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.70 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.69 secs:     207 bytes ==> POST http://localhost:8081/orders

* After that, as this pattern continues to repeat, the system operates well without domino effects or runaway resource consumption.


HTTP/1.1 500     4.76 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.23 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.76 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.74 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.82 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.82 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.84 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.66 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     5.03 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.22 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.19 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.18 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.69 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.65 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     5.13 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.84 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.25 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.25 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.80 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.87 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.33 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.86 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.96 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.34 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 500     4.04 secs:     248 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.50 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.95 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.54 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     4.65 secs:     207 bytes ==> POST http://localhost:8081/orders


:
:

Transactions:		        1025 hits
Availability:		       63.55 %
Elapsed time:		       59.78 secs
Data transferred:	        0.34 MB
Response time:		        5.60 secs
Transaction rate:	       17.15 trans/sec
Throughput:		        0.01 MB/sec
Concurrency:		       96.02
Successful transactions:        1025
Failed transactions:	         588
Longest transaction:	        9.20
Shortest transaction:	        0.00

```
- The operating system does not die and continuously shows that the circuit is properly opened and closed by CB to protect the resource. However, it is not good for customer usability that 63.55% succeeded and 46% failed, so follow-up processing to expand the system through retry setting and dynamic scale out (automatic addition of replica, HPA) is necessary.

- Retry configuration (istio)
- Confirm that availability is increased (siege)

### · autoscale out
Previously, CB made it possible to operate the system stably, but it did not accept 100% of the user's request.


- Configure HPA to dynamically increase replicas for payment service. The setting increases the number of replicas to 10 when CPU usage exceeds 15%:
```
kubectl autoscale deploy pay --min=1 --max=10 --cpu-percent=15
```
- Walk the workload for 2 minutes the way CB did.
```
siege -c100 -t120S -r10 --content-type "application/json" 'http://localhost:8081/orders POST {"item": "chicken"}'
```
- Monitor how autoscale is going:
```
kubectl get deploy pay -w
```
- After some time (about 30 seconds) you can see the scale out occurs:
```
NAME    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
pay     1         1         1            1           17s
pay     1         2         1            1           45s
pay     1         4         1            1           1m
:
```
- If you look at the log of siege, you can see that the overall success rate has increased.
```
Transactions:		        5078 hits
Availability:		       92.45 %
Elapsed time:		       120 secs
Data transferred:	        0.34 MB
Response time:		        5.60 secs
Transaction rate:	       17.15 trans/sec
Throughput:		        0.01 MB/sec
Concurrency:		       96.02
```


### · Uninterrupted redistribution

* First, remove Autoscaler or CB settings to check whether non-stop redistribution is 100%.

- Monitoring the workload right before deployment with seige.
```
siege -c100 -t120S -r10 --content-type "application/json" 'http://localhost:8081/orders POST {"item": "chicken"}'

** SIEGE 4.0.5
** Preparing 100 concurrent users for battle.
The server is now under siege...

HTTP/1.1 201     0.68 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.68 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.70 secs:     207 bytes ==> POST http://localhost:8081/orders
HTTP/1.1 201     0.70 secs:     207 bytes ==> POST http://localhost:8081/orders
:

```

- Start deploying to a new version
```
kubectl set image ...
```

- Go to seige's screen and check if Availability has dropped below 100%
```
Transactions:		        3078 hits
Availability:		       70.45 %
Elapsed time:		       120 secs
Data transferred:	        0.34 MB
Response time:		        5.60 secs
Transaction rate:	       17.15 trans/sec
Throughput:		        0.01 MB/sec
Concurrency:		       96.02

```
Confirm that the availability falls from 100% to 70% during the distribution period. The reason is that Kubernetes recognized the newly uploaded service as a READY state and proceeded to introduce the service. To prevent this, we set up a Readiness Probe:

```
# Set the readiness probe in deployment.yaml :


kubectl apply -f kubernetes/deployment.yaml
```

- Check Availability after redeploying with the same scenario:
```
Transactions:		        3078 hits
Availability:		       100 %
Elapsed time:		       120 secs
Data transferred:	        0.34 MB
Response time:		        5.60 secs
Transaction rate:	       17.15 trans/sec
Throughput:		        0.01 MB/sec
Concurrency:		       96.02

```

Uninterrupted redistribution is confirmed to be successful because availability does not change during the deployment period.


## Addition of new development organizations

  ![image](https://user-images.githubusercontent.com/487999/79684133-1d6c4300-826a-11ea-94a2-602e61814ebf.png)


**Addition of Marketing Team**

- KPI: Increase the influx of new customers and increase the loyalty of existing customers
- Implementation plan microservices: We plan to acquire existing customer microservices and provide food and restaurant recommendation services to customers. Event Storming

**Event Storming**

![image](https://user-images.githubusercontent.com/487999/79685356-2b729180-8273-11ea-9361-a434065f2249.png)


**Hexagonal Architecture Changes**

![image](https://user-images.githubusercontent.com/487999/79685243-1d704100-8272-11ea-8ef6-f4869c509996.png)

**avatar**

Implement the Inbund request by subscribing to events rather than REST so that modifications do not occur in the existing microservices. Added regardless of architecture or database structure of existing microservices for existing microservices.

**Operation and Retirement**

Because it is not implemented in the Request/Response method, even if the service is no longer needed, it has no effect on the existing microservice if it is removed from the Deployment.

* [Comparison] In the case of a pay microservice, it causes an API change or a change in the app (order) microservice at Retire:

예) When API changes
```
# Order.java (Entity)

    @PostPersist
    public void onPostPersist(){

        fooddelivery.external.PaymentHistory pay = new fooddelivery.external.PaymentHistory();
        pay.setOrderId(getOrderId());
        
        Application.applicationContext.getBean(fooddelivery.external.PaymentHistoryService.class)
                .payment(pay);

                --> 

        Application.applicationContext.getBean(fooddelivery.external.PaymentHistoryService.class)
                .payment2(pay);

    }
```

ex) Retire
```
# Order.java (Entity)

    @PostPersist
    public void onPostPersist(){

        /**
        fooddelivery.external.PaymentHistory pay = new fooddelivery.external.PaymentHistory();
        pay.setOrderId(getOrderId());
        
        Application.applicationContext.getBean(fooddelivery.external.PaymentHistoryService.class)
                .payment(pay);

        **/
    }
```



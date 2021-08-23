---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# AirBnB

![image](https://user-images.githubusercontent.com/15603058/119284989-fefe2580-bc7b-11eb-99ca-7a9e4183c16f.jpg)
source: https://github.com/msa-ez/airbnb_project

<h2>Accommodation reservation(AirBnB)</h2>

This example is configured to cover all stages of analysis/design/implementation/operation including MSA/DDD/Event Storming/EDA. It includes example answers to pass the checkpoints required for the development of cloud-native applications.

- checkpoint : https://workflowy.com/s/assessment-check-po/T5YrzcMewfo4J6LW

## service scenario

Cover AirBnB

**functional requirements**<br>
1. Register/modify/delete the accommodation for the host to rent.<br>
2. The customer selects and makes a reservation.<br>
3. Payment is made at the same time as the reservation.<br>
4. When a reservation is made, the reservation details (Message) are delivered.<br>
5. The customer may cancel the reservation.<br>
6. If the reservation is canceled, a cancellation message (Message) is delivered.<br>
7. You can leave a review on the property.<br>
8. You can check the overall accommodation information and reservation status on one screen. (viewpage)
<br><br>

**Non-functional requirements** <br>
1. Transactions <br>
2. Reservations without payment should not be established. (Sync call) <br>
3. Failure isolation <br>
4. Reservation should be available 24 hours a day, 365 days a year even if accommodation registration and message transmission functions are not performed Async (event-driven), Eventual Consistency<br><br>
5. When the reservation system is overloaded, users are temporarily shut down. Inducing them to do it after a while without receiving it Circuit breaker, fallback<br><br>
6. Performance <br>
7. It should be possible to check all room information and reservation status at once (CQRS) <br>
8. It should be possible to give a message whenever the reservation status changes Event driven)


## CheckPoint

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
 
    - Can you differentiate between task importance and hierarchy between domains? (Core, Supporting, General Domain)

    - Can the request-response method and event-driven method be designed separately?

    - Fault Isolation: Is it designed so that the existing service is not affected even if the supporting service is removed?

    - Can it be designed (open architecture) so that the database of existing services is not affected when new services are added?

    - Did you design the Correlation-key connection to connect the event and the policy properly?

  - Hexagonal Architecture

    - Did you draw the hexagonal architecture diagram according to the design result correctly?

    
- avatar
  - [DDD] Was the realization developed to be mapped according to the color of each sticker and the hexagonal architecture in the analysis stage?
    - Have you developed a data access adapter through JPA by applying Entity Pattern and Repository Pattern?
    - [Hexagonal Architecture] In addition to the REST inbound adapter, is it possible to adapt the existing implementation to a new protocol without damaging the domain model by adding an inbound adapter such as gRPC?
    - Is the source code described using the ubiquitous language (terms used in the workplace) in the analysis stage?
  - Implementation of service-oriented architecture of Request-Response method
    - How did you find and call the target service in the Request-Response call between microservices? (Service Discovery, REST, FeignClient)
    - Is it possible to isolate failures through circuit breakers?
  - Implementing an event-driven architecture
    -	Are more than one service linked with PubSub using Kafka?
    -	Correlation-key: When each event (message) processes which policy, is the Correlation-key connection properly implemented to distinguish which event is connected to which event?
    -	Does the Message Consumer microservice receive and process existing events that were not received in the event of a failure?
    -	Scaling-out: Is it possible to receive events without duplicates when a replica of the Message Consumer microservice is added?
    -	CQRS: By implementing Materialized View, is it possible to configure the screen of my service and view it frequently without accessing the data source of other microservices (without Composite service or join SQL, etc.)?


  - polyglot programming
    -	Are each microservices composed of one or more separate technology stacks?
	  -	Did each microservice autonomously adopt its own storage structure and implement it by selecting its own storage type (RDB, NoSQL, File System, etc.)?
  - API Gateway
    - Can the point of entry of microservices be unified through API GW?
    - Is it possible to secure microservices through gateway, authentication server (OAuth), and JWT token authentication?
- operation
  - SLA Compliance
    -	Self-Healing: Through the Liveness Probe, as the health status of any service continuously deteriorates, at what threshold can it be proven that the pod is regenerated?
    -	Can fault isolation and performance efficiency be improved through circuit breaker and ray limit?
    -	Is it possible to set up an autoscaler (HPA) for scalable operation?
    -	Monitoring, alerting:
  - Nonstop Operation CI/CD (10)
    -	When the new version is fully serviceable through the setting of the Readiness Probe and rolling update, it is proved by siege that the service is converted to the new version of the service.
    -	Contract Test: Is it possible to prevent implementation errors or API contract violations in advance through automated boundary testing?


## Analysis/Design

<h3>Horizontally-Aligned</h3>

  ![image](https://user-images.githubusercontent.com/77129832/119316165-96ca3680-bcb1-11eb-9a91-f2b627890bab.png)

<h3>TO-BE Organization (Vertically-Aligned)</h3>

  ![image](https://user-images.githubusercontent.com/77129832/119315258-a09f6a00-bcb0-11eb-9940-c2a82f2f7d09.png)


<h3>Event Storming Results</h3>

**[Eventstorming results modeled with MSAEz](http://www.msaez.io/#/storming/QtpQtDiH1Je3wad2QxZUJVvnLzO2/6f36e16efdf8c872da3855fedf7f3ea9)**

**event derivation**
![image](https://user-images.githubusercontent.com/15603058/119298548-337fda80-bc98-11eb-9f96-7d583d156fb9.png)


**Drop out of an ineligible event**
![image](https://user-images.githubusercontent.com/15603058/119298594-4f837c00-bc98-11eb-9f67-ec2e882e1f33.png)

- Filtering out invalid domain events derived during the process
    - Registration>RoomSearched, Reservation>RoomSelected: Excluded because it is a UI event and not a business event

**Easy to read by attaching actors and commands**
![image](https://user-images.githubusercontent.com/15603058/119298993-113a8c80-bc99-11eb-9bae-4b911317d810.png)

**bind with aggregation**
![image](https://user-images.githubusercontent.com/15603058/119299589-2663eb00-bc9a-11eb-83b9-de7f3efe7548.png)

- Room, Reservation, Payment, and Review are grouped together as a unit in which transactions must be maintained by the commands and events associated with them.

**Bind to Bounded Context**
![image](https://user-images.githubusercontent.com/15603058/119300858-6c21b300-bc9c-11eb-9b3f-c85aff51658f.png)

- domain sequence separation 
    - Core Domain: reservation, room: It is an indispensable core service, and the annual Up-time SLA level is set at 99.999%, and the distribution cycle is less than once a week for reservation and less than once a month for room.

    - Supporting Domain: message, viewpage: This is a service for competitiveness, and the SLA level is 60% or more per year uptime goal, and the distribution cycle is autonomous by each team, but the standard sprint cycle is one week, so it is based on at least once a week.

    - General Domain: payment: It is more competitive to use a 3rd party external service as a payment service
 

**Attach the policy (parentheses are the subject of execution, and it does not matter if you attach the policy in the second step. The entire linkage is revealed at the beginning)**

![image](https://user-images.githubusercontent.com/15603058/119303664-1b608900-bca1-11eb-8667-7545f32c9fb9.png)

**Policy movement and context mapping (dashed lines are Pub/Sub, solid lines are Req/Resp)**

![image](https://user-images.githubusercontent.com/15603058/119304604-73e45600-bca2-11eb-8f1d-607006919fab.png)

**Completed first model**

![image](https://user-images.githubusercontent.com/15603058/119305002-0edd3000-bca3-11eb-9cc0-1ba8b17f2432.png)

- Add View Model

**Verification that functional/non-functional requirements for the first complete version are**

![image](https://user-images.githubusercontent.com/15603058/119306321-f110ca80-bca4-11eb-804c-a965220bad61.png)

- Register/modify/delete accommodation for the host to rent (ok)
- The customer selects and makes a reservation (ok)
- Payment is made at the same time as the reservation. (ok)
- When a reservation is made, the reservation details (Message) are delivered.(?)
- The customer can cancel the reservation (ok).
- If the reservation is canceled, a cancellation message is sent.(?)
- You can leave a review on the property (ok).
- You can check the overall accommodation information and reservation status on one screen. (Add View-green Sticker is ok)
    
**Modify the model**

![image](https://user-images.githubusercontent.com/15603058/119307481-b740c380-bca6-11eb-9ee6-fda446e299bc.png)
    
- The modified model covers all requirements.

**Verification of non-functional requirements**

![image](https://user-images.githubusercontent.com/15603058/119311800-79df3480-bcac-11eb-9c1b-0382d981f92f.png)

- Transaction processing for scenarios that cross microservices
- Payment processing at the time of customer reservation: ACID transaction is applied by deciding that reservations that have not been paid will never be accepted. When booking is completed, check the room status in advance and process the request-response method for payment processing
- Host connection and reservation processing when payment is completed: Since the room microservice has a separate distribution cycle in the process of transferring the reservation request from reservation to the room microservice, the transaction is processed in the eventual consistency method.
- All other inter-microservice transactions: For all events such as reservation status and post-processing, it is judged that the timing of data consistency is not critical in most cases, so Eventual Consistency is adopted as the default.


**Hexagonal Architecture Diagram Derivation**

![image](https://user-images.githubusercontent.com/80744273/119319091-fc6bf200-bcb4-11eb-9dac-0995c84a82e0.png)


- Distinguish between inbound adapters and outbound adapters by referring to Chris Richardson, MSA Patterns
- Distinguish between PubSub and Req/Resp in the call relationship
- Separation of sub-domains and bounded contexts: Each team’s KPIs share their interest implementation stories as follows



## avatar

According to the hexagonal architecture derived from the analysis/design phase, microservices represented by each BC were implemented with Spring Boot. The method to run each implemented service locally is as follows (each port number is 8081 ~ 808n)


```
mvn spring-boot:run
```

### · CQRS

CQRS was implemented so that customers can inquire about total status such as availability of rooms, reviews and reservations/payments.

- Performance issues can be prevented in advance by integrating individual aggregate status for room, review, reservation, and payment.
- Asynchronously processed and issued event-based Kafka is received/processed and managed in a separate table
- Table modeling (ROOMVIEW)


  ![image](https://user-images.githubusercontent.com/77129832/119319352-4b198c00-bcb5-11eb-93bc-ff0657feeb9f.png)
- Implemented through viewpage MSA ViewHandler (when “RoomRegistered” event occurs, it is saved in a separate Roomview table based on Pub/Sub)
  ![image](https://user-images.githubusercontent.com/77129832/119321162-4d7ce580-bcb7-11eb-9030-29ee6272c40d.png)
  ![image](https://user-images.githubusercontent.com/31723044/119350185-fccab400-bcd9-11eb-8269-61868de41cc7.png)
- In fact, if you look up the view page, you can see information such as overall reservation status, payment status, and number of reviews for all rooms.
  ![image](https://user-images.githubusercontent.com/31723044/119357063-1b34ad80-bce2-11eb-94fb-a587261ab56f.png)


### · API Gateway
1. After adding the gateway Spring Boot App, add routes for each microservice in application.yaml and set the gateway server port to 8080.

- application.yaml example
```
spring:
  profiles: docker
  cloud:
    gateway:
      routes:
        - id: payment
          uri: http://payment:8080
          predicates:
            - Path=/payments/** 
        - id: room
          uri: http://room:8080
          predicates:
            - Path=/rooms/**, /reviews/**, /check/**
        - id: reservation
          uri: http://reservation:8080
          predicates:
            - Path=/reservations/**
        - id: message
          uri: http://message:8080
          predicates:
            - Path=/messages/** 
        - id: viewpage
          uri: http://viewpage:8080
          predicates:
            - Path= /roomviews/**
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins:
              - "*"
            allowedMethods:
              - "*"
            allowedHeaders:
              - "*"
            allowCredentials: true

server:
  port: 8080            
```

         
2. Write Deployment.yaml for Kubernetes and create Deploy on Kubernetes
- Deployment.yaml example


```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway
  namespace: airbnb
  labels:
    app: gateway
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gateway
  template:
    metadata:
      labels:
        app: gateway
    spec:
      containers:
        - name: gateway
          image: 247785678011.dkr.ecr.us-east-2.amazonaws.com/gateway:1.0
          ports:
            - containerPort: 8080
```               



- Create a Deploy
```
kubectl apply -f deployment.yaml
```     
- Deploy created in Kubernetes. Confirm
            
![image](https://user-images.githubusercontent.com/80744273/119321943-1d821200-bcb8-11eb-98d7-bf8def9ebf80.png)
	    
            
3. Create a Service.yaml for Kubernetes and create a Service/LoadBalancer in Kubernetes to check the Gateway endpoint
- Service.yaml example

```
apiVersion: v1
  kind: Service
  metadata:
    name: gateway
    namespace: airbnb
    labels:
      app: gateway
  spec:
    ports:
      - port: 8080
        targetPort: 8080
    selector:
      app: gateway
    type:
      LoadBalancer           
```             


- Create Service
```
kubectl apply -f service.yaml            
```             


- Check API Gateway endpoint 
- Check Service and endpoint 
```
kubectl get svc -n airbnb           
```                 
![image](https://user-images.githubusercontent.com/80744273/119318358-2a046b80-bcb4-11eb-9d46-ef2d498c2cff.png)

## Correlation

In the Airbnb project, the Correlation-key implementation for distinguishing the type of processing in PolicyHandler is passed as a variable in the event class to accurately implement the related processing between services.

Take a look at the implementation example below

When you make a reservation, the status of services such as room and payment are appropriately changed at the same time. You can check that the data such as the state value is changed to the appropriate state.


reservation registration
![image](https://user-images.githubusercontent.com/31723044/119320227-54572880-bcb6-11eb-973b-a9a5cd1f7e21.png)
After booking - room condition
![image](https://user-images.githubusercontent.com/31723044/119320300-689b2580-bcb6-11eb-933e-98be5aadca61.png)
After reservation - reservation status
![image](https://user-images.githubusercontent.com/31723044/119320390-810b4000-bcb6-11eb-8c62-48f6765c570a.png)
After booking - payment status
![image](https://user-images.githubusercontent.com/31723044/119320524-a39d5900-bcb6-11eb-864b-173711eb9e94.png)
cancel reservation
![image](https://user-images.githubusercontent.com/31723044/119320595-b6b02900-bcb6-11eb-8d8d-0d5c59603c72.png)
After Cancellation - Room Status
![image](https://user-images.githubusercontent.com/31723044/119320680-ccbde980-bcb6-11eb-8b7c-66315329aafe.png)
After Cancellation - Reservation Status
![image](https://user-images.githubusercontent.com/31723044/119320747-dcd5c900-bcb6-11eb-9c44-fd3781c7c55f.png)
After Cancellation - Payment Status
![image](https://user-images.githubusercontent.com/31723044/119320806-ee1ed580-bcb6-11eb-8ccf-8c81385cc8ba.png)



### · Synchronous call (Sync) and Fallback handling

As one of the conditions in the analysis stage, it was decided to process the reservation availability status check call between rooms when making a reservation as a transaction that maintains synchronous consistency. The calling protocol allows the REST service already exposed by the Rest Repository to be called using FeignClient. Also, the reservation -> payment service was decided to be processed synchronously.

- Implement the service proxy interface (Proxy) using stub and (FeignClient) to call the room and payment service

```
# PaymentService.java

package airbnb.external;

<omit the import statement>

@FeignClient(name="Payment", url="${prop.room.url}")
public interface PaymentService {

    @RequestMapping(method= RequestMethod.POST, path="/payments")
    public void approvePayment(@RequestBody Payment payment);

}

# RoomService.java

package airbnb.external;

<omit the import statement>

@FeignClient(name="Room", url="${prop.room.url}")
public interface RoomService {

    @RequestMapping(method= RequestMethod.GET, path="/check/chkAndReqReserve")
    public boolean chkAndReqReserve(@RequestParam("roomId") long roomId);

}


```

- Immediately after receiving the reservation request (@PostPersist), check the availability and process the payment request synchronously (Sync)
```
# Reservation.java (Entity)

    @PostPersist
    public void onPostPersist(){

        ////////////////////////////////
        // When INSERTed into RESERVATION
        ////////////////////////////////

        ////////////////////////////////////
        // When a reservation request (reqReserve) is received
        ////////////////////////////////////

        // Check if the ROOM is available
        boolean result = ReservationApplication.applicationContext.getBean(airbnb.external.RoomService.class)
                        .chkAndReqReserve(this.getRoomId());
        System.out.println("######## Check Result : " + result);

        if(result) { 

            // If reservation is available

            //////////////////////////////
            // PAYMENT payment in progress (POST method) - SYNC call
            //////////////////////////////
            airbnb.external.Payment payment = new airbnb.external.Payment();
            payment.setRsvId(this.getRsvId());
            payment.setRoomId(this.getRoomId());
            payment.setStatus("paid");
            ReservationApplication.applicationContext.getBean(airbnb.external.PaymentService.class)
                .approvePayment(payment);

            /////////////////////////////////////
            // Event publication --> ReservationCreated
            /////////////////////////////////////
            ReservationCreated reservationCreated = new ReservationCreated();
            BeanUtils.copyProperties(this, reservationCreated);
            reservationCreated.publishAfterCommit();
        }
    }
```

- Confirm that synchronous calls result in time coupling with the time of the call, and that orders cannot be taken if the payment system fails:


```
# Pause the pay service temporarily (ctrl+c)

# Reservation request
http POST http://localhost:8088/reservations roomId=1 status=reqReserve   #Fail

# Restart payment service
cd payment
mvn spring-boot:run

# Reservation request
http POST http://localhost:8088/reservations roomId=1 status=reqReserve   #Success
```

- Also, in case of excessive request, service failure can occur like dominoes. (Circuit breaker and fallback processing will be explained in the operation phase.)




### · Asynchronous Invocation / Temporal Decoupling / Failure Isolation / Eventual Consistency Test


After payment is made, the status of the accommodation system is updated, the status of the reservation system is updated, and communication with the system to which reservation and cancellation messages are transmitted is handled asynchronously.
 
- For this, when the payment is approved, an event indicating that the payment has been approved is transmitted to Kafka. (Publish)
 
```
# Payment.java

package airbnb;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name="Payment_table")
public class Payment {

    ....

    @PostPersist
    public void onPostPersist(){
        ////////////////////////////
        // If payment is approved
        ////////////////////////////

        // Event publication -> PaymentApproved
        PaymentApproved paymentApproved = new PaymentApproved();
        BeanUtils.copyProperties(this, paymentApproved);
        paymentApproved.publishAfterCommit();
    }
    
    ....
}
```

- Reservation system implements PolicyHandler to receive payment approval event and handle its own policy:

```
# Reservation.java

package airbnb;

    @PostUpdate
    public void onPostUpdate(){
    
        ....

        if(this.getStatus().equals("reserved")) {

            ////////////////////
            // When the reservation is confirmed
            ////////////////////

            // event occurs --> ReservationConfirmed
            ReservationConfirmed reservationConfirmed = new ReservationConfirmed();
            BeanUtils.copyProperties(this, reservationConfirmed);
            reservationConfirmed.publishAfterCommit();
        }
        
        ....
        
    }

```

Other message services are completely separated from reservation/payment and are processed according to event reception, so there is no problem in receiving reservations even if the message service is temporarily down due to maintenance.

```
# Pause message service (ctrl+c)

# Reservation request
http POST http://localhost:8088/reservations roomId=1 status=reqReserve   #Success

# Check your reservation status
http GET localhost:8088/reservations    #Regardless of the message service, the reservation status is normal

```

## operation

### · CI/CD settings

Each implementation was configured in their own source repository, and the CI/CD used was AWS codebuild using buildspec.yml.

- Create a CodeBuild project and set the AWS_ACCOUNT_ID, KUBE_URL, and KUBE_TOKEN environment variables.
```
SA creation
kubectl apply -f eks-admin-service-account.yml
```
![codebuild(sa)](https://user-images.githubusercontent.com/38099203/119293259-ff52ec80-bc8c-11eb-8671-b9a226811762.PNG)
```
Create Role
kubectl apply -f eks-admin-cluster-role-binding.yml
```
![codebuild(role)](https://user-images.githubusercontent.com/38099203/119293300-1abdf780-bc8d-11eb-9b07-ad173237efb1.PNG)
```
Token confirmation
kubectl -n kube-system get secret
kubectl -n kube-system describe secret eks-admin-token-rjpmq
```
![codebuild(token)](https://user-images.githubusercontent.com/38099203/119293511-84d69c80-bc8d-11eb-99c7-e8929e6a41e4.PNG)
```
buildspec.yml 파일 
Set to use the yml file of the microservice room
```
![codebuild(buildspec)](https://user-images.githubusercontent.com/38099203/119283849-30292680-bc79-11eb-9f86-cbb715e74846.PNG)

- run codebuild
```
codebuild project and build history
```
![codebuild(프로젝트)](https://user-images.githubusercontent.com/38099203/119283851-315a5380-bc79-11eb-9b2a-b4522d22d009.PNG)
![codebuild(로그)](https://user-images.githubusercontent.com/38099203/119283850-30c1bd00-bc79-11eb-9547-1ff1f62e48a4.PNG)

- codebuild build history (Message service details)

![image](https://user-images.githubusercontent.com/31723044/119385500-2b0fba00-bd01-11eb-861b-cc31910ff945.png)

- codebuild build history (view full history)

![image](https://user-images.githubusercontent.com/31723044/119385401-087da100-bd01-11eb-8b69-ce222e6bb71e.png)




### · Synchronous Call / Circuit Breaking / Fault Isolation

* Circuit Breaking Framework of choice: implemented using istio

The scenario is implemented by linking the connection at reservation--> room with RESTful Request/Response, and when the reservation request is excessive, fault isolation through CB.

- Create a DestinationRule to allow circuit break to occur. Set a minimum connection pool.

```
# destination-rule.yml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: dr-room
  namespace: airbnb
spec:
  host: room
  trafficPolicy:
    connectionPool:
      http:
        http1MaxPendingRequests: 1
        maxRequestsPerConnection: 1
#    outlierDetection:
#      interval: 1s
#      consecutiveErrors: 1
#      baseEjectionTime: 10s
#      maxEjectionPercent: 100
```

* Activate istio-injection and check the room pod container

```
kubectl get ns -L istio-injection
kubectl label namespace airbnb istio-injection=enabled 
```

![Circuit Breaker(istio-enjection)](https://user-images.githubusercontent.com/38099203/119295450-d6812600-bc91-11eb-8aad-46eeac968a41.PNG)

![Circuit Breaker(pod)](https://user-images.githubusercontent.com/38099203/119295568-0cbea580-bc92-11eb-9d2b-8580f3576b47.PNG)


* Check circuit breaker operation with load tester siege tool:

run siege

```
kubectl run siege --image=apexacme/siege-nginx -n airbnb
kubectl exec -it siege -c siege -n airbnb -- /bin/bash
```


- When load is created with concurrent user 1, everything is normal.
```
siege -c1 -t10S -v --content-type "application/json" 'http://room:8080/rooms POST {"desc": "Beautiful House3"}'

** SIEGE 4.0.4
** Preparing 1 concurrent users for battle.
The server is now under siege...
HTTP/1.1 201     0.49 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.05 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     254 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     256 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     256 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     256 bytes ==> POST http://room:8080/rooms
```

- 168 503 errors occurred when creating a load with simultaneous user 2
```
siege -c2 -t10S -v --content-type "application/json" 'http://room:8080/rooms POST {"desc": "Beautiful House3"}'

** SIEGE 4.0.4
** Preparing 2 concurrent users for battle.
The server is now under siege...
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 503     0.10 secs:      81 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.04 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.05 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.22 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.08 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.07 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 503     0.01 secs:      81 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 503     0.01 secs:      81 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     258 bytes ==> POST http://room:8080/rooms
HTTP/1.1 503     0.00 secs:      81 bytes ==> POST http://room:8080/rooms

Lifting the server siege...
Transactions:                   1904 hits
Availability:                  91.89 %
Elapsed time:                   9.89 secs
Data transferred:               0.48 MB
Response time:                  0.01 secs
Transaction rate:             192.52 trans/sec
Throughput:                     0.05 MB/sec
Concurrency:                    1.98
Successful transactions:        1904
Failed transactions:             168
Longest transaction:            0.03
Shortest transaction:           0.00
```

- check circuit break on kiali screen

![Circuit Breaker(kiali)](https://user-images.githubusercontent.com/38099203/119298194-7f7e4f80-bc97-11eb-8447-678eece29e5c.PNG)


- Check the load again with the minimum connection pool again

```
** SIEGE 4.0.4
** Preparing 1 concurrent users for battle.
The server is now under siege...
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.00 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.00 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.00 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms

:
:

Lifting the server siege...
Transactions:                   1139 hits
Availability:                 100.00 %
Elapsed time:                   9.19 secs
Data transferred:               0.28 MB
Response time:                  0.01 secs
Transaction rate:             123.94 trans/sec
Throughput:                     0.03 MB/sec
Concurrency:                    0.98
Successful transactions:        1139
Failed transactions:               0
Longest transaction:            0.04
Shortest transaction:           0.00

```

- The operating system does not die and continuously shows that the circuit is properly opened and closed by CB to protect the resource. Post-processing to expand the system through virtualhost configuration and dynamic scale out (automatic addition of replica, HPA) is required.


**Auto Scale Out Previously**
CB enabled stable operation of the system, but it did not accept 100% of the user's request, so we want to apply an automated extension function as a complement to this.

- Add resources configuration to room deployment.yml file
![Autoscale (HPA)](https://user-images.githubusercontent.com/38099203/119283787-0a038680-bc79-11eb-8d9b-d8aed8847fef.PNG)

- Configure HPA to dynamically grow replicas for the room service. The setting increases the number of replicas to 10 when CPU usage exceeds 50%:
```
kubectl autoscale deployment room -n airbnb --cpu-percent=50 --min=1 --max=10
```
![Autoscale (HPA)(kubectl autoscale 명령어)](https://user-images.githubusercontent.com/38099203/119299474-ec92e480-bc99-11eb-9bc3-8c5246b02783.PNG)

- Load 100 concurrent users for 1 minute.
```
siege -c100 -t60S -v --content-type "application/json" 'http://room:8080/rooms POST {"desc": "Beautiful House3"}'
```
- Monitor how the autoscale is going
```
kubectl get deploy room -w -n airbnb 
```
- After some time (about 30 seconds) you can see the scale out occurs:
![Autoscale (HPA)(모니터링)](https://user-images.githubusercontent.com/38099203/119299704-6a56f000-bc9a-11eb-9ba8-55e5978f3739.PNG)

- If you look at the log of siege, you can see that the overall success rate has increased.
```
Lifting the server siege...
Transactions:                  15615 hits
Availability:                 100.00 %
Elapsed time:                  59.44 secs
Data transferred:               3.90 MB
Response time:                  0.32 secs
Transaction rate:             262.70 trans/sec
Throughput:                     0.07 MB/sec
Concurrency:                   85.04
Successful transactions:       15675
Failed transactions:               0
Longest transaction:            2.55
Shortest transaction:           0.01
```

### · Uninterrupted redistribution

* First, remove Autoscaler or CB settings to check whether non-stop redistribution is 100%.

```
kubectl delete destinationrules dr-room -n airbnb
kubectl label namespace airbnb istio-injection-
kubectl delete hpa room -n airbnb
```

- Monitoring the workload right before deployment with seige.
```
siege -c100 -t60S -r10 -v --content-type "application/json" 'http://room:8080/rooms POST {"desc": "Beautiful House3"}'

** SIEGE 4.0.4
** Preparing 1 concurrent users for battle.
The server is now under siege...
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.03 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.00 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.02 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms
HTTP/1.1 201     0.01 secs:     260 bytes ==> POST http://room:8080/rooms

```

- Start deploying to a new version
```
kubectl set image ...
```

- Go to seige's screen and check if Availability has dropped below 100%

```
siege -c100 -t60S -r10 -v --content-type "application/json" 'http://room:8080/rooms POST {"desc": "Beautiful House3"}'


Transactions:                   7732 hits
Availability:                  87.32 %
Elapsed time:                  17.12 secs
Data transferred:               1.93 MB
Response time:                  0.18 secs
Transaction rate:             451.64 trans/sec
Throughput:                     0.11 MB/sec
Concurrency:                   81.21
Successful transactions:        7732
Failed transactions:            1123
Longest transaction:            0.94
Shortest transaction:           0.00

```
- During the distribution period, it was confirmed that the availability fell from 100% to 87%. The reason is that Kubernetes recognized the newly uploaded service as a READY state and proceeded to introduce the service. To prevent this, readiness probe is set.

```
# Configure readiness probe in deployment.yaml:
```

![probe설정](https://user-images.githubusercontent.com/38099203/119301424-71333200-bc9d-11eb-9f75-f8c98fce70a3.PNG)

```
kubectl apply -f kubernetes/deployment.yml
```

- Check Availability after redeploying with the same scenario:
```
Lifting the server siege...
Transactions:                  27657 hits
Availability:                 100.00 %
Elapsed time:                  59.41 secs
Data transferred:               6.91 MB
Response time:                  0.21 secs
Transaction rate:             465.53 trans/sec
Throughput:                     0.12 MB/sec
Concurrency:                   99.60
Successful transactions:       27657
Failed transactions:               0
Longest transaction:            1.20
Shortest transaction:           0.00

```

Uninterrupted redistribution is confirmed to be successful because availability does not change during the distribution period.


## Self-healing (Liveness Probe)
- Edit room deployment.yml file
```
After running the container, create a /tmp/healthy file
Delete after 90 seconds
Make livenessProbe validate with 'cat /tmp/healthy'
```
![deployment yml tmp healthy](https://user-images.githubusercontent.com/38099203/119318677-8ff0f300-bcb4-11eb-950a-e3c15feed325.PNG)

- Check by running kubectl describe pod room -n airbnb
```
After 90 seconds of running the container, the driver is normal, but after that, the /tmp/healthy file is deleted and livenessProbe returns a failure.
If the pod is in a normal state, enter the pod and create a /tmp/healthy file to maintain the normal state.
```

![get pod tmp healthy](https://user-images.githubusercontent.com/38099203/119318781-a9923a80-bcb4-11eb-9783-65051ec0d6e8.PNG)
![touch tmp healthy](https://user-images.githubusercontent.com/38099203/119319050-f118c680-bcb4-11eb-8bca-aa135c1e067e.PNG)

## Config Map/ Persistence Volume
- Persistence Volume

1: Create EFS
```
You must select a VPC for your cluster when creating EFS
```
![You must choose a VPC for your cluster](https://user-images.githubusercontent.com/38099203/119364089-85048580-bce9-11eb-8001-1c20a93b8e36.PNG)

![Create EFS](https://user-images.githubusercontent.com/38099203/119343415-60041880-bcd1-11eb-9c25-1695c858f6aa.PNG)

2. EFS account creation and ROLE binding
```
kubectl apply -f efs-sa.yml

apiVersion: v1
kind: ServiceAccount
metadata:
  name: efs-provisioner
  namespace: airbnb


kubectl get ServiceAccount efs-provisioner -n airbnb
NAME              SECRETS   AGE
efs-provisioner   1         9m1s  
  
  
  
kubectl apply -f efs-rbac.yaml

namespace를 반듯이 수정해야함

  
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: efs-provisioner-runner
  namespace: airbnb
rules:
  - apiGroups: [""]
    resources: ["persistentvolumes"]
    verbs: ["get", "list", "watch", "create", "delete"]
  - apiGroups: [""]
    resources: ["persistentvolumeclaims"]
    verbs: ["get", "list", "watch", "update"]
  - apiGroups: ["storage.k8s.io"]
    resources: ["storageclasses"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["events"]
    verbs: ["create", "update", "patch"]
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: run-efs-provisioner
  namespace: airbnb
subjects:
  - kind: ServiceAccount
    name: efs-provisioner
     # replace with namespace where provisioner is deployed
    namespace: airbnb
roleRef:
  kind: ClusterRole
  name: efs-provisioner-runner
  apiGroup: rbac.authorization.k8s.io
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-efs-provisioner
  namespace: airbnb
rules:
  - apiGroups: [""]
    resources: ["endpoints"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]
---
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: leader-locking-efs-provisioner
  namespace: airbnb
subjects:
  - kind: ServiceAccount
    name: efs-provisioner
    # replace with namespace where provisioner is deployed
    namespace: airbnb
roleRef:
  kind: Role
  name: leader-locking-efs-provisioner
  apiGroup: rbac.authorization.k8s.io


```

3. Deploy EFS Provisioner
```
kubectl apply -f efs-provisioner-deploy.yml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: efs-provisioner
  namespace: airbnb
spec:
  replicas: 1
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: efs-provisioner
  template:
    metadata:
      labels:
        app: efs-provisioner
    spec:
      serviceAccount: efs-provisioner
      containers:
        - name: efs-provisioner
          image: quay.io/external_storage/efs-provisioner:latest
          env:
            - name: FILE_SYSTEM_ID
              value: fs-562f9c36
            - name: AWS_REGION
              value: ap-northeast-2
            - name: PROVISIONER_NAME
              value: my-aws.com/aws-efs
          volumeMounts:
            - name: pv-volume
              mountPath: /persistentvolumes
      volumes:
        - name: pv-volume
          nfs:
            server: fs-562f9c36.efs.ap-northeast-2.amazonaws.com
            path: /


kubectl get Deployment efs-provisioner -n airbnb
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
efs-provisioner   1/1     1            1           11m

```

4. Register the installed provisioner to storageclass
```
kubectl apply -f efs-storageclass.yml


kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: aws-efs
  namespace: airbnb
provisioner: my-aws.com/aws-efs


kubectl get sc aws-efs -n airbnb
NAME            PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
aws-efs         my-aws.com/aws-efs      Delete          Immediate              false                  4s
```

5. Create a PersistentVolumeClaim (PVC)
```
kubectl apply -f volume-pvc.yml


apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: aws-efs
  namespace: airbnb
  labels:
    app: test-pvc
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 6Ki
  storageClassName: aws-efs
  
  
kubectl get pvc aws-efs -n airbnb
NAME      STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
aws-efs   Bound    pvc-43f6fe12-b9f3-400c-ba20-b357c1639f00   6Ki        RWX            aws-efs        4m44s
```

6. room pod application
```
kubectl apply -f deployment.yml
```
![pod with pvc](https://user-images.githubusercontent.com/38099203/119349966-bd9c6300-bcd9-11eb-9f6d-08e4a3ec82f0.PNG)


7. Create a file in the mounted path in pod A and check the file in pod B
```
NAME                              READY   STATUS    RESTARTS   AGE
efs-provisioner-f4f7b5d64-lt7rz   1/1     Running   0          14m
room-5df66d6674-n6b7n             1/1     Running   0          109s
room-5df66d6674-pl25l             1/1     Running   0          109s
siege                             1/1     Running   0          2d1h


kubectl exec -it pod/room-5df66d6674-n6b7n room -n airbnb -- /bin/sh
/ # cd /mnt/aws
/mnt/aws # touch intensive_course_work
```
![Create a file in a pod](https://user-images.githubusercontent.com/38099203/119372712-9736f180-bcf2-11eb-8e57-1d6e3f4273a5.PNG)

```
kubectl exec -it pod/room-5df66d6674-pl25l room -n airbnb -- /bin/sh
/ # cd /mnt/aws
/mnt/aws # ls -al
total 8
drwxrws--x    2 root     2000          6144 May 24 15:44 .
drwxr-xr-x    1 root     root            17 May 24 15:42 ..
-rw-r--r--    1 root     2000             0 May 24 15:44 intensive_course_work
```
![b Confirm file creation in pod](https://user-images.githubusercontent.com/38099203/119373196-204e2880-bcf3-11eb-88f0-a1e91a89088a.PNG)


- Config Map

1: Create cofingmap.yml file
```
kubectl apply -f cofingmap.yml


apiVersion: v1
kind: ConfigMap
metadata:
  name: airbnb-config
  namespace: airbnb
data:
  # 단일 key-value
  max_reservation_per_person: "10"
  ui_properties_file_name: "user-interface.properties"
```

2. Apply to deployment.yml

```
kubectl apply -f deployment.yml


.......
          env:
			# single key-value in cofingmap
            - name: MAX_RESERVATION_PER_PERSION
              valueFrom:
                configMapKeyRef:
                  name: airbnb-config
                  key: max_reservation_per_person
           - name: UI_PROPERTIES_FILE_NAME
              valueFrom:
                configMapKeyRef:
                  name: airbnb-config
                  key: ui_properties_file_name
          volumeMounts:
          - mountPath: "/mnt/aws"
            name: volume
      volumes:
        - name: volume
          persistentVolumeClaim:
            claimName: aws-efs
```


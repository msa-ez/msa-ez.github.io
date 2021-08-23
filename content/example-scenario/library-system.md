---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# library system

Source URL: https://github.com/msa-ez/example-library

It is a management system for a library for book rental, reservation, and so on.
- Checkpoint : https://workflowy.com/s/assessment-check-po/T5YrzcMewfo4J6LW

## Repository

5 total<br>
1. https://github.com/Juyounglee95/bookRental<br>
2. https://github.com/Juyounglee95/gateway<br>
3. https://github.com/Juyounglee95/bookManagement<br>
4. https://github.com/Juyounglee95/point<br>
5. https://github.com/Juyounglee95/view


## service scenario

### · Functional requirements
1. The administrator registers the book.
2. The user reserves the book.
3. Points are used to reserve books. 3-1. Points will be returned in case of cancellation of reservation.
4. The user returns the book.


### · Non-functional requirements
1. transaction
    1. If payment is not made, it cannot be rented. Sync call
2. fault isolation
    1. Even if the library management function is not performed, rental/reservation should be available 24 hours a day, 365 days a year Async (event-driven), Eventual Consistency
    2. When the payment system is overloaded, it induces users to pay after a while without receiving them for a while Circuit breaker, fallback
3. Performance
Users should be able to check the status of the entire book by checking the entire book list. CQRS


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
    
- Implementation
  - [DDD] Was the implementation developed to be mapped according to the color of each sticker and the hexagonal architecture in the analysis stage?
    - Have you developed a data access adapter through JPA by applying Entity Pattern and Repository Pattern?
    - [Hexagonal Architecture] In addition to the REST inbound adapter, is it possible to adapt the existing implementation to a new protocol without damaging the domain model by adding an inbound adapter such as gRPC?
    - Is the source code described using the ubiquitous language (terms used in the workplace) in the analysis stage?

  - Implementation of service-oriented architecture of Request-Response method
    - How did you find and call the target service in the Request-Response call between microservices? (Service Discovery, REST, FeignClient)
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
    - Contract Test: Is it possible to prevent implementation errors or API contract violations in advance through automated boundary testing?


## Analysis/Design

**[Eventstorming results modeled with MSAEz](http://msaez.io/#/storming/nZJ2QhwVc4NlVJPbtTkZ8x9jclF2/a77281d704710b0c2e6a823b6e6d973a)**
<h3>event derivation</h3>

![image](https://user-images.githubusercontent.com/18453570/79930892-9c3cc800-8484-11ea-9076-39259368f131.png)


<h3>Attaching actors and commands to be read easily</h3>

![image](https://user-images.githubusercontent.com/18453570/79931004-de660980-8484-11ea-9573-8cf3d8509e9e.png)

<h3>binding into aggregation</h3>

![image](https://user-images.githubusercontent.com/18453570/79931210-6ea44e80-8485-11ea-959b-2f500a9a7c1d.png)


<h3>Binding into Bounded Context</h3>

![image](https://user-images.githubusercontent.com/18453570/79931545-32bdb900-8486-11ea-8518-558b5cf02d77.png)

- Separation of domain sequence 
    - Core Domain: bookRental, bookManagement: Core service 
    - Supporting Domain: marketing, customer: Services to increase competitiveness
    - General Domain: point: It is highly competitive to use a 3rd party external service as a payment service (to be converted to pink later)


<h3>Attaching the policy</h3>

![image](https://user-images.githubusercontent.com/18453570/79933209-584cc180-848a-11ea-8289-c59468228c67.png)


<h3>Policy movement and context mapping (dashed lines are Pub/Sub, solid lines are Req/Resp)</h3>

![image](https://user-images.githubusercontent.com/18453570/79933604-76ff8800-848b-11ea-8092-bd7510bf5d0b.png)

- Add View Model

<h3>Validate that functional/non-functional requirements are covered</h3>

![image](https://user-images.githubusercontent.com/18453570/79933961-5f74cf00-848c-11ea-9870-cbd05b6348c5.png)

<Verification of functional requirements>

- The administrator registers the book. ok
- The user reserves the book. ok
- Points are used to reserve books. ok
- Points will be returned in case of cancellation of reservation. ok
- The user returns the book. ok
- User can cancel reservation (ok)
- If the reservation is canceled, the points are returned and the status of the book is changed to Canceled (ok)
- The user inquires the book status in the middle (addition of View-green sticker is ok)
- When a book is registered/reserved/cancelled/returned, the status of the book is changed and reflected in the entire book list. Both users and administrators can see this. ok



<h3>Verification of non-functional requirements</h3>

- Transaction processing for scenarios that cross microservices
    - Payment processing for book reservation: Request-Response method processing for point payment processing upon reservation completion
    - Book status change when payment is completed: Transaction is processed in Eventual Consistency method.
    - All other inter-microservice transactions: In most cases, the timing of data consistency is not critical, so Eventual Consistency is adopted as the default.


<h3>Hexagonal Architecture Diagram Derivation</h3>  

![image](https://user-images.githubusercontent.com/18453570/80059618-5f95cd00-8567-11ea-9855-6fdc2e51bfd0.png)

- Distinguish between inbound adapters and outbound adapters by referring to Chris Richardson, MSA Patterns
- Distinguish between PubSub and Req/Resp in the call relationship
- Separation of sub-domains and bounded contexts: Each team’s KPIs share their interest implementation stories as follows

## Implementation

According to the hexagonal architecture derived from the analysis/design phase, microservices represented by each BC are implemented with Spring Boot. The method to run each implemented service locally is as follows (each port number is 8081 ~ 808n) bookManagement/ bookRental/ gateway/ point/ view/

```
cd bookManagement
mvn spring-boot:run

cd bookRental
mvn spring-boot:run 

cd gateway
mvn spring-boot:run  

cd point
mvn spring-boot:run

cd view
mvn spring-boot:run
```

### · Application of DDD

- Declare the core Aggregate Root object derived within each service as Entity. In this case, the language used in the field (ubiquitous language) is used as it is.

```
package library;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.List;

@Entity
@Table(name="PointSystem_table")
public class PointSystem {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private Long bookId;
    private Long pointQty =(long)100;

    @PostPersist
    public void onPostPersist(){
        PointUsed pointUsed = new PointUsed(this);
        BeanUtils.copyProperties(this, pointUsed);
        pointUsed.publish();


    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Long getPointQty() {
        return pointQty;
    }

    public void setPointQty(Long pointQty) {
        this.pointQty = pointQty;
    }




}


```
- By applying Entity Pattern and Repository Pattern, RestRepository of Spring Data REST was applied to automatically create a data access adapter so that there is no separate processing for various data source types (RDB or NoSQL) through JPA.
```
package library;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface PointSystemRepository extends PagingAndSortingRepository<PointSystem, Long>{


}
```
- Testing of REST API after application
```
# bookManagement Service book registration processing
http POST http://52.231.116.117:8080/bookManageSystems bookName="JPA"

# bookRental Service reservation processing
http POST http://52.231.116.117:8080/bookRentalSystems/returned/1

# bookRental Service return processing
http POST http://52.231.116.117:8080/bookRentalSystems/reserve/1

# bookRental Service reservation cancellation processing
http POST http://52.231.116.117:8080/bookRentalSystems/reserveCanceled/1

# Check book status
http://52.231.116.117:8080/bookLists
```

### · Synchronous and asynchronous calls 

As one of the conditions in the analysis stage, the call between reservation (bookRental) -> payment (point) was decided to be processed as a transaction that maintains synchronous consistency. The calling protocol allows the REST service already exposed by the Rest Repository to be called using FeignClient.

- Implement service proxy interface (Proxy) using stub and (FeignClient) to call payment service 

```
# (app) pointSystemService.java

@FeignClient(name="point", url="http://52.231.116.117:8080")
public interface PointSystemService {

    @RequestMapping(method= RequestMethod.POST, path="/pointSystems", consumes = "application/json")
    public void usePoints(@RequestBody PointSystem pointSystem);

}

```

- Process to request payment immediately after receiving reservation (@PostPersist) -> Since creation of BookRental occurs immediately after registering a book in BookManageSystem, payment is processed after reservation is received as a Post request.

```
# BookRentalSystemController.java (Entity)

     @PostMapping("/bookRentalSystems/reserve/{id}")
     public void bookReserve(@PathVariable(value="id")Long id){
      PointSystem pointSystem = new PointSystem();
      pointSystem.setBookId(id);
      PointSystemService pointSystemService =  Application.applicationContext.
              getBean(library.external.PointSystemService.class);
      pointSystemService.usePoints(pointSystem);
  }
    }
```
After the payment is made, the act of notifying the book rental system is not synchronous, but asynchronous, so that the book status update is not blocked for the process of the book rental system.
 
- To this end, after leaving a record in the payment history, a domain event indicating that the payment has been approved is immediately sent to Kafka (Publish).

```

#PointSystem.Java (Entity)
{
 @PostPersist
    public void onPostPersist(){
        PointUsed pointUsed = new PointUsed(this);
        BeanUtils.copyProperties(this, pointUsed);
        pointUsed.publish();


    }
}
```
The listener of the book rental system receives the payment completion event and changes the status of the book to reserved.


```
(BookRentalSystem) PolicyHandler.JAVA
{
    @StreamListener(KafkaProcessor.INPUT) //When point payment is completed
    public void wheneverPointUsed_ChangeStatus(@Payload PointUsed pointUsed){
        try {
            if (pointUsed.isMe()) {
                System.out.println("##### point use completed : " + pointUsed.toJson());
                BookRentalSystem bookRentalSystem = bookRentalSystemRepository.findById(pointUsed.getBookId()).get();
                bookRentalSystem.setBookStatus("Reserved Complete");
                bookRentalSystemRepository.save(bookRentalSystem);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```

When the book status is changed, an event called Reserved is issued.

```
BookRentalSystem.java (Entity)

{
   @PostUpdate
    public void bookStatusUpdate(){

        if(this.getBookStatus().equals("Returned")){
            Returned returned = new Returned(this);
            BeanUtils.copyProperties(this, returned);
            returned.publish();

        }else if(this.getBookStatus().equals("Canceled")){

            ReservationCanceled reservationCanceled = new ReservationCanceled(this);
            BeanUtils.copyProperties(this, reservationCanceled);
            reservationCanceled.publish();
        }else if(this.getBookStatus().equals("Reserved Complete")){
            Reserved reserved = new Reserved(this);
            BeanUtils.copyProperties(this, reserved);
            reserved.publish();
        }

    }
    
}
```


Result: After the points are used, you can check the BookListView that the reservation has been completed and the status of the book has changed.

![image](https://user-images.githubusercontent.com/18453570/80061051-12b3f580-856b-11ea-989c-f4cf958613d5.png)




## operation

### · CI/CD settings


Each implementation was configured in their own source repository, the CI/CD platform used was azure, and the pipeline build script was included in azure-pipeline.yml under each project folder.

<h3>pipeline action result</h3>

In the image below, each service is uploaded to the azure pipeline so that it is automatically built/deployed whenever the code is updated.

![image](https://user-images.githubusercontent.com/18453570/79945720-6b22be80-84a9-11ea-8465-132806bc0f97.png)

As a result, you can see that the service is up on the kubernetes cluster as shown below.

![image](https://user-images.githubusercontent.com/18453570/79971771-c2d42080-84cf-11ea-9385-0896baf668a4.png)

Also, it can be seen that the functions operate normally.

**<Event fly>**

![image](https://user-images.githubusercontent.com/18453570/80060143-cb2c6a00-8568-11ea-934a-111ccd8c21c9.png)
![image](https://user-images.githubusercontent.com/18453570/80060146-ce275a80-8568-11ea-993a-9f206ed4e7e8.png)
![image](https://user-images.githubusercontent.com/18453570/80060149-d089b480-8568-11ea-83ef-8a2496163806.png)
![image](https://user-images.githubusercontent.com/18453570/80060153-d2537800-8568-11ea-8c01-0a4740373c4a.png)
![image](https://user-images.githubusercontent.com/18453570/80060164-d5e6ff00-8568-11ea-8f75-b8e735ba7e18.png)

**<Operation Result>**

![image](https://user-images.githubusercontent.com/18453570/80060261-15ade680-8569-11ea-8256-d28b1e7f1e67.png)


### · autoscale out


- Configure HPA to dynamically increase replica for point service. The setting increases the number of replicas to 10 when CPU usage exceeds 15%:
- Monitor how the autoscale is going


![image](https://user-images.githubusercontent.com/18453570/80059958-51947c00-8568-11ea-9567-1b7d69c7381f.png)

- After running the workload for 2 minutes, the test results are as follows.

![image](https://user-images.githubusercontent.com/18453570/80060025-8274b100-8568-11ea-8f60-fa428c62168c.png)


### · Uninterrupted redistribution

After the autoscaler setting and readiness was removed, load was applied. After that, I updated the code that removed Readiness and started deploying it as a new version. The result is as below. 

![image](https://user-images.githubusercontent.com/18453570/80060602-ec418a80-8569-11ea-87ea-34004c1ce5d3.png)
![image](https://user-images.githubusercontent.com/18453570/80060605-eea3e480-8569-11ea-9825-a375530f1953.png)


I put the Readiness setting again and put the load in.
And after deploying the new version, the result is as follows.



![image](https://user-images.githubusercontent.com/18453570/80060772-565a2f80-856a-11ea-9ee3-5d682099b899.png)
![image](https://user-images.githubusercontent.com/18453570/80060776-5823f300-856a-11ea-89a9-7c945ea05278.png)

Uninterrupted redistribution is confirmed to be successful because availability does not change during the distribution period.


---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Internet lecture system

![image](https://user-images.githubusercontent.com/48303857/79727114-d3956280-8326-11ea-8862-e01ca9a0f949.png)

source: https://github.com/msa-ez/example-academy

<h2> Final group assignment - Internet lecture system</h2>

- Checkpoint : https://workflowy.com/s/assessment-check-po/T5YrzcMewfo4J6LW

## service scenario

<h3>Udemy, Learning Portal</h3>

**Functional Requirements**<br>
1. The student selects a course and registers for the course<br>
2. The student pays<br> 
3. When the course registration is completed, the course registration details are transmitted to the instructor's lecture system<br>
4. The student cancels the course registration<br> 
5. Course registration If this is canceled, the payment will be canceled<br>
6. Instructor opens a course<br>
7. Instructor cancels an established course<br>
8. If the instructor cancels a course, the student's course registration is canceled<br>
9. The student inquires the course registration details<br>
10. Instructor inquires the number of lectures<br>


**Non-functional requirements**<br>
1. Transaction<br>
   - 1.  Course registration without payment should not be completed at all. Sync call<br>
1. Disability isolation<br>
   - 1. Course registration should be available 24 hours a day, 365 days a year even if the course management function is not performed Async (event-driven), Eventual Consistency<br>
   - 2. When the payment system is overloaded, it induces users to make payments after a while without receiving any payments Circuit breaker, fallback<br>
1. Performance<br>
   - 1. Students take course registration contents that can be checked in the course management Must be able to check in the application system (front-end) CQRS<br>

    


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
    - Self-Healing: Through the Liveness Probe, as the health status of any service continuously deteriorates, at what threshold can you prove that the pod is regenerated?
    - Can fault isolation and performance efficiency be improved through circuit breaker and ray limit?
    - Is it possible to set up an autoscaler (HPA) for scalable operation?
    - Monitoring, alerting:

  - Nonstop Operation CI/CD (10)
    - When the new version is fully serviceable through the setting of the Readiness Probe and rolling update, it is proved by siege that the service is converted to the new version of the service.
    - Contract Test: Is it possible to prevent implementation errors or API contract violations in advance through automated boundary testing?



## Analysis/Design

<h3> - TO-BE Organization (Vertically-Aligned)</h3>

### · Event Storming result
**[Eventstorming results modeled with MSAEz ](http://msaez.io/#/storming/RYTliHDEOOYT0NAZ6Xoodg4HP3H3/18a58ddb3072e7c25041a1c9361a9635)**


**Derivation of organization and requirements**
![image](https://user-images.githubusercontent.com/48303857/79729383-5cfa6400-832a-11ea-89b6-53eca4de1ab8.jpeg)

**Evoking events, attaching actor commands, aggregating, binding to bounded contexts**
![image](https://user-images.githubusercontent.com/48303857/79729452-74d1e800-832a-11ea-9b08-0d2807c69a28.jpeg)

- domain sequence separation 
    - Core Domain: Course registration (front), course management: This is a core service, and the annual up-time SLA level is set at 99.999%, and the distribution cycle is less than once a week for course registration and less than once a month for course management. 
    - Supporting Domain: Dashboard: This is a service for competitiveness, and the SLA level is 60% or more per year uptime goal, and the distribution cycle is autonomous by each team, but the standard sprint cycle is one week, so it is based on at least once a week. 
    - General Domain: Payment: It is highly competitive to use a 3rd party external service as a payment service (to be converted to pink later)


**Attach the polish**

![image](https://user-images.githubusercontent.com/48303857/79729649-b4003900-832a-11ea-875f-c0e8dfc6ccb4.jpeg)

**Policy movement and context mapping (Pub/Sub for Blue, Req/Resp for Orange)**

![image](https://user-images.githubusercontent.com/48303857/79729705-c67a7280-832a-11ea-828f-fc0cc5510e17.jpeg)

![image](https://user-images.githubusercontent.com/48303857/79729768-d72ae880-832a-11ea-9900-8e0e0e281d87.jpeg)

**Completed first model**

![image](https://user-images.githubusercontent.com/48303857/79729946-15c0a300-832b-11ea-8247-4e261f22690d.jpeg)

- Add View Model


**Verification that functional/non-functional requirements for the first complete version are covered**

- The student selects a course and registers for the course (ok)
- Students pay (ok -sync)
- When a course is registered, course registration details are transmitted to the instructor's lecture system (ok - event driven)
- The student cancels the course registration (ok)
- If the course registration is canceled, the payment will be canceled (ok)
- The instructor opens the lecture (ok)
- The instructor cancels the opened course (ok)
- If the instructor cancels the course, the student's course registration will be canceled (ok)
- The student inquires the course registration details (view)
- Instructor inquires the number of lectures (view)


**Modeled to cover requirements in a first-order model**

![image](https://user-images.githubusercontent.com/48303857/79814397-17d14300-83b9-11ea-8c7e-3517658dff13.png)


- Payment processing when registering for lectures: Since the service must provide the benefit of the instructor who provides the lecture, the request-response method is used for payment processing when registering for courses.
- The lecture management function has a strong aspect of providing services, and since several students register for courses at one time, the course management service is handled in Async (event-driven) and Eventual Consistency methods. .
- When the payment system is overloaded, it induces users to make payments after a while without receiving users for a while. Using a circuit breaker
- Students must be able to check the course registration details that can be checked in the course management in the course registration system (front-end) CQRS
- Inter-microservice transactions excluding payment: For all events, it is judged that the timing of data consistency is not critical for all events, so Eventual Consistency is adopted as the default.
   


### · Hexagonal Architecture Diagram Derivation
    
![image](https://user-images.githubusercontent.com/63028469/79846797-d3b26280-83f9-11ea-9ad7-a7e6b4bea18e.png)


- Distinguish between inbound adapter and outbound adapter by referring to Chris Richardson, MSA Patterns
- Distinguish between PubSub and Req/Resp in the call relationship
- Separation of sub-domains and bounded contexts: Each team's KPIs share their interest implementation stories as follows



## avatar

According to the hexagonal architecture derived from the analysis/design phase, microservices represented by each BC were implemented with Spring Boot. The method to run each implemented service locally is as follows (each port number is 8081 ~ 808n)

```
cd courseRegistrationSystem
mvn spring-boot:run

cd paymentSystem
mvn spring-boot:run 

cd lectureSystem
mvn spring-boot:run  
```

### · Application of DDD

- The core Aggregate Root object derived from each service is declared as an Entity: (Example: paymentSystem microservice). In this case, the language (ubiquitous language) used in the field was used as it is possible. Since the English language was completed during modeling, there was no significant hindrance to development as it is.

```
package skademy;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.List;

@Entity
@Table(name="PaymentSystem_table")
public class PaymentSystem {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private Long courseId;

    @PostPersist
    public void onPostPersist(){
        try {
            Thread.currentThread().sleep((long) (400 + Math.random() * 220));
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        PaymentCompleted paymentCompleted = new PaymentCompleted();
        BeanUtils.copyProperties(this, paymentCompleted);
        paymentCompleted.publish();
    }

    @PostRemove
    public void onPostRemove(){
        PaymentCanceled paymentCanceled = new PaymentCanceled();
        BeanUtils.copyProperties(this, paymentCanceled);
        paymentCanceled.publish();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
```
- By applying Entity Pattern and Repository Pattern, RestRepository of Spring Data REST was applied to automatically create a data access adapter so that there is no separate processing for various data source types (RDB) through JPA.
```
package skademy;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface PaymentSystemRepository extends PagingAndSortingRepository<PaymentSystem, Long>{
}
```
- Testing of REST API after application
```
# courseRegistrationSystem Service registration processing
http POST localhost:8081/courseRegistrationSystem lectureId=1
```
![image](https://user-images.githubusercontent.com/48303857/79857038-272bad00-8408-11ea-8096-7f54b482ea54.png)


```
# Check order status
http localhost:8081/courseRegistrationSystem
```
![image](https://user-images.githubusercontent.com/48303857/79857153-4d514d00-8408-11ea-83be-cf9e002c9ce5.png)



### · Synchronous Invocation and Fallback Handling

As one of the conditions in the analysis phase, the call between course registration (courseRegistrationSystem) -> payment (paymentSystem) was decided to be processed as a transaction that maintains synchronous consistency. The calling protocol allows the REST service already exposed by the Rest Repository to be called using FeignClient. 

- Implement service proxy interface (Proxy) using stub and (FeignClient) to call payment service  

```
# (courseRegistrationSystem) PaymentService.java

@FeignClient(name ="paymentSystems", url="http://52.231.118.204:8080")
public interface PaymentService {
    @RequestMapping(method = RequestMethod.POST, value = "/paymentSystems", consumes = "application/json")
    void makePayment(PaymentSystem paymentSystem);

}
```

- Process to request payment immediately after course registration (@PostPersist)
```
#CourseRegistrationSystem.java (Entity)

    @PostPersist
    public void onPostPersist(){
        CourseRegistered courseRegistered = new CourseRegistered();
        BeanUtils.copyProperties(this, courseRegistered);
        courseRegistered.publish();

        this.setLectureId(courseRegistered.getLectureId());
        this.setStudentId(12334);
        this.setStatus("Applying for courses");

        System.out.println("##### POST CourseRegistrationSystem Enrolment : " + this);

        //Following code causes dependency to external APIs
        // it is NOT A GOOD PRACTICE. instead, Event-Policy mapping is recommended.

        PaymentSystem paymentSystem = new PaymentSystem();
        paymentSystem.setCourseId(this.id);
        // mappings goes here

        //start payment
        PaymentService paymentService = Application.applicationContext.getBean(PaymentService.class);
        paymentService.makePayment(paymentSystem);

    }
```

- In synchronous calls, time coupling occurs with the time of the call, and confirming that if the payment system fails, the order is not taken:


```
# Put down paymentSystem for a while

#Course registration processing
http POST localhost:8081/courseRegistrationSystem lectureId=1   #Fail
http POST localhost:8081/courseRegistrationSystem lectureId=2   #Fail
```
![image](https://user-images.githubusercontent.com/48303857/79857341-9a352380-8408-11ea-908a-d776d192bb8e.png)

```
#Restart payment service
cd paymentSystem
mvn spring-boot:run

#Course registration processing
http POST localhost:8081/courseRegistrationSystem lectureId=1   #Success
http POST localhost:8081/courseRegistrationSystem lectureId=2   #Success
```
![image](https://user-images.githubusercontent.com/48303857/79857434-c05ac380-8408-11ea-88d4-8a6ce4af0100.png)


- In addition, service failures can occur like dominoes in case of excessive requests. (Circuit breaker and fallback processing will be explained in the operation phase.)



### · Asynchronous Invocation / Temporal Decoupling / Failure Isolation / Eventual Consistency Test


After the payment has been made, the act of notifying the course registration system is handled asynchronously, not synchronously, so that payment is not blocked in order to complete the course registration process.
 
- To this end, after leaving a record in the payment system, a domain event indicating that the payment has been completed is immediately sent to Kafka (Publish).
 
```
...
    @PostPersist
    public void onPostPersist(){
   
        PaymentCompleted paymentCompleted = new PaymentCompleted();
        BeanUtils.copyProperties(this, paymentCompleted);
        paymentCompleted.publish();
    }

```
- The course registration service implements PolicyHandler to receive the payment completion event and process its own policy.

```
public class PolicyHandler{
 ...
    
    @StreamListener(KafkaProcessor.INPUT)
    public void wheneverPaymentCompleted_EnrollmentComplete(@Payload PaymentCompleted paymentCompleted){
        try {
            if (paymentCompleted.isMe()) {
                System.out.println("##### listener EnrollmentComplete : " + paymentCompleted.toJson());
                Optional<CourseRegistrationSystem> courseRegistrationSystemOptional = courseRegistrationSystemRepository.findById(paymentCompleted.getCourseId());
                CourseRegistrationSystem courseRegistrationSystem = courseRegistrationSystemOptional.get();
                courseRegistrationSystem.setStatus("Payment finished");
                courseRegistrationSystem.setStudentId(courseRegistrationSystem.getStudentId());

                courseRegistrationSystemRepository.save(courseRegistrationSystem);
            }
        }catch(Exception e) {

        }
    }

```
Since the course system is completely separate from registration/payment and is processed according to the reception of events, there is no problem receiving course registration even if the course system is temporarily down due to maintenance:
```
# Put down the lecture service (lectureSystem) for a while

#Course registration processing
http POST localhost:8081/courseRegistrationSystem lectureId=1   #Success
http POST localhost:8081/courseRegistrationSystem lectureId=2   #Success
```
![image](https://user-images.githubusercontent.com/48303857/79857884-6d354080-8409-11ea-9307-02288463bb13.png)

```
#Check the event progress until the course registration is complete
```
![image](https://user-images.githubusercontent.com/48303857/79857914-79b99900-8409-11ea-8658-030267f42214.png)
```
#Lecture service start
cd lectureSystem
mvn spring-boot:run

# Check class attendance update
Check in the console window
```
![image](https://user-images.githubusercontent.com/48303857/79857956-8f2ec300-8409-11ea-98dd-2dd3667855b5.png)

## operation

### · CI/CD settings


Each implementation was configured in their own source repository, the CI/CD platform used was Azure, and the pipeline build script was included in azure-pipeline.yml under each project folder.

- A pipeline was constructed using devops, and CI CD automation was implemented.
![image](https://user-images.githubusercontent.com/18453570/79851343-2262fb00-8400-11ea-85e9-b4627f9a6d0d.png)

- It was confirmed that the pod was uploaded normally as shown below. 
![image](https://user-images.githubusercontent.com/18453570/79851342-21ca6480-8400-11ea-914a-e80e14ea93c7.png)

- You can see that they are all registered as services in Kubernetes as shown below.
![image](https://user-images.githubusercontent.com/18453570/79851335-20993780-8400-11ea-988b-33018c526631.png)


### · Synchronous Call / Circuit Breaking / Fault Isolation

* Choice of circuit breaking framework: Implemented using Spring FeignClient + Hystrix option

The scenario is implemented by linking the connection at courseRegistration-->payment with RESTful Request/Response, and if the payment request is excessive, fault isolation through CB.

- Set Hystrix: Set the CB circuit to close (fail and block requests quickly) when the processing time starts to exceed 610 millimeters in the request processing thread and is maintained for a certain amount.
```
# application.yml

hystrix:
  command:
    # Global settings
    default:
      execution.isolation.thread.timeoutInMilliseconds: 610

```

- Random load handling of the called service (payment) - fluctuates from 400 millimeters to 220 millimeters
```
# (paymentSystem) PaymentSystem.java (Entity)

    @PostPersist
    public void onPostPersist(){  //Save the payment history and drag the appropriate time

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
    - run for 120 seconds
    - Excessive request triggers CB Block request

![image](https://user-images.githubusercontent.com/63028499/79851238-01020f00-8400-11ea-85fb-409dd5f9bfd6.png)

* After some requests have been sent back, the previously delayed tasks have been processed, and the circuit is closed to start accepting requests again.
![image](https://user-images.githubusercontent.com/63028499/79851242-01020f00-8400-11ea-9cc9-fdd639a91ed8.png)

* After that, as this pattern continues to repeat, the system operates well without domino effects or runaway resource consumption.
![image](https://user-images.githubusercontent.com/63028499/79851236-ffd0e200-83ff-11ea-9941-3e6038bbc89f.png)

- The operating system does not die and shows that the resource is protected by properly opening and closing the circuit by CB continuously. However, since 66.62% of successes and 33.38% of failures are not good for customer usability, follow-up processing to expand the system through retry settings and dynamic scale out (automatic addition of replicas, HPA) is necessary.

- Confirm that availability is increased (siege)

**autoscale out**

Previously, CB made it possible to operate the system stably, but it did not accept 100% of the user's request.


- Configure HPA to dynamically increase replicas for payment services. The setting increases the number of replicas to 10 when CPU usage exceeds 15%:
```
kubectl autoscale deploy pay --min=1 --max=10 --cpu-percent=15
```
- Walk the workload for 2 minutes the way CB did.
```
siege -c100 -t120S -r10 --content-type "application/json" 'http://52.231.118.204:8080/courseRegistrationSystems POST {"lectureId": 1}'

```

- Monitor how autoscale is going:
```
kubectl get deploy pay -w
```
- After some time (about 30 seconds) you can see the scale out occurs:
![image](https://user-images.githubusercontent.com/63028499/79851254-02cbd280-8400-11ea-9c75-4d60ce42d54d.png)

- If you look at the log of siege, you can see that the overall success rate has increased.
![image](https://user-images.githubusercontent.com/63028499/79851251-02cbd280-8400-11ea-96e7-ea092375e77d.png)

### · Uninterrupted redistribution

* First, to check whether non-stop redistribution is 100%, the test is conducted in the presence of Readiness Probe and Autoscaler. As a result, it was confirmed that the uninterrupted redistribution was successful because the availability did not change during the distribution period at 100%.
![image](https://user-images.githubusercontent.com/18453570/79856578-79b89980-8407-11ea-9daf-697365e0a388.png)

* After that, the change in availability was confirmed by testing with readiness and autoscaler removed. As a result, it can be seen that it has dropped to the 20% range.
![image](https://user-images.githubusercontent.com/18453570/79856571-79200300-8407-11ea-84a9-946f3a2a076d.png)






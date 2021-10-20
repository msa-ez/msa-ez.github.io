---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Veterinary Practice Management System

Source: https://github.com/msa-ez/example-animal-hospital

<h3>Article 2 Task - Establishment of veterinary practice management system</h3>

This system is configured to cover all stages of analysis/design/implementation/operation including MSA/DDD/Event Storming/EDA.<br>This system contains answers to pass the Cloud Native Application Final Project performance test.

## service scenario

**Functional requirements**<br>
1. The customer makes reservations and cancellations of reservations at the veterinary hospital. <br>
2. Customers who have made a reservation receive treatment. <br>
3. Receipt bills the customer for medical expenses. <br>
4. The client pays for the treatment. <br>
5. If the reservation is changed/cancelled, the treatment/prescription is changed/cancelled. <br>
6. Whenever the reservation status changes, a notification is sent through KakaoTalk. <br>
7. The customer can inquire the reservation status in the Lookup system.<br>
<br><br>

**Non-functional requirements**<br>
1. Transaction
  - 1. Reservation should not be possible when medical treatment is not available. Sync call
2. Isolation of failure 
  - 1. If only the reservation/treatment system (core) is intact, the system should be performed normally. Async (event-driven), Eventual Consistency
  - 2.  Even if there is a failure in the text notification and treatment payment system, the reservation/treatment (core) system works normally.
  - 3. If the treatment system is overloaded, it induces reservations to be made after a while. Circuit breaker, fallback
3.  Performance
  - 1. The customer should be able to check the reservation/treatment/treatment result in the system
  - 2. implemented as a lookup system, CQRS You should be able to give notifications. (Event driven)


## Analysis/Design

**[Eventstorming results modeled with MSAEz](http://msaez.io/#/storming/0vtSW2vBLoZTFiAsgdwS6H7ODs33/2dac041f4e652d598a042694dfa26b20)**

- Core Domain: Reservation and Diagnosis domain
- Supporting Domain: Lookup (CQRS) domain
- General Domain: notice system.


### · Hexagonal Architecture Diagram Derivation
    
![image](https://user-images.githubusercontent.com/38850007/79833622-aad4a200-83e6-11ea-80f1-6eb9a59503af.png)


## Implementation

According to the hexagonal architecture derived from the analysis/design phase, microservices represented by each BC were implemented with Spring Boot. The method to run each implemented service locally is as follows (each port number is 8081 ~ 808n)

The veterinary hospital reservation/treatment system consists of the following 7 microservices.

1. Gateway: [https://github.com/AnimalHospital2/gateway.git](https://github.com/AnimalHospital2/gateway.git)
2. Oauth system: [https://github.com/AnimalHospital2/ouath.git](https://github.com/AnimalHospital2/ouath.git)
3. Reservation system: [https://github.com/AnimalHospital2/reservation.git](https://github.com/AnimalHospital2/reservation.git)
4. Medical system: [https://github.com/AnimalHospital2/diagnosis.git](https://github.com/AnimalHospital2/diagnosis.git)
5. Accommodation system: [https://github.com/AnimalHospital2/acceptance.git](https://github.com/AnimalHospital2/acceptance.git)
6. Notification system: [https://github.com/AnimalHospital2/notice.git](https://github.com/AnimalHospital2/notice.git)

- The gateway system changed the settings according to the project using the examples used in class.
- The Oauth system used the example used in class as it is.


All systems are implemented with Spring Boot and can be executed with the mvn `mvn spring-boot:run` command.

### · Application of DDD

- The core Aggregate Root object derived in each service is declared as Entity: (Example: Reservation.class of reservation system). At this time, I tried to use the language (ubiquitous language) used in the field as it is possible.

``` java
package com.example.reservation;

import com.example.reservation.external.MedicalRecord;
import com.example.reservation.external.MedicalRecordService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cloud.stream.messaging.Processor;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.util.MimeTypeUtils;

import javax.persistence.*;

@Entity
@Table(name = "RESERVATION")
public class Reservation {

    @Id
    @GeneratedValue
    private Long id;

    private String reservatorName;

    private String reservationDate;

    private String phoneNumber;

    @PostPersist
    public void publishReservationReservedEvent() {

        MedicalRecord medicalRecord = new MedicalRecord();

        medicalRecord.setReservationId(this.getId());
        medicalRecord.setDoctor("Brad pitt");
        medicalRecord.setMedicalOpinion("no more stars");
        medicalRecord.setTreatment("Just rest at home and you'll be fine.");

        ReservationApplication.applicationContext.getBean(MedicalRecordService.class).diagnosis(medicalRecord);


        // Reserved event occurs

        ObjectMapper objectMapper = new ObjectMapper();
        String json = null;

        try {
            json = objectMapper.writeValueAsString(new ReservationReserved(this));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON format exception", e);
        }

        Processor processor = ReservationApplication.applicationContext.getBean(Processor.class);
        MessageChannel outputChannel = processor.output();

        outputChannel.send(MessageBuilder
                .withPayload(json)
                .setHeader(MessageHeaders.CONTENT_TYPE, MimeTypeUtils.APPLICATION_JSON)
                .build());


    }

    @PostUpdate
    public void publishReservationChangedEvent() {
        ObjectMapper objectMapper = new ObjectMapper();
        String json = null;

        try {
            json = objectMapper.writeValueAsString(new ReservationChanged(this));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON format exception", e);
        }

        Processor processor = ReservationApplication.applicationContext.getBean(Processor.class);
        MessageChannel outputChannel = processor.output();

        outputChannel.send(MessageBuilder
                .withPayload(json)
                .setHeader(MessageHeaders.CONTENT_TYPE, MimeTypeUtils.APPLICATION_JSON)
                .build());
    }

    @PostRemove
    public void publishReservationCanceledEvent() {
        ObjectMapper objectMapper = new ObjectMapper();
        String json = null;

        try {
            json = objectMapper.writeValueAsString(new ReservationCanceled(this));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON format exception", e);
        }

        Processor processor = ReservationApplication.applicationContext.getBean(Processor.class);
        MessageChannel outputChannel = processor.output();

        outputChannel.send(MessageBuilder
                .withPayload(json)
                .setHeader(MessageHeaders.CONTENT_TYPE, MimeTypeUtils.APPLICATION_JSON)
                .build());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReservatorName() {
        return reservatorName;
    }

    public void setReservatorName(String reservatorName) {
        this.reservatorName = reservatorName;
    }

    public String getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(String reservationDate) {
        this.reservationDate = reservationDate;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}


```

- By applying Entity Pattern and Repository Pattern, RestRepository of Spring Data REST was applied to automatically create data access adapter so that there is no separate processing for various data source types (RDB or NoSQL) through JPA. H2 was used as RDB. 
``` java
package com.example.reservation;

import org.springframework.data.repository.CrudRepository;

public interface ReservationRepository extends CrudRepository<Reservation, Long> {
}

}
```
- Testing of REST API after application

caution!!! FeignClient is applied to the reservation service. Here, the diagnosis system's api address is hard-coded, so it is necessary to test with different values in the local test environment and in the cloud test environment.

Change the contents of package com.example.reservation.external.MedicalRecordService according to the test environment;



- When testing the local environment
``` java
@FeignClient(name = "diagnosis", url = "http://localhost:8083")
public interface MedicalRecordService {

    @RequestMapping(method = RequestMethod.POST, path = "/medicalRecords")
    public void diagnosis(@RequestBody MedicalRecord medicalRecord);
}
```

- Cloud environment testing
``` java
@FeignClient(name = "diagnosis", url = "http://diagnosis:8080")
public interface MedicalRecordService {

    @RequestMapping(method = RequestMethod.POST, path = "/medicalRecords")
    public void diagnosis(@RequestBody MedicalRecord medicalRecord);
}
```

The following commands are entered using the httpie program.
```
# Reservation of reservation service
http post localhost:8081/reservations reservatorName="Jackson" reservationDate="2020-04-30" phoneNumber="010-1234-5678"

# Cancellation of reservation service
http delete localhost:8081/reservations/1

# Change the reservation of the reservation service
http patch localhost:8081/reservations/1 reservationDate="2020-05-01"

# Check the list of medical records
http localhost:8083/medicalRecords
```

### · Synchronous Invocation and Fallback Handling

As one of the conditions in the analysis phase, the call between reservation->diagnosis was decided to be processed as a transaction that maintains synchronous consistency. The calling protocol allows the REST service already exposed by the Rest Repository to be called using FeignClient. 

- Implement service proxy interface (Proxy) using FeignClient to call medical service

```
# (app) Payment history Service.java
package com.example.reservation.external;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@FeignClient(name = "diagnosis", url = "http://diagnosis:8080")
  public interface MedicalRecordService {

    @RequestMapping(method = RequestMethod.POST, path = "/medicalRecords")
    public void diagnosis(@RequestBody MedicalRecord medicalRecord);
}

```

- Process to request diagnosis immediately after reservation completion (@PostPersist)
```
# Reservation.java (Entity)
    @PostPersist
       public void publishReservationReservedEvent() {
   
           // When an appointment is made, treatment proceeds immediately.
           MedicalRecord medicalRecord = new MedicalRecord();
   
           medicalRecord.setReservationId(this.getId());
           medicalRecord.setDoctor("Brad pitt");
           medicalRecord.setMedicalOpinion("There is nothing more than a star.");
           medicalRecord.setTreatment("Just rest at home and you'll be fine.");
   
           ReservationApplication.applicationContext.getBean(MedicalRecordService.class).diagnosis(medicalRecord);
   
   
           // Reserved event occurs
           ObjectMapper objectMapper = new ObjectMapper();
           String json = null;
   
           try {
               json = objectMapper.writeValueAsString(new ReservationReserved(this));
           } catch (JsonProcessingException e) {
               throw new RuntimeException("JSON format exception", e);
           }
   
           Processor processor = ReservationApplication.applicationContext.getBean(Processor.class);
           MessageChannel outputChannel = processor.output();
   
           outputChannel.send(MessageBuilder
                   .withPayload(json)
                   .setHeader(MessageHeaders.CONTENT_TYPE, MimeTypeUtils.APPLICATION_JSON)
                   .build());
```

- In a synchronous call, time coupling occurs according to the call time, and it is confirmed that a reservation cannot be received if the diagnostic system fails.

```
# Temporarily put down the diagnosis service (ctrl+c)

# Reservation processing
http post localhost:8081/reservations reservatorName="Jackson" reservationDate="2020-04-30" phoneNumber="010-1234-5678" #Fail

#Restarting medical services
cd diagnosis
mvn spring-boot:run

#Reservation processing
http post localhost:8081/reservations reservatorName="Jackson" reservationDate="2020-04-30" phoneNumber="010-1234-5678" #Success
```

### · Testing REST API after cluster application
- http://52.231.118.148:8080/medicalRecords/ //diagnosis inquiry
- http://52.231.118.148:8080/reservations/ //reservation inquiry
- http://52.231.118.148:8080/reservations reservatorName="pdc" reservationDate="202002" phoneNumber="0103701" //reservation request
- Delete http://52.231.118.148:8080/reservations/1 //reservation Cancel Sample
- http://52.231.118.148:8080/reservationStats/ //lookup
- http://52.231.118.148:8080/financialManagements/ //acceptance lookup

- Also, service failures can occur like dominoes when excessive reservation requests are made. (Circuit breaker and fallback processing will be explained in the operation phase.)

### · Asynchronous Invocation and Eventual Consistency


The act of notifying the receiving system after treatment is made is not synchronous, but asynchronous, so that the reservation/treatment system is not blocked for the processing of the receiving system.
 
- For this purpose, after leaving the medical history, the event that the medical treatment was done is immediately sent to Kafka (Publish).
 
```
// package Animal.Hospital.MedicalRecord;

    @PrePersist
    public void onPrePersist(){
        Treated treated = new Treated();
        BeanUtils.copyProperties(this, treated);
        treated.publish();
    }

```

- Acceptance service implements PolicyHandler to receive treatment completion event and process its own policy:

``` java
@Service
public class KafkaListener {

    @Autowired
    FinancialManagementRepository financialManagementRepository;

    @StreamListener(Processor.INPUT)

    public void TreatedEvent(@Payload Treated treated) {
        if(treated.getEventType().equals("Treated")) {
            System.out.println("A storage request has been made.");

            FinancialManagement financialManagement = new FinancialManagement();
            financialManagement.setReservationId(treated.getReservationId());
            financialManagement.setFee(10000L);
            financialManagementRepository.save(financialManagement);
        }
    }
}
```

Since the notification system cannot actually send text messages, System.out.println is processed for reservation/change/cancellation events.
  
``` java
package com.example.notice;

@Service
public class KafkaListener {
    @StreamListener(Processor.INPUT)
    public void onReservationReservedEvent(@Payload ReservationReserved reservationReserved) {
        if(reservationReserved.getEventType().equals("ReservationReserved")) {
            System.out.println("successfully booked.");
        }
    }

    @StreamListener(Processor.INPUT)
    public void onReservationChangedEvent(@Payload ReservationChanged reservationChanged) {
        if(reservationChanged.getEventType().equals("ReservationChanged")) {
            System.out.println("Reservation has been changed.");
        }
    }

    @StreamListener(Processor.INPUT)
    public void onReservationCanceledEvent(@Payload ReservationCanceled reservationCanceled) {
        if(reservationCanceled.getEventType().equals("ReservationCanceled")) {
            System.out.println("Reservation has been cancelled.");
        }
    }
}

```

The reception/lookup (CQRS) system is completely separated from the reservation/treatment and is processed according to the reception of the event, so there is no problem in making a reservation/treatment even if the reception/lookup system is temporarily down due to maintenance:
```
# put down acceptance for a while (ctrl+c)

#Reservation processing
http post localhost:8081/reservations reservatorName="Jackson" reservationDate="2020-04-30" phoneNumber="010-1234-5678" #Success

#Check reservation status
http localhost:8081/reservations     # Confirm that reservations have been added

#Start storage service
cd acceptance
mvn spring-boot:run

#Check storage status
http localhost:8085/financialManagements     # Confirm that you have been charged for all appointments - treatment. 
```
### · API Gateway
- In the local test environment, Gateway API works at localhost:8080.
- In the cloud environment, the Gateway API works at http://52.231.118.148:8080.
- Gateway configuration for each profile in application.yml file.


<h3>Gateway configuration file</h3>

```yaml
server:
  port: 8088

---
spring:
  profiles: default
  security:
    oauth2:
      resourceserver:
        jwt:
          jwk-set-uri: http://localhost:8088/.well-known/jwks.json
  cloud:
    gateway:
      routes:
        - id: reservation
          uri: http://localhost:8081
          predicates:
            - Path=/reservations/**
        - id: diagnosis
          uri: http://localhost:8083
          predicates:
            - Path=/medicalRecords/**
        - id: lookup
          uri: http://localhost:8084
          predicates:
            - Path=/reservationStats/**
        - id: acceptance
          uri: http://localhost:8085
          predicates:
            - Path=/financialManagements/**
        - id: oauth
          uri: http://localhost:8090
          predicates:
            - Path=/oauth/**
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


---
spring:
  profiles: docker
  security:
    oauth2:
      resourceserver:
        jwt:
          jwk-set-uri: http://localhost:8080/.well-known/jwks.json
  cloud:
    gateway:
      routes:
        - id: reservation
          uri: http://reservation:8080
          predicates:
            - Path=/reservations/**
        - id: diagnosis
          uri: http://diagnosis:8080
          predicates:
            - Path=/medicalRecords/**
        - id: lookup
          uri: http://lookup:8080
          predicates:
            - Path=/reservationStats/**
        - id: acceptance
          uri: http://acceptance:8080
          predicates:
            - Path=/financialManagements/**
        - id: oauth
          uri: http://oauth:8080
          predicates:
            - Path=/oauth/**
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

### · Application of Oauth authentication
- Oauth authentication applied. 
- But, just use the Oauth project used during class and attach it to the Gateway.

## operation

### · CI/CD settings

Each implementation is built through its own Git and is triggered by Git Master. The pipeline build script is included in azure_pipeline.yml under each project folder.

See azure_pipelist.yml

kubernetes service

```yaml
trigger:
- master

resources:
- repo: self

variables:
- group: common-value
  # containerRegistry: 'event.azurecr.io'
  # containerRegistryDockerConnection: 'acr'
  # environment: 'aks.default'
- name: imageRepository
  value: 'order'
- name: dockerfilePath
  value: '**/Dockerfile'
- name: tag
  value: '$(Build.BuildId)'
  # Agent VM image name
- name: vmImageName
  value: 'ubuntu-latest'
- name: MAVEN_CACHE_FOLDER
  value: $(Pipeline.Workspace)/.m2/repository
- name: MAVEN_OPTS
  value: '-Dmaven.repo.local=$(MAVEN_CACHE_FOLDER)'


stages:
- stage: Build
  displayName: Build stage
  jobs:
  - job: Build
    displayName: Build
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: CacheBeta@1
      inputs:
        key: 'maven | "$(Agent.OS)" | **/pom.xml'
        restoreKeys: |
           maven | "$(Agent.OS)"
           maven
        path: $(MAVEN_CACHE_FOLDER)
      displayName: Cache Maven local repo
    - task: Maven@3
      inputs:
        mavenPomFile: 'pom.xml'
        options: '-Dmaven.repo.local=$(MAVEN_CACHE_FOLDER)'
        javaHomeOption: 'JDKVersion'
        jdkVersionOption: '1.8'
        jdkArchitectureOption: 'x64'
        goals: 'package'
    - task: Docker@2
      inputs:
        containerRegistry: $(containerRegistryDockerConnection)
        repository: $(imageRepository)
        command: 'buildAndPush'
        Dockerfile: '**/Dockerfile'
        tags: |
          $(tag)

- stage: Deploy
  displayName: Deploy stage
  dependsOn: Build

  jobs:
  - deployment: Deploy
    displayName: Deploy
    pool:
      vmImage: $(vmImageName)
    environment: $(environment)
    strategy:
      runOnce:
        deploy:
          steps:
          - task: Kubernetes@1
            inputs:
              connectionType: 'Kubernetes Service Connection'
              namespace: 'default'
              command: 'apply'
              useConfigurationFile: true
              configurationType: 'inline'
              inline: |
                apiVersion: apps/v1
                kind: Deployment
                metadata:
                  name: $(imageRepository)
                  labels:
                    app: $(imageRepository)
                spec:
                  replicas: 1
                  selector:
                    matchLabels:
                      app: $(imageRepository)
                  template:
                    metadata:
                      labels:
                        app: $(imageRepository)
                    spec:
                      containers:
                        - name: $(imageRepository)
                          image: $(containerRegistry)/$(imageRepository):$(tag)
                          ports:
                            - containerPort: 8080
                          readinessProbe:
                            httpGet:
                              path: /actuator/health
                              port: 8080
                            initialDelaySeconds: 10
                            timeoutSeconds: 2
                            periodSeconds: 5
                            failureThreshold: 10
                          livenessProbe:
                            httpGet:
                              path: /actuator/health
                              port: 8080
                            initialDelaySeconds: 120
                            timeoutSeconds: 2
                            periodSeconds: 5
                            failureThreshold: 5
              secretType: 'dockerRegistry'
              containerRegistryType: 'Azure Container Registry'
          - task: Kubernetes@1
            inputs:
              connectionType: 'Kubernetes Service Connection'
              namespace: 'default'
              command: 'apply'
              useConfigurationFile: true
              configurationType: 'inline'
              inline: |
                apiVersion: v1
                kind: Service
                metadata:
                  name: $(imageRepository)
                  labels:
                    app: $(imageRepository)
                spec:
                  ports:
                    - port: 8080
                      targetPort: 8080
                  selector:
                    app: $(imageRepository)
              secretType: 'dockerRegistry'
              containerRegistryType: 'Azure Container Registry'
```


### · Synchronous Call / Circuit Breaking / Fault Isolation

- Choice of circuit breaking framework: Implemented using Spring FeignClient + Hystrix option

The scenario is implemented by linking the connection at reservation system-->diagnosis with RESTful Request/Response, and in case of excessive treatment request, fault isolation through CB.

- Set Hystrix: Set the CB circuit to close (fail and block requests quickly) when the processing time starts to exceed 610 millimeters in the request processing thread and is maintained for a certain amount.

```
# application.yml

server:
  port: 8081
spring:
  profiles: default
  cloud:
    stream:
      kafka:
        binder:
          brokers: localhost:9092
      bindings:
        output:
          destination: animal
          contentType: application/json
feign:
  hystrix:
    enabled: true
    
    

```

- Random load handling of the called service (diagnosis) - it fluctuates from 400 millimeters to 220 millimeters.
```
# (diagnosis) MedicalRecord.java (Entity)

    @PrePersist
    public void onPrePersist(){  //After saving the medical history, take the appropriate time delay.
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
$ siege -c100 -t60s -r10 --content-type "application/json" 'http://localhost:8081/reservations POST {"reservatorName": "Jackson", "phoneNumber": "01032713104", "reservationDate": "2020-05-01"}'

When running siege on Ubuntu running in Windows, "[error] unable to set close control sock.c:141: Invalid argument" occurs and the intermediate process is unknown. 

However, check the results as below.

Lifting the server siege...
Transactions:                   1067 hits
Availability:                  78.92 %
Elapsed time:                  59.46 secs
Data transferred:               0.37 MB
Response time:                  5.36 secs
Transaction rate:              17.94 trans/sec
Throughput:                     0.01 MB/sec
Concurrency:                   96.13
Successful transactions:        1067
Failed transactions:             285
Longest transaction:            7.01
Shortest transaction:           0.02

```
- The operating system does not die and shows that the resource is protected by properly opening and closing the circuit by CB continuously. 78.92% were successful.

### · autoscale out
Previously, CB made it possible to operate the system stably, but it did not accept 100% of the user's request. 

- Configure HPA to dynamically increase replicas for medical services. The setting increases the number of replicas to 10 when CPU usage exceeds 15%.

kubectl autoscale deploy diagnosis --min=1 --max=10 --cpu-percent=15

```
kubectl autoscale deploy diagnosis --min=1 --max=10 --cpu-percent=15
```



### · Uninterrupted redistribution
- Complete readiness probe and liveness probe setup for all projects.
```yaml
readinessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
  initialDelaySeconds: 10
  timeoutSeconds: 2
  periodSeconds: 5
  failureThreshold: 10
livenessProbe:
  httpGet:
     path: /actuator/health
     port: 8080
  initialDelaySeconds: 120
  timeoutSeconds: 2
  periodSeconds: 5
  failureThreshold: 5
```


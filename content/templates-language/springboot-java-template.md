---
description: ''
sidebar: 'started'
---
# Spring Boot/Java Template

<h2>By default, MSA-Easy generates source codes in Spring-boot and Spring-cloud template.</h2>

**In the Spring-boot template, we utilized following sub-frameworks and libraries for each adaptor and domain class implementations:**

- 1. Hibernate JPA for ORM, Entity Mapping
- 2. Spring Data REST for RESTful API Generation
- 3. Spring MVC for Command Mapping
- 4. Spring Cloud Stream for Event publishing and subscription (Event and Policy Mapping)
- 5. Hystrix for Circuit Breaker. 
- 6. FeignClient for API invocation.
- 7. Kafka as the default event stream platform. You can find the broker configuration in application.yaml
- 8. H2 DB as default database. you can change the database product by editing the application.yaml

<h3>The directory structure of the project being generated is as follows:</h3>

**order**

- README.md
- Dockerfile
- azure-pipelines.yml
- kubernetes
  - deployment.yml
  - service.yml
- src
  - main
    - java
      - shop
        - OrderApplication.java
        - config
          - kafka
            - kafkaProcessor.java
        - domain
          - Order.java
          - OrderPlaced.java
          - OrderCanceled.java
          - OrderAccepted.java
        - infra
          - AbstractEvent.java
          - OrderController.java
          - OrderHateoasProcessor.java
          - PolicyHandler.java
          - OrderRepository.java
  - resources
    - application.yml
- .gitignire
- pom.xml





## Customization

You may download the default Spring-boot template and customize it to fit in your needs.
This github link points to the repository of the template source code:  https://github.com/msa-ez/template-spring-boot-default

To learn how to customize the template, please see this document: 

https://intro.msaez.io/templates-language/custom-template/
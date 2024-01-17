---
description: ''
sidebar: 'started'
---

# Test Automation

## Unit Test Creation Topping(New)

### Scheme
A Topping that automatically creates code for unit test has been added.

![스크린샷 2023-11-06 오후 4 39 33](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/3569acfc-36bd-464e-8944-1bf2a0e589e7)

### Specification

You can apply Unit Test Topping from the Marketplace, and with this application, a 'test' folder is being added within the source of each microservices.

![스크린샷 2023-11-06 오후 4 52 24](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/ecb2ef37-e8cc-42cc-84f6-01e54179888d)

And the Test file is being created inside the test folder based on the name of the policy headed to the domain event.

![스크린샷 2023-11-06 오후 4 53 42](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/7cd50ed9-431d-4125-9800-d8f6a06b7e91)

Looking at the code, 'given' shows data such as inventory quantity and product ID for the entity, 'when' shows order information, and when the event is published, results based on the message received from 'then' are displayed.

From the perspective of designing a business, if an example is defined at the modeling stage, a test must be conducted to determine whether the business logic has been properly designed from the developer's perspective.

When the logic operates, an event is received through the policy handler and the domain logic operates upon receiving the event. The logic processes the event to update the actual data, and if the result is good, the test is completed normally.

Using unit tests in this way, events are published internally by the Spring framework and results can be received through the message collector, allowing self-testing locally without an actual Kafka server.

### Application

![스크린샷 2023-11-06 오후 4 58 00](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/0877f676-4085-4ffd-9832-ebb06dc56a5c)

When actually operating in Gitpod, the test code is contained in the inventory microservice folder, as seen in the code preview earlier.

![스크린샷 2023-11-06 오후 4 59 19](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/bd543df7-9616-4eb3-b96e-734acd80c923)

Open a terminal in the folder where you want to perform unit testing and enter the 'mvn test' command to verify the business logic.

## Open API 3.0-based Mock Server Generation Topping(New)

### Scheme
In order to enable parallel development even if the actual service for the dependency microservice is not installed in the interconnection between microservices, a topping that automatically creates development dependency that can be tested by creating a mock server and makes examples by Open API 3.0 has been added.

### Specification
![image](https://github.com/msa-ez/msaschool.github.io/assets/113568664/ffaa62b4-e480-4a18-8e2d-dd228744685c)

The specific role of "Local Microservice Development Dependencies" from the topping tab of Marketplace includes :

1. Automatically creates yml type OpenAPI 3.0 from the model.
2. Creates mock server by Microcks, the open source.
3. Creates api documentation.
4. Runs the Kafka server for asynchronous integration.

The advantages of Open API 3.0 is that with the addition of the example specification, you can create expected values for various inputs, and you can also directly create examples in the eventstorming model based on it.

Applying this topping creates an infra folder for each microservice, creates an openapi.yaml file within it, and runs docker-compose to automatically create and run dependencies along with the mock server.

### Application
![스크린샷 2023-10-31 오후 4 36 54](https://github.com/msa-ez/msaschool.github.io/assets/113568664/c8ab2295-4311-4b70-954c-4a63781febd4)

When you apply the "local-dep" topping taken from the marketplace to the code, you can see that an infra folder is created within the order microservice and an openapi.yaml file is created in the internal api folder. You can create your own mock server using the specifications written here.

![스크린샷 2023-10-31 오후 4 39 28](https://github.com/msa-ez/msaschool.github.io/assets/113568664/c7ee0127-a6d9-4591-9247-1e798ee40278)

When an order action is taken for each product through the example specified in the specification, a return value that decreases the inventory quantity is given.

![스크린샷 2023-10-31 오후 4 58 09](https://github.com/msa-ez/msaschool.github.io/assets/113568664/eb61ae67-423a-44b5-a643-5fdae703c57b)

A UI that allows you to input example data when setting a command api has been added, so you can edit the example result by directly entering it in the UI above.

Given, When, and Then refer to the data contained in the existing state of the aggregate, the called API, and the domain event published as a result. It is possible to receive the data values entered for testing and create them in the open API specifications.
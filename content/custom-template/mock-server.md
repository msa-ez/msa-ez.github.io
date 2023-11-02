---
description: ''
sidebar: 'started'
---
# Open API 3.0-based Mock Server Generation Topping(New)

## Scheme
In order to enable parallel development even if the actual service for the dependency microservice is not installed in the interconnection between microservices, a topping that automatically creates development dependency that can be tested by creating a mock server and makes examples by Open API 3.0 has been added.

## Specification
![image](https://github.com/msa-ez/msaschool.github.io/assets/113568664/ffaa62b4-e480-4a18-8e2d-dd228744685c)

The specific role of "Local Microservice Development Dependencies" from the topping tab of Marketplace includes :

1. Automatically creates yml type OpenAPI 3.0 from the model.
2. Creates mock server by Microcks, the open source.
3. Creates api documentation.
4. Runs the Kafka server for asynchronous integration.

The advantages of Open API 3.0 is that with the addition of the example specification, you can create expected values for various inputs, and you can also directly create examples in the eventstorming model based on it.

Applying this topping creates an infra folder for each microservice, creates an openapi.yaml file within it, and runs docker-compose to automatically create and run dependencies along with the mock server.

## Application
![스크린샷 2023-10-31 오후 4 36 54](https://github.com/msa-ez/msaschool.github.io/assets/113568664/c8ab2295-4311-4b70-954c-4a63781febd4)

When you apply the "local-dep" topping taken from the marketplace to the code, you can see that an infra folder is created within the order microservice and an openapi.yaml file is created in the internal api folder. You can create your own mock server using the specifications written here.

![스크린샷 2023-10-31 오후 4 39 28](https://github.com/msa-ez/msaschool.github.io/assets/113568664/c7ee0127-a6d9-4591-9247-1e798ee40278)

When an order action is taken for each product through the example specified in the specification, a return value that decreases the inventory quantity is given.

![스크린샷 2023-10-31 오후 4 58 09](https://github.com/msa-ez/msaschool.github.io/assets/113568664/eb61ae67-423a-44b5-a643-5fdae703c57b)

A UI that allows you to input example data when setting a command api has been added, so you can edit the example result by directly entering it in the UI above.

Given, When, and Then refer to the data contained in the existing state of the aggregate, the called API, and the domain event published as a result. It is possible to receive the data values entered for testing and create them in the open API specifications.
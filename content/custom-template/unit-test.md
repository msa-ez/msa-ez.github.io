---
description: ''
sidebar: 'started'
---
# Unit Test Creation Topping(New)

## Scheme
A Topping that automatically creates code for unit test has been added.

![스크린샷 2023-11-06 오후 4 39 33](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/3569acfc-36bd-464e-8944-1bf2a0e589e7)

## Specification

You can apply Unit Test Topping from the Marketplace, and with this application, a 'test' folder is being added within the source of each microservices.

![스크린샷 2023-11-06 오후 4 52 24](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/ecb2ef37-e8cc-42cc-84f6-01e54179888d)

And the Test file is being created inside the test folder based on the name of the policy headed to the domain event.

![스크린샷 2023-11-06 오후 4 53 42](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/7cd50ed9-431d-4125-9800-d8f6a06b7e91)

Looking at the code, 'given' shows data such as inventory quantity and product ID for the entity, 'when' shows order information, and when the event is published, results based on the message received from 'then' are displayed.

From the perspective of designing a business, if an example is defined at the modeling stage, a test must be conducted to determine whether the business logic has been properly designed from the developer's perspective.

When the logic operates, an event is received through the policy handler and the domain logic operates upon receiving the event. The logic processes the event to update the actual data, and if the result is good, the test is completed normally.

Using unit tests in this way, events are published internally by the Spring framework and results can be received through the message collector, allowing self-testing locally without an actual Kafka server.

## Application

![스크린샷 2023-11-06 오후 4 58 00](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/0877f676-4085-4ffd-9832-ebb06dc56a5c)

When actually operating in Gitpod, the test code is contained in the inventory microservice folder, as seen in the code preview earlier.

![스크린샷 2023-11-06 오후 4 59 19](https://github.com/msa-ez/msa-ez.github.io/assets/113568664/bd543df7-9616-4eb3-b96e-734acd80c923)

Open a terminal in the folder where you want to perform unit testing and enter the 'mvn test' command to verify the business logic.
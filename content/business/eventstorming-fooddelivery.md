---
description: ''
sidebar: 'started'
---

# Food Delivery Example


### Food Delivery Example

Make an eventstorming model based on the scenario to meet the following functional/non-fuctional requirements.
(Eventstorming Level: Design Level)

### Functional Requirements
- Customer selects menu and order it.
- Customer pay for the selected menu.
- Order information is being delivered to the storeowner when the order has been placed.
- Storeowner can accept or reject the order.
- Storeowner put in the status to the system when they starts and finishes cooking.
- Customer can cancel the order which cooking hasn't started yet.
- When the cooking is done, the delivery can be inquired by the riders close to the customer.
- After rider picks up the food, they notify to customer by app .
- Customer can inquire the order status anytime.
- Send a alarm by messenger whenever the order status is changed.
- Customer tabs on 'DevliveryConfirm' button when they recieve the food, and all transactions are completed.

### Non-functional Requirements

#### Disability Isolation
- Order must be received 365days and 24hours, even if the store managing function is not performed: Async (event-driven), Eventual Consistency
- If paying system is overloaded, stop receiving users and encourage them to make payments later: Circuit breaker, fallback

#### Performance
- Customer should be able to check the delivery status at order system(Front-end): CQRS
- Notification must be working whenever delivery status changes: Event driven

#### Bounded Contexts
1. front
2. store
3. rider
4. customer
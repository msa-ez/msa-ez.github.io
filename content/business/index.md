---
description: ''
sidebar: 'started'
---
# Shopping Mall Example

#### Pull out domain events from the next user scenario.

1. Customer orders selected product (Place an Order)
2. Deliver product when the order has been placed.
3. Stock of the product decreases when delivery is completed.

ex) OrderPlaced (past participles, object + verb pp)

#### Scenario Extension - Saga Compensation
1. Customer can cancel their order.
2. Whenever customer cancel an order, cook or delivery is canceled too.
3. Whenever delivery is collected, the stock increases.

##### Next scenario has been added
1. When the stock is secured (InventoryIncreased), send a mail to waiting customers.
2. Update order status when delivery status has been updated.

##### Next microservice has been added
1. Customer can inquire their order history and delivery status. (CQRS - View)
2. Send a message to the customer whenever the order/delivery status changes.

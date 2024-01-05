---
description: ''
sidebar: 'started'
---
# Eventstorming - Shopping Mall

Performing EventStorming based on the given Shopping Mall Scenario

## MSAEZ Modeling Tool Access
- Open the Chrome browser and go to https://www.msaez.io.
- Click on the avatar icon in the upper right corner and login with your Github account.
- Click on the first item, EventStorming, from the NEW menu.

![image](https://github.com/acmexii/demo/assets/35618409/d35919e8-3ff6-4a13-bccc-6935f4d87dbf)

## Basic Scenario - Order and Order Cancellation
- Customer selects a product and places an order.
- When an order is placed, the delivery of the product begins.
- Upon completion of delivery, the stock quantity of the product decreases.
- The customer can cancel an order.
- When an order is canceled, the delivery is canceled as well.
- When the delivery is picked up, the stock quantity increases.

## EventStorming

### Step 1: Events (Orange Color)
The first step of EventStorming involves attaching domain events based on the narrative (verbs).

From the scenario, we can extract the following domain events:

- Customer selects a product and places an order. -> OrderPlaced
- When an order is placed, the delivery of the product begins. -> DeliveryStarted
- Upon completion of delivery, the stock quantity of the product decreases. -> StockDecreased
Similarly, for the order cancellation process:

![image](https://github.com/acmexii/demo/assets/35618409/f5270052-f6e8-4f2d-82dc-f134ad8e11d6)

### Step 2. CCommands (Sky Blue) and Actors (Yellow)
Add commands (sky blue) and actors (yellow) that trigger domain events to the left of the event stickers.

- Label commands in the present tense, representing human interactions such as ordering and canceling an order.
- Identify personas and add actors to the left of commands.

![image](https://github.com/acmexii/demo/assets/35618409/05681759-4115-42f8-8710-ca0f8f2e1e91)

### Step 3. Policy (Lilac Color)
Add reactive tasks related to events as policies (domain policies) to the right of events.

- Describe tasks to be performed sequentially according to the event.
- For example, "When an order is placed, start the delivery" becomes a policy.
- The extracted policies for events are modeled as follows:

![image](https://github.com/acmexii/demo/assets/35618409/3221fabc-39d9-4d8b-ab0f-e14c4c1cb56e)

### Step 4. Aggregates (Yellow)
Add aggregates with appropriate names between commands and events, representing the repository that triggers domain state changes.

Name aggregates after the information repository of the respective service.

Model aggregates to overlap similar state change stickers.

![image](https://github.com/acmexii/demo/assets/35618409/6b66213a-f2de-48be-b3f2-5604507238bf)

### Step 5. Bounded Context
Group stickers by team or submodule to delineate boundaries.

Click on the 'dashed circle' icon in the palette to wrap stickers for each team.

The model with bounded contexts for each team looks like this:

![image](https://github.com/acmexii/demo/assets/35618409/eac4d230-0ec0-4afc-a414-39e4adbc85e3)

### Step 6. Context Mapping
Stickers attached to events represent policies, which are business processes of other teams that react to events.

- Move each policy to the bounded context of the owning department.
- Attach arrows from events to the moved policy stickers to establish context mapping.
- The model with applied context mapping looks like this:

![image](https://github.com/acmexii/demo/assets/35618409/a12fd84d-2a8c-4fc8-a4aa-ddf568b3de42)


---
description: ''
sidebar: 'started'
---

# PBCs(Packaged Business Capabilities) for Composable Enterprise Implementation

## Overview

<!-- 마이크로서비스 아키텍처에서 비즈니스 기능의 재사용과 효율적인 통합은 중요한 과제입니다. 특히 자주 사용되는 비즈니스 기능을 매번 새롭게 구현하는 것은 시간과 리소스의 낭비를 초래하는데, 이러한 문제를 해결하기 위해 Packaged Business Capabilities(PBC) 기능을 추가하였습니다. -->

**PBC** is a concept that packages specific business functions as independent modules and provides them, similar to a business function that can be assembled like a block.

**MSAEZ** adds a PBC marketplace to the domain-centered design modeling (event storming, Eventstorming) to make microservices more effectively composed and business logic more flexible. The selected PBC in the analysis/design phase is already provided in a completed state with completed business logic and UI implementation, allowing developers to build services by combining ready-to-use functional modules without additional coding.

This allows complex features such as notification systems, user review management, and payment processing to be implemented quickly and efficiently in a proven manner, achieving both improved development quality and operational efficiency.

## How to Perform
We will explain how to apply a complex payment processing feature using the **Payment PBC Application Example**. Specifically, we will detail the analysis/design and implementation methods for the case where the vehicle call service allows users to pay for completed rides based on the fare.

### Analysis/Design
![image](../../src/img/pbc/1.eventstorming.png)
<br>
![image](../../src/img/pbc/2.pbc.png)
<br>
1. Drag&Drop the PBC from the left palette of the event storming model canvas to select and apply the desired function from the existing PBC list provided by MSAEZ.
<br>(Since the payment system is needed, apply payment-system from the marketplace)

<br><br>
![image](../../src/img/pbc/3.pbc적용.png)
<br>
2. When the PBC draft named PaymentSystem appears at the bottom of the dispatch boundedContext, double-click the empty PBC model to open it.

<br><br>
![image](../../src/img/pbc/4.pbc설정.png)
<br>
3. In the PBC panel, you can select the ReadModel, Command, Event stickers related to the functions implemented in the PBC model, and select the stickers related to the functions used in the corresponding service.

<br><br>
![image](../../src/img/pbc/5.pbc모델.png)
<br>
4. Closing the PBC panel window shows that only the selected stickers are brought in, and the PBC model for PaymentSystem is completed as shown in the above image.

<br><br>
![image](../../src/img/pbc/6.pubsub.png)
<br>
5. Then, connect the relation to make communication possible between the existing microservices and the PBC, and update the payment status and payment ID information in the ride information after the payment is completed, and make it possible to view the receipt later.

<br><br>
![image](../../src/img/pbc/7.전체모델.png)
<br>
• Model showing payment system PBC applied to vehicle call service

### Implementation
![image](../../src/img/pbc/7.codeviewer.png)
<br>
1. When the code viewer is opened, a folder named PaymentSystem is created, and when you follow the instructions in the ReadMe file, the implementation level is also created.

<br><br>
![image](../../src/img/pbc/8.결제화면.png)
<br>
2. In the implemented UI, when you click the payment button at the bottom left, the payment detailed page opens, and when you click payment again, the payment UI provided by the PG company appears.

<br><br>
![image](../../src/img/pbc/9.영수증화면.png)
<br>
3. When the payment is completed, the paymentId and paymentStatus are registered, and when the receipt check button is created, when you click the receipt check button and enter the paymentId in the receipt check input, you can check the payment information.
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
<img src="https://github.com/user-attachments/assets/ca1c696d-5966-4e0f-96e7-b01290aa9580">
<br>
<img src="https://github.com/user-attachments/assets/37e2cf82-d288-4dc5-a15b-55eeaaab1cb8">
<br>
1. Drag&Drop the PBC from the left palette of the event storming model canvas to select and apply the desired function from the existing PBC list provided by MSAEZ.
<br>(Since the payment system is needed, apply payment-system from the marketplace)

<br><br>
<img src="https://github.com/user-attachments/assets/9488fafe-6a75-4d21-82bc-e2cbffe4b28f">
<br>
2. When the PBC draft named PaymentSystem appears at the bottom of the dispatch boundedContext, double-click the empty PBC model to open it.

<br><br>
<img src="https://github.com/user-attachments/assets/afa80621-332a-4091-83a5-db6a8e6c941f">
<br>
3. In the PBC panel, you can select the ReadModel, Command, Event stickers related to the functions implemented in the PBC model, and select the stickers related to the functions used in the corresponding service.

<br><br>
<img src="https://github.com/user-attachments/assets/a73d5064-99ac-42fa-9bde-a3985128ed8a">
<br>
4. Closing the PBC panel window shows that only the selected stickers are brought in, and the PBC model for PaymentSystem is completed as shown in the above image.

<br><br>
<img src="https://github.com/user-attachments/assets/21b45119-386c-4abe-9632-9a1106fb395c">
<br>
5. Then, connect the relation to make communication possible between the existing microservices and the PBC, and update the payment status and payment ID information in the ride information after the payment is completed, and make it possible to view the receipt later.

<br><br>
<img src="https://github.com/user-attachments/assets/17a1fdce-2bd4-4162-914c-5c1c6b2b1fed">
<br>
• Model showing payment system PBC applied to vehicle call service

### Implementation
<img src="https://github.com/user-attachments/assets/30785661-a184-429f-97a9-a07b6afbe6a7">
<br>
1. When the code viewer is opened, a folder named PaymentSystem is created, and when you follow the instructions in the ReadMe file, the implementation level is also created.

<br><br>
<img src="https://github.com/user-attachments/assets/67902de5-0f50-446c-b758-f04ae6e07779">
<br>
2. In the implemented UI, when you click the payment button at the bottom left, the payment detailed page opens, and when you click payment again, the payment UI provided by the PG company appears.

<br><br>
<img src="https://github.com/user-attachments/assets/0e1daf81-7f71-405d-b30d-693a52882ddc">
<br>
3. When the payment is completed, the paymentId and paymentStatus are registered, and when the receipt check button is created, when you click the receipt check button and enter the paymentId in the receipt check input, you can check the payment information.
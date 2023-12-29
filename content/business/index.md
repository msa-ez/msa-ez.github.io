---
description: ''
sidebar: 'started'
---
# 이벤트스토밍 - 쇼핑몰 예제

## Instruction

주어진 쇼핑몰 시나리오를 기반으로 이벤트스토밍을 수행합니다.

## MSAEZ 모델링 도구 접속
- 크롬 브라우저를 실행하고 https://www.msaez.io에 접속합니다.
- 우측 상단의 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 합니다.
- **NEW** 메뉴의 서브 메뉴 중, 첫번째 **EventStorming**을 클릭합니다.
![image](https://github.com/acmexii/demo/assets/35618409/d35919e8-3ff6-4a13-bccc-6935f4d87dbf)

## 기본 시나리오 - 주문 및 주문취소
- 고객(Customer)이 상품을 선택하여 주문한다(Place an Order).
- 주문이 되면 상품 배송을 시작한다.
- 배송이 완료되면 상품의 재고량이 감소한다.
- 고객이 주문을 취소할 수 있다(Customer can cancel order).
- 주문이 취소되면 배달이 취소된다(Whenever customer cancel an order, cook or delivery is canceled too).
- 6. 배달이 수거되면 재고량이 증가한다.

## 이벤트스토밍

### Step 1. Event(오렌지 색)
이벤트스토밍의 첫번째 단계는 도메인 이벤트를 붙임으로써 시작됩니다.

시나리오로부터 도메인 이벤트는 시나리오의 서술어(동사)를 기반으로 다음과 같이 추출 가능합니다.
- 고객(Customer)이 상품을 선택하여 주문한다. -> OrderPlaced(주문됨)

- 주문이 되면 상품 배송을 시작한다. -> DeliveryStarted(배송시작됨)

- 배송이 완료되면 상품의 재고량이 감소한다. -> StockDecreased(재고감소됨)

같은 맥락으로 주문취소 프로세스에 대해서도 이벤트를 도출하면 다음과 같습니다.

![image](https://github.com/acmexii/demo/assets/35618409/f5270052-f6e8-4f2d-82dc-f134ad8e11d6)

### Step 2. Command(하늘색)와 Actor(노란색)
도메인 이벤트를 야기시키는 커맨드(하늘색)와 액터(노란색)를 이벤트 스티커 왼쪽에 추가합니다.

- 커맨드는 이벤트의 현재형으로 휴먼 인터랙션인 주문하다(order), 주문취소하다(cancel order)와 같이 라벨링합니다.
- 그리고 페르소나를 식별해 액터를 커맨드 왼쪽에 추가합니다.

![image](https://github.com/acmexii/demo/assets/35618409/05681759-4115-42f8-8710-ca0f8f2e1e91)

### Step 3. Policy(라일락색)
이벤트에 대한 Reactive한 태스크를 Policy(도메인 정책)라고 하며, 이벤트 오른쪽에 추가합니다.

- 해당 이벤트에 따라 순연해서 벌어져야 하는 태스크를 스티커 라벨로 기술합니다.
- 이벤트가 ~할 때마다, 도메인 내에서 벌어져야 하는 업무를 지칭합니다.
- '주문이 되면 상품을 배송한다.' -> Whenever Orderplaced then start Delivery. -> 여기서 'start Delivery'가 폴리시가 됩니다.
- 이벤트에 대한 폴리시를 추출해 이를 모델링하면 다음과 같습니다.

![image](https://github.com/acmexii/demo/assets/35618409/3221fabc-39d9-4d8b-ab0f-e14c4c1cb56e)

### Step 4. Aggregate(노란색)
커맨드가 도메인 상태변화를 야기하는 저장소로 이벤트의 출처로써, 커맨드와 이벤트 사이에 적절한 이름으로 추가합니다.
- 주문(Order), 배송(Delivery), 상품(Product)의 이름으로 어그리게잇을 추가하면 다음과 같습니다.
- 네이밍은 해당 서비스의 정보 저장소를 일컫는 명사형으로 기술하면 됩니다.
- 어그리게잇 스티커는 유사한 상태 변화 스티커들에 걸쳐지도록 아래와 같이 모델링 합니다.

![image](https://github.com/acmexii/demo/assets/35618409/6b66213a-f2de-48be-b3f2-5604507238bf)

### Step 5. Bounded Context
서브모듈 단위, 또는 팀단위의 스티커들이 그룹핑이 되도록 경계를 구분합니다.

- 팔레트의 '점선 올가미' 아이콘을 클릭하여 각 팀별 스티커를 감싸도록 확장합니다.
- 각 팀별 Bounded Context가 적용된 모델은 다음과 같습니다.

![image](https://github.com/acmexii/demo/assets/35618409/eac4d230-0ec0-4afc-a414-39e4adbc85e3)

### Step 6. Context Mapping
이벤트에 부착된 폴리시 스티커는, 해당 이벤트에 리액티브하게 반응해야 하는 다른 팀의 업무 프로세스입니다.

- 각 폴리시를 소관부서(Owner)의 바운디드 컨텍스트로 위치 이동합니다.
- 이후, 초기 attach 되어 있던 이벤트와 릴레이션으로 매핑합니다.
- 도메인 이벤트를 클릭해 나타나는 화살표를 소관부서로 이동한 폴리시 스티커와 연결합니다.
- 컨텍스트 매핑이 적용된 모델은 다음과 같습니다.

![image](https://github.com/acmexii/demo/assets/35618409/a12fd84d-2a8c-4fc8-a4aa-ddf568b3de42)


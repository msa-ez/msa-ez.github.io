---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Data Projection with CQRS

주문서비스와 배송서비스의 상세 모델을 참조하여 Query 모델(Materialized View)을 설계한다.

## 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/labcqrs-231022](https://www.msaez.io/#/storming/labcqrs-231022)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 아래처럼 렙에 필요한 이벤트스토밍 기본 모델이 출력된다.
- 로딩된 모델은 우측 팔레트 영역에 스티커 목록이 나타나지 않는다. 상단 메뉴영역에서 포크 아이콘(FORK)을 클릭해 주어진 모델을 복제한다. 
![image](https://github.com/acmexii/demo/assets/35618409/c9a4575c-d8e2-424b-9587-7ca789dca2e1)
- 우측 팔레트 영역에 스티커 목록들이 나타나는 것이 확인된다.

## CQRS 모델링 

- 고객센터팀이 신설되어 '마이페이지' 서비스를 런칭한다고 가정한다.
- 주문서비스와 배송서비스의 상세 모델을 참조하여 Query 모델(Materialized View)을 설계한다.

### MODELING
- customercenter BC 를 추가
- Read Model 녹색 스티커 추가('MyPage')
- Read Model 속성 Define
> Long orderId 
> String productId
> String deliveryStatus
> String orderStatus

<img width="982" alt="image" src="https://user-images.githubusercontent.com/487999/191055790-5d6a529f-e2f7-49ab-8ee0-74d371f06090.png">

- Read Model CRUD 상세설계
<img width="434" alt="image" src="https://user-images.githubusercontent.com/487999/191056403-fbdec62b-42ea-4261-8e4e-b631c6c6779a.png">

### Code Preview 
- 상세 설계가 끝난 View Model 코드를 리뷰한다.
- 내 Github으로 Push 하고, GitPod 환경에 로딩한다.

### Complete Service codes
- 배송 마이크로서비스의 도메인 코드를 완성한다.
- Delivery.java > addToDeliveryList Port method
```
Delivery delivery = new Delivery();
delivery.setAddress(orderPlaced.getAddress());
delivery.setQuantity(orderPlaced.getQty());
delivery.setCustomerId(orderPlaced.getCustomerId());
repository().save(delivery);
```

- 고객 마이크로서비스의 MyPage.java의 Id 자동생성을 설정한다.
```
 @GeneratedValue(strategy=GenerationType.AUTO)  // 주석해제
```

### 마이크로서비스 실행
- 주문, 배송, 고객센터 마이크로서비스를 각각 실행한다.
```
mvn spring-boot:run
```
- customer-center 에 오류가 발생한다면 다음 ViewHandler.java 부분의 구현체를 확인: (findByOrderId --> findById)
```
    @StreamListener(KafkaProcessor.INPUT)
    public void whenDeliveryStarted_then_UPDATE_1(@Payload DeliveryStarted deliveryStarted) {
        try {
            if (!deliveryStarted.validate()) return;
                // view 객체 조회
            Optional<MyPage> myPageOptional = myPageRepository.findById(deliveryStarted.getOrderId());

            if( myPageOptional.isPresent()) {
                 MyPage myPage = myPageOptional.get();
            // view 객체에 이벤트의 eventDirectValue 를 set 함
                myPage.setDeliveryStatus("Started");    
                // view 레파지 토리에 save
                 myPageRepository.save(myPage);
                }


        }catch (Exception e){
            e.printStackTrace();
        }
    }

```
- 주문 1건을 등록한 후, MyPage 의 내용을 확인한다
```
http :8082/orders productId=1 qty=1
http :8085/myPages
```
- 배송서비스(8084)를 다운시킨 다음, MyPage 의 내용을 확인하여도 서비스가 안정적임을 확인한다. 
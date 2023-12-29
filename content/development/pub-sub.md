---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Pub/Sub 방식의 연동 

마이크로 서비스간의 통신에서 이벤트 메세지를 Pub/Sub 하는 방법을 실습한다.  
Order 서비스에서 주문(OrderPlaced) 이벤트가 발행 되였을때, Inventory 서비스에서 OrderPlaced 이벤트를 수신하여 재고량을 변경(감소)한다.  

### 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/labshoppubsub-2:2023-pubsub2](https://www.msaez.io/#/storming/labshoppubsub-2:2023-pubsub2)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 아래처럼 렙에 필요한 이벤트스토밍 기본 모델이 출력된다.   
![image](https://github.com/acmexii/demo/assets/35618409/39ccf71e-3977-4093-9bae-7c2a1254d710)


### order 서비스의 이벤트 Publish

메뉴의 CODE > ProjectIDE 를 선택하여, 연결된 브라우져 IDE를 로딩한다.

- order 마이크로 서비스를 실행한다.
> order 폴더를 선택 > Open In Terminal > 터미널에서 아래 커맨드를 실행한다.
> 주문 서비스가 8081 포트로 실행된다.
```
mvn spring-boot:run
```

- 기동된 order 서비스를 호출하여 주문 1건을 요청한다.
 ```
http localhost:8081/orders productId=1 productName=TV qty=3
```
- GitPod에서 새 터미널을 추가한다.
- kafka 유틸리티가 포함된 위치에 접속하기 위하여 docker 를 통하여 shell 에 진입한다:
```
cd kafka
docker-compose exec -it kafka /bin/bash
cd /bin
```

- kafka Consumer에서 이벤트 확인한다
``` 
./kafka-console-consumer --bootstrap-server localhost:9092 --topic labshoppubsub  --from-beginning
```


### Inventory 서비스의 이벤트 Subscribe
- Inventory PolicyHandler.java Code 확인한다.
- PolicyHandler.java --> Inventory.java (Aggregate) 의 Port Method (decreaseStock)을 호출하게 된다.
- decreaseStock 내에 우리가 작성해야 할 로직은 다음과 같다:

```
        
               
        repository().findById(Long.valueOf(orderPlaced.getProductId())).ifPresent(inventory->{
            
            inventory.setStock(inventory.getStock() - orderPlaced.getQty()); // do something
            repository().save(inventory);


         });
      
```

- inventory 서비스를 실행한다.
```
mvn spring-boot:run
```
- inventory 서비스가 8082 포트로 기동됨을 확인한다.
- OrderPlaced 이벤트에 반응하여 재고량이 감소되는 것을 확인한다:

```
http :8082/inventories id=1 stock=10
http :8081/orders productId=1 qty=5
http :8082/inventories/1
```
결과:
```
{
    "_links": {
        "inventory": {
            "href": "http://localhost:8082/inventories/1"
        },
        "self": {
            "href": "http://localhost:8082/inventories/1"
        }
    },
    "stock": 5
}
```


### 확장미션
- delivery Bounded Context 를 생성하고, 주문에 대하여 배송 1건을 추가하는 policy를 모델링하고 구현하시오.
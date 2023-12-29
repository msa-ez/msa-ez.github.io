---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Req/Res 방식의 MSA 연동 

모노리식 서비스에서 특정 부분을 마이크로서비스로 떼어내고, 모노리스와 마이크로서비스가 Req/Res 방식으로 상호 통신하는 예제를 가이드를 따라 수행한다. 

## 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/labshopmonolith-230822](https://www.msaez.io/#/storming/labshopmonolith-230822)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 아래처럼 렙에 필요한 이벤트스토밍 기본 모델이 출력된다.
- 로딩된 모델은 우측 팔레트 영역에 스티커 목록이 나타나지 않는다. 상단 메뉴영역에서 포크 아이콘(FORK)을 클릭해 주어진 모델을 복제한다. 
![image](https://github.com/acmexii/demo/assets/35618409/7950c0df-eee8-44e3-a79f-7448a4caa30e)
- 우측 팔레트 영역에 스티커 목록들이 나타나는 것이 확인된다.

### 기존 Monolith에서 일부 영역을 마이크로서비스로 분리

본 랩에 주어진 모델을 활용하여 가이드에 따라 모노리스에서 상품서비스를 분리하는 모델링을 수행한다. 

### 이벤트스토밍

- monolith 바운디드 컨텍스트를 주문 도메인 스티커에만 한정
- 새로운 bounded context를 추가하고 이름을 "inventory"로 설정
- inventory aggregate 객체들을 묶음 선택하여 inventory bounded context 내로 이동
<img width="874" alt="image" src="https://user-images.githubusercontent.com/487999/190896320-72973cf1-c1dc-44f4-a46a-9be87d072284.png">

- 재고량을 감소시키는 Command 의 추가: inventory BC 내에 Command  스티커를 추가하고, 아래 커맨드 이름을 복사하여 사용한다. 
```
decrease stock
```
- 이때 Command 스티커는 Inventory Aggregate 스티커의 왼쪽에 인접하게 부착한다.
- Command 의 설정:  "decrease stock" command 를 더블클릭한 후, Method Type을 'Extend Verb URI'를 선택하고 **Attribute로 type: Integer, name: qty를 추가**해 준다.
- 속성 추가후, 반드시 'Add Attribute'를 클릭하거나 엔터키로 설정을 확인한다. 
<img width="784" alt="image" src="https://user-images.githubusercontent.com/487999/190896393-30889e96-6cbc-4e7f-9631-25c0d004635d.png">

- 원격 호출선 연결:  monolith 내의 OrderPlaced Event 스티커와 inventory 의 decrease stock Command 스티커를 연결. 이때 Req/res 라는 표시가 나타남.
<img width="859" alt="image" src="https://user-images.githubusercontent.com/487999/190896427-f91962cd-f8ab-4113-bd85-5abe1ada3bcd.png">

## Code 생성 및 내 Git 리파지토리에 푸쉬 
- 모델링 메뉴의 'CODE' > 'Code Preview'를 클릭한다. 
- 상단의 'Push to Git' 메뉴를 클릭해 나타나는 다이얼로그 박스에서 'Create New Repository'를 선택하고, 'CREATE'를 누른다.
> 초기 Github 계정으로 로그인 하였으므로, 나의 Git 정보가 자동으로 표시된다. 
![image](https://github.com/acmexii/demo/assets/35618409/dcb1966e-e0d1-43f3-9920-457660923259)
- 모델 기반 코드가 내 Github에 푸쉬된다.
![image](https://github.com/acmexii/demo/assets/35618409/6581f400-adb8-4963-bf03-511d459c5e32)
- 좌측 메뉴 'IDE'를 누른다음, Cloud IDE 목록에서 'Open GitPod'를 클릭한다.

### 호출측 소스코드의 확인
- Cloud IDE상에 로딩된 코드 목록에서 아래 리소스를 찾아 본다.
- monolith/../ Order.java 의 @PostPersist 내에 호출을 위해 생성된 샘플코드를 확인한다:

```
@PostPersist
public void onPostPersist() {
    labshopmonolith.external.DecreaseStockCommand decreaseStockCommand = new labshopmonolith.external.DecreaseStockCommand();

  // 주문수량 정보를 커맨드 객체에 적재한다. 
    decreaseStockCommand.setQty(getQty()); 
    
  // InventoryService Proxy를 통해 커맨드 객체와 함께 원격호출 한다.
    MonolithApplication.applicationContext
        .getBean(labshopmonolith.external.InventoryService.class)
        .decreaseStock((Long.valueOf(getProductId())), decreaseStockCommand);
}
```
> 우리는 decreaseStock stub 메서드를 로컬 객체를 호출하는것처럼 호출하지만 실제적으로는 inventory 원격객체를 호출하는 결과가 될 것이다.
> 재고량 수정을 위하여 qty 값을 전달하는 Command 객체와 해당 제품 id 를 path 로 전달하는 첫번째 아규먼트로 productId를 전달한다.


- monolith/../ external 패키지 내에 생성된 FeignClient 관련 Stub 코드들을 참고한다 (InventoryService.java, DecreaseStockCommand.java, Inventory.java)
```
@FeignClient(name = "inventory", url = "${api.url.inventory}")
public interface InventoryService {
    @RequestMapping(
        method = RequestMethod.PUT,
        path = "/inventories/{id}/decreasestock"
    )
    public void decreaseStock(
        @PathVariable("id") Long id,
        @RequestBody DecreaseStockCommand decreaseStockCommand
    );

}
```
> FeignClient 는 실제로는 inventory 원격객체를 호출하는 proxy 객체를 생성할 것이다. application.yaml 의 api.url.inventory 설정값의 url 로 PUT 메서드를 해당 path 로 호출하는 원격 호출의 구현체가 채워진다. 

## 피호출측 소스코드의 확인과 구현
- inventory/.. /infra/InventoryController.java
```
public class InventoryController {

    @Autowired
    InventoryRepository inventoryRepository;

    @RequestMapping(value = "inventories/{id}/decreasestock", method = RequestMethod.PUT, produces = "application/json;charset=UTF-8")
    public Inventory decreaseStock(
        @PathVariable(value = "id") Long id,
        @RequestBody DecreaseStockCommand decreaseStockCommand,
        HttpServletRequest request,
        HttpServletResponse response
    ) throws Exception {
        System.out.println("##### /inventory/decreaseStock  called #####");
        Optional<Inventory> optionalInventory = inventoryRepository.findById(
            id
        );

        optionalInventory.orElseThrow(() -> new Exception("No Entity Found"));
        Inventory inventory = optionalInventory.get();
        inventory.decreaseStock(decreaseStockCommand);

        inventoryRepository.save(inventory);
        return inventory;
    }
}
```
> decreaseStock 에 대한 원격호출을 받을 수 있는 REST Service Mapping 이다.
> 호출을 받으면 Inventory 어그리거트의 decreaseStock 으로 전달하는 input adapter 역할을 한다(hexagonal architecture). 실제 비즈니스 로직 (재고량 감소)은 어그리거트 내부에서만 ubiquitous 언어로 구현되어야 한다.

- inventory/../Inventory.java 의 구현
```
    public void decreaseStock(DecreaseStockCommand decreaseStockCommand) {
        setStock(getStock() - decreaseStockCommand.getQty().longValue());  // Copy & Paste this code
    }
```

### Proxy 객체를 통한 동기호출 테스트

#### inventory 서비스의 테스트

- inventory 서비스를 기동시키고 httpie 툴을 통하여 서비스가 잘 호출되는지 테스트한다:
```
cd inventory
mvn spring-boot:run
```

- 인벤토리에 테스트할 상품을 먼저 등록하고 사전 검증한다.
```
http :8083/inventories id=1 stock=10
http PUT :8083/inventories/1/decreasestock qty=3
http :8083/inventories/1  # stock must be 7
```

#### monolith 를 통하여 inventory 동기호출

- monolith 를 기동시키고 실제 주문을 통하여 inventory 가 호출되는지 확인한다:

```
cd monolith
mvn spring-boot:run

#새 터미널
http :8082/orders productId=1 qty=5
http :8083/inventories/1  # stock must be 2
```

# 참고
1. 파일 다운로드 받기:  터미널 열고 > zip -r test.zip ./* 하신후, 생성된 test.zip 을 우클릭 다운로드
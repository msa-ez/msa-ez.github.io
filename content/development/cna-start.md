---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# 단위 마이크로 서비스의 실행 

### 마이크로서비스의 실행

스프링부트로 생성된 마이크로서비스를 컴파일하고 실행한다.

- CODE > Project IDE 를 선택하여 VS Code Online 을 실행한다.
- 왼편의 explorer 에서 monolith 폴더를 우클릭 선택한 후 "Open In Integrated Terminal" 을 클릭한다.
- Terminal 이 해당 폴더 이하에서 열리는 것을 확인한다.

### 생성된 서비스의 기동
터미널에서 mvn 으로 마이크로서비스 실행하는 방법
```
mvn spring-boot:run
```
<br>

- httpie tool 설치
```
pip install httpie
```
<br>

### 서비스 테스트
- 1번  상품 정보 (재고량)을 등록한다.

```
http POST localhost:8081/inventories id=1 stock=10
```
<br>

- 주문 1건을 요청한다.
```
http POST localhost:8081/orders productId=1 productName="TV" qty=3
```
<br>

- 재고량이 3개 감소한 것을 확인한다.
```
http :8081/inventories/1
```
<br>

- 주문된 상품을 조회한다.
```java
http GET localhost:8081/orders
```
<br>

- 주문된 상품을 수정한다.
```java
http PATCH localhost:8081/orders/1 qty=10
```
<br>

## 발생하는 오류 유형
1. Web server failed to start. Port 8081 was already in use.: 동일 포트넘버를 사용하는 다른 프로세스를 잡고 있는 서버가 존재. 해당 프로세스를 삭제 (터미널을 닫거나 Ctrl + C 혹은 fuser -k 포트넘버/tcp 명령)
1. No plugin found for prefix 'spring-boot'
: 현재 폴더에 pom.xml이 있는지 확인, 있다면, mvn spring-boot:run 명령의 오타확인
1. ConnectionError: HTTPConnectionPool(host='localhost', port=8081): Max retries
: 서버 자체가 안뜬 경우

### IDE에서 디버깅
1. Application.java 를 찾는다, main 함수를 찾는다.
2. main 함수내의 첫번째 소스코드 라인의 왼쪽에 동그란 breakpoint 를 찾아 활성화한다.
3. main 함수 위에 조그만 "Debug"라는 링크를 클릭한다.(10초 정도 소요, 기다리셔야 합니다.)
4. 잠시후 디버거가 활성화되고, 브레이크 포인트에 실행이 멈춘다.
5. Continue 라는 화살표 버튼을 클릭하여 디버거를 진행시킨다.
6. 다음으로, Order.java 의 첫번째 실행지점에 디버그 포인트를 설정한다:
```java
@PostPersist
    public void onPostPersist() {
        /// 이부분
    }
```
- 그런다음, 앞서 주문을 넣어본다.
```
http POST localhost:8081/inventories id=1 stock=10
http POST localhost:8081/orders productId=1 productName="TV" qty=3
```
- 위의 Order.java 에 디버거가 멈춤을 확인한후, variables 에서 local > this 객체의 내용을 확인한다.
<br>

### Order aggregate 확장
- Order.java에 다음필드를 추가:
```
    String address;
```
<br>

### 서비스를 재기동
- 추가된 필드를 입력해봄
```
http POST localhost:8081/orders productId=1 productName="TV" qty=3 address="my home"
```
<br>

### 실행중 프로세스 확인 및 삭제

```java
netstat -lntp | grep :808 
kill -9 <process id>
```
혹은
```
fuser -k 8081/tcp
```
<br>

#### 상세설명
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/J6yqEJrQUyk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>





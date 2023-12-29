---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# JWT Token 기반 인증 인가

마이크로서비스와 OAuth2 구성요소인 Authorization Server/ Client/ Resource Server를 활용해 Single Sign-On 구현 모형을 실습한다. 단일 접점인 Gateway가 Client가 되고, 각 마이크로서비스가 Resource Server에 해당된다. 그리고 Authorization Server로는 Keycloak을 활용한다. 본 랩에서는 Gateway가 Client와 Resource Server역할을 가진다.

## JWT기반 인증 w/ Keycloak

- OAuth2.0 기반의 Spring Security와 Resource Owner, Client, Authorization Server, Resource Server간의 인증/인가를 실습한다.
- JWT기반 Access_Token을 활용한다.
- 인증/인가 서버로 Keycloak(https://www.keycloak.org/) 서버를 활용한다.

## 이벤트스토밍 모델 준비

- 아래 모델을 새 탭에서 로딩한다.
[모델 링크 : https://www.msaez.io/#/storming/labshopoauthkeycloak-0821](https://www.msaez.io/#/storming/labshopoauthkeycloak-0821)
- 브라우져에 모델이 로딩되지 않으면, 우측 상단의 (사람모양) 아바타 아이콘을 클릭하여 **반드시** 깃헙(Github) 계정으로 로그인 후, 리로드 한다.
- 아래처럼 렙에 필요한 이벤트스토밍 기본 모델이 출력된다.
- 로딩된 모델은 우측 팔레트 영역에 스티커 목록이 나타나지 않는다. 상단 메뉴영역에서 포크 아이콘(FORK)을 클릭해 주어진 모델을 복제한다. 
![image](https://github.com/acmexii/demo/assets/35618409/08eb03f8-c7e3-42e8-a13c-4d473de56f1a)
- 우측 팔레트 영역에 스티커 목록들이 나타나는 것이 확인된다.


### Keycloak 토핑설정 및 코드 푸쉬

- 우측 상단의 "CODE" 버튼을 눌러 "TOPPINGS"를 클릭한다.
- 'Oauth by Keycloak'이 체크되어 있어야 한다.
- 상단의 'Push to Git' 메뉴를 클릭해 나타나는 다이얼로그 박스에서 'Create New Repository'를 선택하고, 'CREATE'를 누른다.
> 초기 Github 계정으로 로그인 하였으므로, 나의 Git 정보가 자동으로 표시된다. 
![image](https://github.com/acmexii/demo/assets/35618409/557f256e-9949-4546-bcde-d3d405f448df)
- 모델 기반 코드가 내 Github에 푸쉬된다.
![image](https://github.com/acmexii/demo/assets/35618409/6581f400-adb8-4963-bf03-511d459c5e32)
- 좌측 메뉴 'IDE'를 누른다음, Cloud IDE 목록에서 'Open GitPod'를 클릭한다.

 
### Keycloak Server 실행
 
- Cloud IDE 터미널에서 keycloak 폴더로 이동하여 컨테이너를 생성하고 및 Keycloak 서버를 실행한다.
```sh
cd keycloak
docker-compose up -d
```
- Keycloak이 사용하는 9090 포트가 목록에 나타난다.

#### Keycloak 서버 오픈 및 접속하기

- 오른쪽 하단의 포트 목록을 눌러 keycloak이 사용하는 9090 포트를 Public으로 오픈한다. (두번째 자물쇠)
![image](https://user-images.githubusercontent.com/35618409/215235038-8e362605-75b5-4271-923d-d2c0cd3fffbf.png)

- 첫 번째 아이콘을 클릭하여, KeyCloak의 풀 URL을 클립보드에 복사한다.
- Keycloak 마지막 브라우저 아이콘을 눌러, 웹 브라우저에서 접속해 보자.
- Administration Console을 클릭해 설정된 관리자 정보(admin / admin)로 로그인한다.
![image](https://user-images.githubusercontent.com/35618409/190956899-9c7efca3-04ac-4f11-851c-1e199debaa02.png)

- Keycloak 메인 화면이 아래와 같이 출력된다.
![image](https://user-images.githubusercontent.com/35618409/190957013-3a6669d9-0928-498b-9529-cbac6fad8cd5.png)


## OAuth Client 설정

### Keycloak 설정

- Master Realm에서 'Tokens' 탭을 눌러 Access Token Lifespan을 1시간으로 수정한다.
- 수정 후, 하단의 'Save' 를 눌러 저장한다.


### OAuth Client 설정
- Keycloak 서버의 왼쪽메뉴에서 Clients를 눌러 12stmall 을 추가한다.
![image](https://user-images.githubusercontent.com/35618409/190959198-145da6e6-f82d-412c-843c-9f5caf47c09e.png)
 
- 등록된 Client 설정에서 Access Type을 confidential로 설정한다.
![image](https://user-images.githubusercontent.com/35618409/190959505-5adf84bf-cda5-4cd9-ba90-e8c7d806a8dc.png)
 
- 아래에 있는 Valid Redirect URIs 설정에 다음과 같이 입력한다.
- 규칙 : Gateway Endpoint URL + /login/oauth2/code/ + ClientId(12stmall)
- 오른쪽 하단의 포트목록을 눌러 keycloak이 사용하는 9090 포트의 첫번째 URL 복사 아이콘을 클릭한다.
- GitPod에서는 이처럼 포트로 시작하는 도메인 정보로 노출된다. 이 9090을 게이트웨이 포트인 8088로 바꾸자.  
![image](https://user-images.githubusercontent.com/35618409/191009706-1033fa72-194b-4806-b9e7-33cffcffcf42.png)
- Valid Redirect URIs 정보는 이후 Gateway에도 추가한다.

- 저장 후, Credentials 탭을 확인하면 Secret(비밀번호)이 확인되는데 이는 이후 Gateway에도 추가한다.
![image](https://user-images.githubusercontent.com/35618409/190960454-9348d122-30d3-49b0-b63d-6389107a305e.png)
 

 
### Gateway Client 설정


- Keycloak Client설정에 필요한 아래 템플릿 환경정보를 설정한다.
- Gateway > applicaion.yml 8라인에 KeyCloak SSO 서버의 엔드포인트를 설정한다.
```
keycloak-client:
  server-url: https://9090-acmexii-labshopoauthkey-sgn5ady40al.ws-us94.gitpod.io
  realm: master
``` 
> server-url 값의 맨뒤에 / 가 없도록 주의한다.

- Spring OAuth2 Security 설정을 마무리한다.
```
  security:
    oauth2:
      client:
        provider:
          keycloak:
            issuer-uri: ${keycloak-client.server-url}/realms/${keycloak-client.realm}
            user-name-attribute: preferred_username
        registration:
          keycloak:
            client-id: "<client-id>"
            client-secret: 
            redirect-uri: "gateway-path/login/oauth2/code/client-name"
            authorization-grant-type: authorization_code
            scope: openid
      resourceserver:
        jwt:
          jwk-set-uri: ${keycloak-client.server-url}/realms/${keycloak-client.realm}/protocol/openid-connect/certs
```
> 51라인에 OAuth Client value인 12stmall 입력
> 52라인에 KeyCloakd에 생성된 client-secret 입력
> 53라인에 KeyCloakd에 설정한 redirect-uri 입력 

### Test User 생성
 
- Keycloak 서버의 왼쪽 메뉴에서 Manage > Users를 눌러 사용자를 등록한다.
![image](https://user-images.githubusercontent.com/35618409/190961205-3c69d45e-2705-4ba2-af18-edbff2f57bf4.png)
- user@naver.com 으로 저장한다.

- 등록한 사용자의 Credentials 탭에서 비밀번호를 설정하고, Temporary를 OFF로 한 다음 설정한다.
![image](https://user-images.githubusercontent.com/35618409/190961449-1acc3c93-f448-42be-8b6e-dd6f4c99ac20.png)


- 동일한 방식으로 admin@naver.com도 생성해 두자.

### Keycloak SSO Test

- Gateway와 마이크로서비스를  재시작한다.
```
cd gateway
mvn clean spring-boot:run
```
- 실행된 Gateway 서비스도 외부에서 접속이 가능하도록 GitPod에서 8088 Port를 오픈한다.
![image](https://user-images.githubusercontent.com/35618409/190962087-a82b9e08-0cde-4d28-8e10-05cd89c938ea.png)

- 마이크로서비스를 시작한다.
```
cd order
mvn clean spring-boot:run
```

- 다음의 오류 발생시, 새 터미널에서 kafka를 시작한다.
```
Broker may not be available.
2022-09-19 06:43:53.548  WARN [monolith,,,] 5204 --- [| adminclient-2] org.apache.kafka.clients.NetworkClient   : [AdminClient clientId=adminclient-2] Connection to node -1 (localhost/127.0.0.1:9092) could not be established. Broker may not be available.
```
```
cd kafka
docker-compose up -d
```

## Token based Authentication 테스트
- 크롬의 Secret 창 또는 다른 브라우저(Edge, 네이버웨일)에서 Gateway를 경유하는 Order서비스에 접속해 본다.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/orders
(Gateway URL need to be modified)
```
- 비인가된 Resource 접근으로 Keycloak SSO 로그인 창이 나타난다.
 ![image](https://user-images.githubusercontent.com/35618409/190966067-a39781e6-87bc-47e6-9688-eea7f7f7cd86.png)
 
 - 관리콘솔에서 등록한 사용자(user@naver.com / 1)로 인증한다.
 - 인증 성공 후, 주문서비스의 응답이 정상적으로 출력된다.
  

## Token based Authorization 테스트
- 특정 API를 권한을 가진 사용자만 접근할 수 있도록 권한(CUSTOMER, ADMIN)을 생성한다.
![image](https://user-images.githubusercontent.com/35618409/236124984-ce3f8568-bded-4bf8-b6cd-27baa11f0452.png)

- 생성된 사용자에 각각 Role을 매핑한다.
- User > admin@naver.com를 선택하고, Role Mappings를 클릭한다.
![image](https://user-images.githubusercontent.com/35618409/236125504-a42fb63f-8c95-450c-b275-036e815a0630.png)
- Realm Roles에 있는 ADMIN 권한을 Assign 한다.

- 마찬가지 방법으로 user@naver.com 사용자에게 CUSTOMER 권한을 Assign 한다.


### Order Resouces 권한 확인

- 브라우저에서 주문 리소스에 user@naver.com 사용자로 접속해 본다.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/orders/placeOrder
```

- 이어서, 주문관리 리소스에 접속해 본다.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/orders/manageOrder
```
user@naver.com의 권한으로는 접근이 불가능하여 정제되지 않은 403 오류가 리턴된다.
![image](https://user-images.githubusercontent.com/35618409/236128025-33798965-23ae-4922-87a0-32435b0a2597.png)


### 사용자 JWT Token 확인

- 다음 URL로 접속하여 사용자 토큰 정보를 확인하고 전체 토큰값을 복사한다. (아래 URL에서 내 Gateway 정보로 수정한다.)
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/test/token
```

- https://jwt.io/ 에 접속후 나타나는 Encoded Token에 복사한 토큰을 붙여넣는다.
![image](https://user-images.githubusercontent.com/35618409/236128936-454e2550-8c74-4dd2-b31f-39014ab856da.png)

- Decoded Token의 Payload에서 User Claim의 Role확인이 가능하다.
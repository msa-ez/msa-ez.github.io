---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# JWT Token-based Authorization - Advanced

### JWT Token-based Authorization w/ Keycloak 

#### OAuth2 Stackholders
- We are gonna use Spring Security and Spring oauth2, and practice the authorization between Resource Owner, Client, Authorization Server and Resource Server.
- Use JWT-based Access_Token.
- Use Standalone Keycloak(https://www.keycloak.org/) server for authorization server.

### Apply Keycloak SSO Topping
- Click Code > Code Preview to open window of model-based template codes.
- Click TOPPINGS at the upper-right side and apply Keycloak SSO.
![image](https://user-images.githubusercontent.com/35618409/190953029-6f27e3ec-2ad8-4101-b223-6ffe5675af48.png)

- As a result, the keycloak project and oauth2 settings for application.yml of Gateway has been added.
 ![image](https://user-images.githubusercontent.com/35618409/190953662-d6b127f8-b532-4cc8-aa42-5b64ea47842f.png)
 
 ### Access/Set Keycloak Server

#### Update Keycloak-applied Model Code

- Create and push eventstorming result code and update them.
- Merge main branch and template branch where the model code is pushed from Gitpod.
```
git pull && git merge origin/template
```

 #### Run Keycloak Server
 
 - Move to keycloak folder and create a container and run Keycloak Server.
```sh
cd keycloak
docker-compose up -d
# check
docker container ls 
```

 #### Open and access to Keycloak server
 - Open the port used by keycloak(9090) and click the lock icon.
![image](https://user-images.githubusercontent.com/35618409/190956537-056d6f0a-6b46-45c0-9df8-55d7a3cb7fc4.png)

- Click the Browser icon and get access to the web browser. 
- Click Administration Console and login with admin info(admin / admin).
![image](https://user-images.githubusercontent.com/35618409/190956899-9c7efca3-04ac-4f11-851c-1e199debaa02.png)

- The main page of Keycloak comes out.
![image](https://user-images.githubusercontent.com/35618409/190957013-3a6669d9-0928-498b-9529-cbac6fad8cd5.png)


### Setting security between Keycloak  Server and Client(Gateway)

- Click 'Tokens' at Master Realm and change Access Token Lifespan into 1 hour.
- Click 'save' below.
- Click Endpoints from Master Realm and open window for Endpoint.
![image](https://user-images.githubusercontent.com/35618409/190969570-2a75868c-2b68-44e1-b69c-2bfa4dcfe54b.png)

#### Register Issuer
- Register a value searched by issuer from Endpoint to Gateway application.yml(line 39).
![image](https://user-images.githubusercontent.com/35618409/190958542-d700f666-f889-49a9-8fde-62fc92267bdc.png)

#### Register jwk-uri
- Register a value searched by jwk from Endpoint to Gateway application.yml(line 50).
![image](https://user-images.githubusercontent.com/35618409/190958759-036c3ffd-8fba-42af-905e-a971291557ac.png)

#### Register OAuth Client
- Click Clients from left-side menu of Keycloak server and add 12stmall.
 ![image](https://user-images.githubusercontent.com/35618409/190959198-145da6e6-f82d-412c-843c-9f5caf47c09e.png)
 
 - Add Client id to client-id: of Gateway application.yml settings
 - Set Access Type confidential from the registered Client Settings.
 ![image](https://user-images.githubusercontent.com/35618409/190959505-5adf84bf-cda5-4cd9-ba90-e8c7d806a8dc.png)
 
 - Fill in Valid Redirect URIs settings below as followings:
 - Rules : Gateway Endpoint URL + /login/oauth2/code/ + Client ID(12stmall)
![image](https://user-images.githubusercontent.com/35618409/191009706-1033fa72-194b-4806-b9e7-33cffcffcf42.png)
 - Add the information of Valid Redirect URIs at redirect-uri: of Gateway application.yml settings.

- Secret would be set when you check the Credentials tab after saving, add this at client-secret: of Gateway application.yml settings.
![image](https://user-images.githubusercontent.com/35618409/190960454-9348d122-30d3-49b0-b63d-6389107a305e.png)
 
- Final settings for Application.yml
```
  security:
    oauth2:
      client:
        provider:
          keycloak:
            issuer-uri: https://9090-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/realms/master
            user-name-attribute: preferred_username
        registration:
          keycloak:
            client-id: 12stmall
            client-secret: 7cic1U8ZS7ZOGruyBNlPY0BHzeeUinXj
            redirect-uri: https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/login/oauth2/code/12stmall
            authorization-grant-type: authorization_code
            scope: openid
      resourceserver:
        jwt:
          jwk-set-uri: https://9090-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/realms/master/protocol/openid-connect/certs
```
 
 ### Register Test User
 
- Click Users from the left-side menu of Keycloak server and register the user.
![image](https://user-images.githubusercontent.com/35618409/190961205-3c69d45e-2705-4ba2-af18-edbff2f57bf4.png)
- Save: user@naver.com

- Set passwords at Credentials tab of registered user and set Temporary OFF.
![image](https://user-images.githubusercontent.com/35618409/190961449-1acc3c93-f448-42be-8b6e-dd6f4c99ac20.png)


### Keycloak SSO Test

- Restart Gateway and Microservices.
```
cd gateway
mvn spring-boot:run
```
- Open Liten Port of Gateway as well.
![image](https://user-images.githubusercontent.com/35618409/190962087-a82b9e08-0cde-4d28-8e10-05cd89c938ea.png)
-  Setting is also available at 'Remote Explorer' on the left.

- Run Microservice.
```
cd monolith
mvn spring-boot:run
```

- When this error occurs, run kafka.
```
Broker may not be available.
2022-09-19 06:43:53.548  WARN [monolith,,,] 5204 --- [| adminclient-2] org.apache.kafka.clients.NetworkClient   : [AdminClient clientId=adminclient-2] Connection to node -1 (localhost/127.0.0.1:9092) could not be established. Broker may not be available.
```
```
cd kafka
docker-compose up -d
```

- Access to Order microservice through Gateway on the new tab.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/orders
(Gateway URL need to be modified)
```
- Keycloak SSO login page comes out(Unauthorized Resource Access)
 ![image](https://user-images.githubusercontent.com/35618409/190966067-a39781e6-87bc-47e6-9688-eea7f7f7cd86.png)

 - Authorize with the user registered on managing console(user@naver.com / 1).
 - Response of Order service comes out properly after the authorization.
  
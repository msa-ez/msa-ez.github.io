---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# JWT Token-based Authentication and Authorization

In this hands-on exercise, we will implement Single Sign-On using microservices and the OAuth2 components: Authorization Server, Client, and Resource Server. The Gateway serves as the single entry point, acting as both the Client and Resource Server. We will utilize Keycloak as the Authorization Server.

## JWT-based Authentication with Keycloak

- We will practice OAuth2.0-based Spring Security with interactions between the Resource Owner, Client, Authorization Server, and Resource Server.
- JWT-based Access Tokens will be used.
- **[Keycloak](https://www.keycloak.org/)** will serve as the Authentication and Authorization Server.

## Event Storming Model Preparation


- Load the model from the following link in a new tab
**[Model Link](https://www.msaez.io/#/storming/labshopoauthkeycloak-0821)**
- If the model doesn't load in the browser, click the avatar icon in the upper right corner, log in with your **GitHub** account, and reload.
- Ensure the necessary Event Storming basic model is displayed in the right palette.
- Clone the loaded model by clicking the FORK icon in the top menu.

![image](https://github.com/acmexii/demo/assets/35618409/08eb03f8-c7e3-42e8-a13c-4d473de56f1a)

- Confirm that the stickers list appears in the right palette.


### Keycloak Topping Configuration and Code Push

- Click the **CODE** button in the upper right corner and select **TOPPINGS.**
- Make sure **Oauth by Keycloak** is checked.
- Click on the **Push to Git** menu in the top menu. In the dialog box that appears, select **Create New Repository** and click **CREATE**.

> Since you logged in with your **GitHub** account initially, your Git information is automatically displayed.
![image](https://github.com/acmexii/demo/assets/35618409/557f256e-9949-4546-bcde-d3d405f448df)
- The model-based code will be pushed to your GitHub.
![image](https://github.com/acmexii/demo/assets/35618409/6581f400-adb8-4963-bf03-511d459c5e32)
- Click on **IDE** in the left menu, then click **Open GitPod** from the Cloud IDE list.

 
### Run Keycloak Server
 
- Move to the keycloak folder in the Cloud IDE terminal, create the container, and start the Keycloak server.
```sh
cd keycloak
docker-compose up -d
```
- The Keycloak server's 9090 port should appear in the list.

#### Open and Connect to Keycloak Server

- Click the port list at the bottom right to open the 9090 port used by Keycloak (second lock icon).

![image](https://user-images.githubusercontent.com/35618409/215235038-8e362605-75b5-4271-923d-d2c0cd3fffbf.png)

- Click the first icon to copy the full URL of Keycloak to the clipboard.
- Open a web browser, paste the URL, and log in with the configured administrator information (admin / admin).

![image](https://user-images.githubusercontent.com/35618409/190956899-9c7efca3-04ac-4f11-851c-1e199debaa02.png)

- The Keycloak main screen should appear as shown below.

![image](https://user-images.githubusercontent.com/35618409/190957013-3a6669d9-0928-498b-9529-cbac6fad8cd5.png)


## OAuth Client Configuration

### Keycloak Configuration

- In the Master Realm, click on the **Tokens** tab and set the Access Token Lifespan to 1 hour.
- After modification, click **Save** at the bottom.


### OAuth Client Configuration
- In the Keycloak server**s left menu, click on Clients and add a new client named **12stmall.**
![image](https://user-images.githubusercontent.com/35618409/190959198-145da6e6-f82d-412c-843c-9f5caf47c09e.png)
 
- Set the Access Type of the registered client to **confidential.**
![image](https://user-images.githubusercontent.com/35618409/190959505-5adf84bf-cda5-4cd9-ba90-e8c7d806a8dc.png)
 
- In the Valid Redirect URIs settings below, enter the following:
- Rule: Gateway Endpoint URL + /login/oauth2/code/ + ClientId(12stmall)
- Click the copy icon of the first URL of the 9090 port at the bottom right (replace 9090 with the Gateway port, 8088, in GitPod). 
![image](https://user-images.githubusercontent.com/35618409/191009706-1033fa72-194b-4806-b9e7-33cffcffcf42.png)
- Add the Valid Redirect URIs information to the Gateway later.
- After saving, check the Credentials tab. The Secret (password) will be used in the Gateway.
![image](https://user-images.githubusercontent.com/35618409/190960454-9348d122-30d3-49b0-b63d-6389107a305e.png)
 

 
### Gateway Client Configuration


- Set the required template environment information for Keycloak Client configuration.
- In the Gateway's applicaion.yml, set the KeyCloak SSO server's endpoint.
```
keycloak-client:
  server-url: https://9090-acmexii-labshopoauthkey-sgn5ady40al.ws-us94.gitpod.io
  realm: master
``` 
> Be careful not to have a trailing slash in the server-url value.

- Complete the Spring OAuth2 Security configuration.
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
            client-id: **<client-id>**
            client-secret: 
            redirect-uri: **gateway-path/login/oauth2/code/client-name**
            authorization-grant-type: authorization_code
            scope: openid
      resourceserver:
        jwt:
          jwk-set-uri: ${keycloak-client.server-url}/realms/${keycloak-client.realm}/protocol/openid-connect/certs
```
> Enter **12stmall** as the OAuth Client value on line 51.
> Input the client-secret generated in KeyCloak on line 52.
> Provide the redirect-uri configured in KeyCloak on line 53.

### Test User Creation
 
- In the Keycloak server, go to **Manage** > **Users** and create a new user (e.g., user@naver.com).

![image](https://user-images.githubusercontent.com/35618409/190961205-3c69d45e-2705-4ba2-af18-edbff2f57bf4.png)

- Set a password for the user and disable the temporary status.

![image](https://user-images.githubusercontent.com/35618409/190961449-1acc3c93-f448-42be-8b6e-dd6f4c99ac20.png)

- Create another user, e.g., admin@naver.com, using the same process.

### Keycloak SSO Test

- Restart the Gateway and microservices.
```
cd gateway
mvn clean spring-boot:run
```
- Open the Gateway service for external access (click on the **Ports** and select the first URL).

![image](https://user-images.githubusercontent.com/35618409/190962087-a82b9e08-0cde-4d28-8e10-05cd89c938ea.png)

- Start the microservices (e.g., order service).
```
cd order
mvn clean spring-boot:run
```

- If an error occurs, start Kafka in a new terminal.
```
Broker may not be available.
2022-09-19 06:43:53.548  WARN [monolith,,,] 5204 --- [| adminclient-2] org.apache.kafka.clients.NetworkClient   : [AdminClient clientId=adminclient-2] Connection to node -1 (localhost/127.0.0.1:9092) could not be established. Broker may not be available.
```
```
cd kafka
docker-compose up -d
```

## Token-based Authentication Test
- Access the Order resource through the Gateway URL.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/orders
(Gateway URL need to be modified)
```
- Since it's an unauthorized resource, the Keycloak SSO login window will appear.


 ![image](https://user-images.githubusercontent.com/35618409/190966067-a39781e6-87bc-47e6-9688-eea7f7f7cd86.png)
 
 - Authenticate with the previously created user (user@naver.com / 1).
 - After successful authentication, the response from the order service will be displayed.
  

## Token-based Authorization Test
- Create roles (CUSTOMER, ADMIN) to restrict access to specific APIs.

![image](https://user-images.githubusercontent.com/35618409/236124984-ce3f8568-bded-4bf8-b6cd-27baa11f0452.png)

- Map roles to the created users.
- For the user admin@naver.com, assign the ADMIN role.

![image](https://user-images.githubusercontent.com/35618409/236125504-a42fb63f-8c95-450c-b275-036e815a0630.png)
- Similarly, assign the CUSTOMER role to the user user@naver.com.


### Check Order Resources Authorization

- Try accessing the Order resource with the user@naver.com user.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/orders/placeOrder
```

- Then, try accessing the order management resource.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/orders/manageOrder
```
Access will be denied for the user@naver.com account with insufficient privileges, resulting in a **403 error**.

### User JWT Token Verification

- Access the following URL to check user token information and copy the full token.
```
https://8088-acmexii-labshopmonolith-orw1glcgvae.ws-us65.gitpod.io/test/token
```

- Open https://jwt.io/, paste the copied token into the Encoded Token section.

![image](https://user-images.githubusercontent.com/35618409/236128936-454e2550-8c74-4dd2-b31f-39014ab856da.png)

- Verify the Role claim in the User Claim section of the decoded token**s payload.
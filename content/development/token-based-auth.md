---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# JWT Token-based Authorization

### JWT Token-based Authorization w/ Keycloak

#### OAuth2 Stackholders
- Use Spring Security and Spring oauth2, and practice the authorization between Resource Owner, Client, Authorization Server and Resource Server.
- Resource here means the Rest APIs which transfer the Gateway.
- Use JWT-based Access_Token.
- In this lab, set Gateway in the role of Client & Resource Server.
- Use Standalone Keycloak(https://www.keycloak.org/) server for authorization server.


#### Set OAuth2 Authorization(Keycloak) Endpoint

Move to the directory of this example:
```
 cd token-based-auth-Keycloak/
```

- Open application.yml file of Gateway service.
- The Endpoint of Authorization Server for authorization would be registered.
```yaml
  security:
    oauth2:
      client:
        provider:
          my-keycloak-provider:
            issuer-uri: http://localhost:8080/realms/my_realm
```

- The Credential informations(client-id, client-secret) of the Client(Gateway) registered on KeyCloak is set.
- Set the Grant Type of OAuth2 into password type.
```yaml
  keycloak-spring-gateway-client:
    provider: my-keycloak-provider
    client-id: my_client
    client-secret: HKFKYP7kb8OMldAgfvnk27FhRPOv8Y7H
    authorization-grant-type: password
```

#### Detail Settings for OAuth2 Security
- Open SecurityConfig.java file of Gateway service.
- spring-cloud-gateway runs by webflux: apply @EnableWebFluxSecurity
- Describe Access Control List(ACL) for each resources at ServerHttpSecurity.
- Default login settings of .oauth2Login() OAuth2 would be applied.
- Give the role of .oauth2ResourceServer() and designate the jwt-type Authorization. 


#### Run the Service

- First, run Keycloak Server.
```sh
cd keycloak/bin
chmod 744 kc.sh
./kc.sh start-dev
```

- It runs on the default port of keycloak server, 8080.

- Run Gateway & Order service.
```sh
cd gateway
mvn spring-boot:run
cd order
mvn spring-boot:run
```
- It runs on port 8088 and 8081.


#### Get Access to Protected Resources
- Get access to Gateway server and order service by following Security ACL Settings(SecurityConfig.java).
```sh
http http://localhost:8088
http http://localhost:8088/orders
```
- 401(Unauthorized)a ccess eroor comes out because we don't have JWT access-token.

- Get access to the authorized resource. (gateway > TestController.java)
```sh
http http://localhost:8088/test/permitAll
```
- It's accessible. 


#### Issue JWT access_token

- Request a token to Autorization Endpoint of Keycloak.
- Submit the user information and Client credential which is already registered at Keycloak by OAuth2's 'password' Grant type.
> 'password' Grant type은 Client(Gateway)의 로그인 Form으로 제출받은 사용자 정보를 인증서버에 Posting하는 방식이다.
> The 'password' Grant type is the way of Posting user information submitted by login form to the authorizing server.
```sh
curl -X POST "http://localhost:8080/realms/my_realm/protocol/openid-connect/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "grant_type=password" \
--data-urlencode "client_id=my_client" \
--data-urlencode "client_secret=HKFKYP7kb8OMldAgfvnk27FhRPOv8Y7H" \
--data-urlencode "username=user@uengine.org" \
--data-urlencode "password=1" 
```

- access_token & refresh_token comes out for the response.
- Copy the access_token and access to https://jwt.io/ then decode it.
> It is being parsed by Header, Payload and Signature.
- Check if the Role of user@uengine.org is ROLE_USER.


#### Get Access to Protected Resources with access_token
- Copy the access_token and put it in Request Header to and get access to Protected Resource.
```sh
export access_token=[ACCESS_TOKEN]
echo $access_token
http localhost:8088/orders "Authorization: Bearer $access_token"
http localhost:8088/test/user "Authorization: Bearer $access_token"
http localhost:8088/test/authenticated "Authorization: Bearer $access_token"
http localhost:8088/test/admin "Authorization: Bearer $access_token"
```

- '/test/admin' resource is forbidden(403), so cannot be acced.
- Request token once again with the account that has manager authority.

```sh
curl -X POST "http://localhost:8080/realms/my_realm/protocol/openid-connect/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "grant_type=password" \
--data-urlencode "client_id=my_client" \
--data-urlencode "client_secret=HKFKYP7kb8OMldAgfvnk27FhRPOv8Y7H" \
--data-urlencode "username=admin@uengine.org" \
--data-urlencode "password=1" 
``` 

- Copy the access_token and put it in Request Header to and get access to Protected Resource.
```sh
export access_token=[ACCESS_TOKEN]
http localhost:8088/test/admin "Authorization: Bearer $access_token"
```

- Now it is accesible.


#### Wrap up
- Gateway is taking the role of resource server, so the Gateway manages Fine grained access control of each microservice resources.
- ACL information wouldn't be legible or there could be potential conflict.
- We recommend you to separate authorizations to disperse the responsibility of Autonomous ACL for each MSA.
- Gateway is in charge of Coarse grained ACL Policy including authorization, and applies Fine grained ACL Policy on each MSA.


#### Service Clear
- Kill all running servers for next lab.

```
fuser -k 8080/tcp
fuser -k 8081/tcp
fuser -k 8088/tcp
```

#### Details
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/dsUW_JTvqIA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
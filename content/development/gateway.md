---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# API Gateway

### EventStorming Model Preparation

- Open the model in a new tab using the link :
[Model Link](https://www.msaez.io/#/storming/lab-shop-gateway)
- If the model doesn't load, click on the avatar icon (person shape) in the upper right, log in with your **Github** account, and then reload.
- Verify that the model, as needed for the level, is displayed.

![image](https://github.com/acmexii/demo/assets/35618409/39ccf71e-3977-4093-9bae-7c2a1254d710)


### Unification of Microservices Endpoints using API Gateway

- Select CODE > ProjectIDE from the menu to load the connected browser IDE.
- Install the http client in the terminal and run Kafka locally with containerization.
```
pip install httpie
cd infra
docker-compose up
```

- Run the monolith microservice.
```
cd monolith
mvn spring-boot:run
```

- Run the gateway microservice.
```
cd gateway
mvn spring-boot:run
```

- Request an order by calling the running monolith service.
```
  http localhost:8081/orders productId=1 qty=3
  http localhost:8081/orders
```
    
- Use the gateway to execute the same URL with a changed port.
```
 http localhost:8088/orders productId=1 qty=1
 http localhost:8081/orders  # can find the order item here
 http localhost:8088/orders  # can find the order item here also
```
  
- Run the inventory microservice.
- Add the following configuration to the spring.cloud.gateway.routes in the application.yaml of the gateway service for routing to the inventory service. (Be careful with indentation)
```yaml
      - id: inventory
        uri: http://localhost:8082
        predicates:
          - Path=/inventories/** 
```

- Restart the gateway service.
- Call the service on port 8082 to check and use the gateway to call the service.
```
http localhost:8082/inventories
http localhost:8088/inventories
```

### Customizing the Gateway
https://www.baeldung.com/spring-cloud-custom-gateway-filters
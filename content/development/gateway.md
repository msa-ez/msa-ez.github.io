---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# API Gateway

### Endpoint Unification of Microservices by using API Gateway

- Run monolith microservice.
```
cd monolith
mvn spring-boot:run
```

- Run gateway microservice.
```
cd gateway
mvn spring-boot:run
```

- Request an order by calling monolith service.
```
  http localhost:8081/orders productId=1 qty=3
  http localhost:8081/orders
```
    
- Run the same url in different port through gateway.
```
 http localhost:8088/orders productId=1 qty=1
 http localhost:8081/orders  # can find the order item here
 http localhost:8088/orders  # can find the order item here also
```
  
- Run inventory microservice.
- Add routing to inventory service by adding the settings below at spring.cloud.gateway.routes of application.yaml from gateway service. (be aware of indent)
```yaml
      - id: inventory
        uri: http://localhost:8082
        predicates:
          - Path=/inventories/** 
```

- Re-run gateway service.
- Call the service on port 8082, then call the service through gateway.
```
http localhost:8082/inventories
http localhost:8088/inventories
```

### The Way of Customizing Gateway
https://www.baeldung.com/spring-cloud-custom-gateway-filters
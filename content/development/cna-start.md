---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Running Microservice Units

## Compiling & Running Service 
Compile & run SpringBoot-based Microservice
- Run IDE Tool :  Eventstorming Tool > CODE > Click Project IDE
- Right click on the monolith folder(single service) from the explorer on the left side, and then click on "Open in Integrated Terminal"
- Check if the terminal is opened from the folder.

### Running the created service

##### How to run Microservice by mvn on terminal

```java
mvn spring-boot:run
```

- Install httpie tool

```java
pip install httpie
```


###  Service Test 
- Register product no.1's information(stock)
```
http POST localhost:8081/inventories id=1 stock=10
```

-  Request an order.
```java
http POST localhost:8081/orders productId=1 productName="TV" qty=3
```
- Check if the stock has decreased by 3.
```
http :8081/inventories/1
```

- Inquire the ordered product.
```java
http GET localhost:8081/orders
```
- Edit informations of the ordered product.
```java
http PATCH localhost:8081/orders/1 qty=10
```


###  Debugging on IDE
 
 1. Find Application.java and find the main function.
 2. Find and activate a round breakpoint on the left side of the first source line of main function. 
 3. Click a small link above the main function(wait for about 10 seconds).
 4. Soon, the debugger activates and it stops on the breakpoint.
 5. Click on the arrow button 'Continue' and proceed the debugger.
 6. Next, set the debug point at the first execution point of Order.java :
```java
@PostPersist
    public void onPostPersist(){
        OrderPlaced orderPlaced = new OrderPlaced(this);  // this point
        orderPlaced.publishAfterCommit();
    }
```
1. Next, place a previous order.
2. After checking if the debugger stops at Order.java, check the content of the object 'local > this' from the variables.

### Expand Order aggregate
Add the following field on Order.java :
```
    String address;
```
Right click on the variable 'address' > Source Action > Generate Setters/Getters.
Check if the setter/getter has been created as below.
```
    String address;
 
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

```
Re-run the service.

- Register the fields you added.
```
http POST localhost:8081/orders productId=1 productName="TV" qty=3 address="my home"
```

### Check & Delete the Running Process

```java
netstat -lntp | grep :808 
kill -9 <process id>
```
or
```java
fuser -k 8081/tcp
```


#### for more specifics :
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/J6yqEJrQUyk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
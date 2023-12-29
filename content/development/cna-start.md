---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Running Unit Microservices


We will practice compiling and running Spring Boot to execute unit microservices. 

The generated applications provide RESTful services, and we will use the httpie tool to make calls to these services. 

We'll explore the operational structure using a debugger and extend the service by adding attributes to aggregate objects and database properties.

## EventStorming Model Preparation

- Open the model in a new tab using the link below:
[Model Link : https://www.msaez.io/#/storming/7b59c53f12e372251cc3c83da8b2fd09](https://www.msaez.io/#/storming/7b59c53f12e372251cc3c83da8b2fd09)
- If the model doesn't load, click on the avatar icon (person shape) in the upper right, log in with your Github account, and then reload.
- Verify that the model, as needed for the level, is displayed. 
![image](https://github.com/acmexii/demo/assets/35618409/277a434c-c6fa-49aa-a05e-3a7249865ca4)

## Running Microservices

Compile and run the microservices created with Spring Boot.

- Select CODE > ProjectIDE from the menu to run the connected browser IDE.
- In the browser IDE, right-click on the monolith folder in the left explorer and click on "Open In Integrated Terminal."
- Confirm that the terminal opens in the subfolder.

### Starting the Created Services
Run the microservices in the terminal using mvn.
```
mvn spring-boot:run
```
<br>

- Install the httpie tool.
```
pip install httpie
```
<br>

### Service Testing
- 1번  Register product information (stock of 10).

```
http POST localhost:8081/inventories id=1 stock=10
```
<br>

- Place an order for 3 items.
```
http POST localhost:8081/orders productId=1 productName="TV" qty=3
```
<br>

- Verify that the stock decreased by 3.
```
http :8081/inventories/1
```
<br>

- View the ordered product.
```java
http GET localhost:8081/orders
```
<br>

- Modify the ordered product.
```java
http PATCH localhost:8081/orders/1 qty=10
```
<br>

## Types of Occurring Errors
1. Web server failed to start. Port 8081 was already in use: Another process is using the same port number. Terminate the process holding the port (close the terminal or use Ctrl + C or the command fuser -k portNumber/tcp).
1. No plugin found for prefix 'spring-boot': Check if there is a pom.xml in the current folder. If yes, check for typos in the mvn spring-boot:run command.
1. ConnectionError: HTTPConnectionPool(host='localhost', port=8081): Max retries: The server itself is not running.

### Debugging in IDE
1. Find Application.java and locate the main function.
2. Activate the circular breakpoint on the left of the first line of source code in the main function.
3. Click on the link "Debug" above the main function (takes about 10 seconds, please wait).
4. Once the debugger is active and stops at the breakpoint, click the "Continue" arrow button.
5. Next, set a debug point in Order.java at the first execution point:
6. Then, debug the point by placing an order:
```java
@PostPersist
    public void onPostPersist() {
        /// Add this part
    }
```
```
http POST localhost:8081/inventories id=1 stock=10
http POST localhost:8081/orders productId=1 productName="TV" qty=3
```
- After confirming that the debugger is paused, check the contents of variables under local > this object.
<br>

### Extending Order Aggregate
- Add the following field to Order.java:
```
    String address;
```
<br>

### Restart the Service
- Restart the service with the added field.
```
http POST localhost:8081/orders productId=1 productName="TV" qty=3 address="my home"
```
<br>

### Checking and Killing Running Processes

```java
netstat -lntp | grep :808 
kill -9 <process id>
```
or
```
fuser -k 8081/tcp
```
<br>

#### Detailed Explanation
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/J6yqEJrQUyk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>





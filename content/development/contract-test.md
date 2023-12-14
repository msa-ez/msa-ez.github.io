---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Contract Test (Consumer Driven Test)

### contract test

#### contract test scenario
- Check if the service works properly.
- Open terminal and run product service(8085) & order service(8081).
```sh	
cd contract-test

cd orders
mvn clean
mvn spring-boot:run

cd products
mvn clean
mvn spring-boot:run
```

- Make an order.
```	
http http://localhost:8081/orders productId=2 quantity=3 customerId=1@uengine.org
```

- Make Contract Violations
	- Call api of product service when making order at order service.
		- Check restTemplate.getForEntity from Order.java.
		- http://product_service/product/productId

- Change the api into item from product service.
> - Check ProductController.java from product service.
> - Change @GetMapping("/product/{productId}") into @GetMapping("/item/{productId}")

- Restart product service and make an order.

```
http http://localhost:8081/orders productId=2 quantity=3 customerId=1@uengine.org
```
- 404 error occurred!

#### Make CDC(Consumer Driven Contract)
- Apply Contract that prevents Provider to edit the codes Consumer refers to.
- Order service developer(Consumer) takes charge of preparing a contract(CDC).
- Refer to productGet.groovy file from the top root of order service.
- Copy productGet.groovy file and paste it at test/resources/contracts/rest of product service.
> - In reality, we pull request at Git environment and product team accepts it.
> - (There are no contracts/rest folder, so we must make it.)
> - (The reason why we make contracts/rest folder is we declared package contracts.rest at productGet.groovy file.)

- The error occurs on Test or Package step from product service by contract.
- Call package command of product service.
```sh
cd products
mvn package
```
- test fail error occurred!
> As violating the Contract with Consumer, product team fails from the build level.

- To solve the contract violation, product service must keep the api '/product'.
-  Change ProductController.java of product service to add new API in accordance with  existing API as below.

```
   @GetMapping("/v2/item/{productId}")
    Product productStockCheck_v2(@PathVariable(value = "productId") Long productId) {
        return productStockCheck(productId);
    }

    @GetMapping("/product/{productId}")
    Product productStockCheck(@PathVariable(value = "productId") Long productId) {

        return  this.productService.getProductById(productId);
    }
```
- Call the package command of product service.
```sh
cd products
mvn package
```
- Test successful and jar file creation completed!!

#### Test at Order Service
- Order service can test if product service is deploying with applying the test normally.
- To make order service to test api of product service, stub file must be provided from product service.
	- Put in comand 'mvn install' at product service and create stub file at Local(.m2 folder).
```sh
cd products
mvn install
```


- At order service, test by watching created stub file(Mock Server).
	- Refer to from test/java/com.example.template/ProductContractTest.java order service.
	- @AutoConfigureStubRunner watches the stub of order service.
	- Call api '/product/1' by TestRestTemplate and compare the result.
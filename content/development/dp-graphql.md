---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Data Projection with GraphQL


### Integrate Back-End Data with GraphQL

BFF pattern is a second way of Data Projection, which implemented as a dedicated server to project data from Backend: (Using Apollo server)

- Fork the eventstorming model and name it 'lab-shop-graphql'.
- Select "Apollo GraphQL" at CODE Preview > TOPPINGS to create Apollo Server for GraphQL

<img width="697"  src="https://user-images.githubusercontent.com/487999/191050930-bca7a84e-ab92-4c41-a746-a4b40da3e58d.png">

- Check if the apollo microservice has been created and push the code to your Git.
- Open Project IDE.
- After Gitpod is loaded, check the source codes of the model committed:


- Run order, inventory, and delivery service.
- Run order service(8081)
```
cd order
mvn spring-boot:run
```
- Run inventory service(8082)
```
cd inventory
mvn spring-boot:run
```
- Run delivery service(8083)
```
cd delivery
mvn spring-boot:run
```  
	
- Register product and make an order for the product.
```
http localhost:8082/inventories id=1 stock=10

http localhost:8081/orders productId=1 qty=1 customerId="1@uengine.org"
```

- Run GraphQL(8089)
```
cd apollo_graphql
npm install
yarn start
```
- GraphQL Playground 
> A workbench for Resolver specifications, data request and testing written GraphQL type
- Access to WebUI through Remote Explorer.

<img width="1161" alt="스크린샷 2022-09-23 오후 3 48 53" src="https://user-images.githubusercontent.com/58163635/191912194-88d4b4a0-44fd-4f13-a014-73fc0b503797.png">

** It could be only inquired when the service is "Public"

### Inquire the Service
* total order service
```gql
query getOrders {
  orders {
    productId
    qty
  }
}
```
* single order service( id=1 )
```gql
query getOrderById {
  order(id: 1) {
    productId
    qty
  }
}
```


* Inquiring complex service


Fill in the Resolver strategy about subquery to inquire complex service:

- resolver.ts
```
const resolvers = {
    Order: {
        delivery: async (root, {deliveryId}, {dataSources}) => {
            try {
                if (root && root._links.self.href) {
                    var parseLink = root._links.self.href.split('/')
                    var getOrderId = parseLink[parseLink.length - 1]
                    var deliveries = await dataSources.deliveryRestApi.getDeliveries();

                    if(deliveries){
                        var rtnVal = null
                        Object.values(deliveries).forEach(function (delivery) {
                            if(delivery && delivery.orderId == getOrderId){
                                rtnVal = delivery
                            }
                        })
                        return rtnVal
                    }
                }
                return null;
            } catch (e) {
                return null;
            }
        },
        
        inventory: async (root, {productId}, {dataSources}) => {
            if (!productId) productId = root.productId

            if (productId) {
                return await dataSources.inventoryRestApi.getInventory(productId);
            }
            return null;
        }
    },
    Inventory: {
        // set Query
    },
    Delivery: {
        // set Query
    },

    Query: {
        order : async (_, { id }, { dataSources }) => {
            return dataSources.orderRestApi.getOrder(id);
        },
        orders : async (_, __, { dataSources }) => {
            return dataSources.orderRestApi.getOrders();
        },
        inventory : async (_, { id }, { dataSources }) => {
            return dataSources.inventoryRestApi.getInventory(id);
        },
        inventories : async (_, __, { dataSources }) => {
            return dataSources.inventoryRestApi.getInventories();
        },
        delivery : async (_, { id }, { dataSources }) => {
            return dataSources.deliveryRestApi.getDelivery(id);
        },
        deliveries : async (_, __, { dataSources }) => {
            return dataSources.deliveryRestApi.getDeliveries();
        },
    }
};

export default resolvers;

```

- Add attributes at Type :  typeDefs.ts
```
    type Order {
    	id: Long! 
			productId: String 
			qty: Integer 
			customerId: String 
			amount: Double 
			status: String 
			address: String
      delivery: Delivery
      inventory: Inventory
    }
```

Inquire the informations of product and delivery related to order service
```gql
query {
  orders {
    qty
    customerId
    
    delivery {
      orderId
    }

    inventory{
      stock
    }
  }

}
```
- A Result
```
{
  "data": {
    "orders": [
      {
        "qty": 1,
        "customerId": "1@uengine.org",
        "delivery": {
          "orderId": 1
        },
        "inventory": {
          "stock": 9
        }
      }
    ]
  }
}
```


#### Refer GraphQL file
1. src/graphql/resolvers.js 
* Implement the specific process of getting data  
* Designate the action of service as a function, return data at the request(Query), fill in the Query or Implementation which is mutating(write, edit, delete)
 
```
ex)
const resolvers = {
  //Declare to call the information of object type from typeDefs(Order, Query, Product)
  
  Query: {
     //...
  } 
  Order: {
      deliveries: (root, args, {dataSources}) => {}

      //  function: (parent, args, context, info) => {}
      //  * parent  : the return value of resolver about path.
      //  * args    : args or {parameter} when calling function.
      //  * context : 
            an entity delivered to every resolvers running for specific work,
            sharing same context with DB connection.
          {dataSources}: calling data connected to xxx-rest-api.js.
      //  * info    : working status such as field name, a path from route to field.
  }
}
```

2. src/graphql/typeDefs.js
    * Type of data and requests for GraphQL specification (created by gql)

* Type Definitions
*  Declare object type and field name
```
type Delivery {
        id: Long!
        orderId: Long 
        productId: Long 
        customerId: String 
        deliveryAddress: String 
        deliveryState: String 
        orders: [Order]
        order(orderId: Long): Order
    }
  
    type Order {
        id: Long! 
        productId: Long
        customerId: String
        state: String
        deliveries: [Delivery]
        delivery(deliveryId: Long): Delivery
    }

    // []: list
    //  !: required value
```

3. src/restApiServer/xxx-rest-api.js
	* Set calling route and function for the service of apollo-datasource-rest.
```
import {RESTDataSource} from 'apollo-datasource-rest';
// apollo-datasource-rest module

class orderRestApi extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://order:8080';
        // call address info of the service.
    }

    // function name() 
    async getOrders() {
        const data = await this.get('/orders', {})
        // url call info after baseURL.

        var value = this.stringToJson(data);
        // Change call info : String to Json. 
        
        return value
        // return call info.
    }

    async getOrder(id) {
        // ...
    }

    stringToJson(str){
        if(typeof str == 'string'){
            str = JSON.parse(str);
        }
        return str;
    }
}
```
4. src/index.js
    * Mapping declaration call.
```
import {ApolloServer} from 'apollo-server';
import resolvers from './graphql/resolvers.js';
import typeDefs from './graphql/typeDefs.js';
import orderRestApi from './restApiServer/order-rest-api.js'
import deliveryRestApi from './restApiServer/delivery-rest-api.js'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        orderRestApi: new orderRestApi(),
        deliveryRestApi: new deliveryRestApi()
    }),
    // declare dataSources xxxRestApi call info.
});

server.listen({
    port: 8089,
}).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});

```


### Mission: Make resolver more efficient to inquire delivery

For now, the logic of finding delivery for an order is comparing all deliveries with orderId, which is inefficient. Improve the codes from data source and delivery service to make it get the result inquired from Backend DB through findByOrderId:

```
const resolvers = {
    Order: {
        delivery: async (root, {deliveryId}, {dataSources}) => {
            var parseLink = root._links.self.href.split('/')
            var orderId = parseLink[parseLink.length - 1]
            var deliveries = await dataSources.deliveryRestApi.findByOrderId(orderId);

            if(deliveries && deliveries.length>0)
                return deliveries[0];

            return null;
        },
      ...
```
---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Data Projection with Frontend and HATEOAS

### Frontend-based Data Projection

The first way of Data Projection: Aggregate data from UI(utilizing Vue.js-based Frontend)

#### Frontend Test
- Run every microservices(Order, Inventory)
- Run Kafka local server.
```
cd kafka
docker-compose up
```
- Run the Frontend service.
```
cd frontend
npm i
npm run serve
```
- Run gateway to get access to frontend service on browser.
```
cd gateway
mvn spring-boot:run
```
- Make the gateway into public so it can be accessed from outside.

- When you access to gateway routing Rule by '/', it's forwarding to  Frontend server.
- Access through gateway(8088).
- API can be called only through the gateway(CORS: Cross-Origin-Resource-Sharing Issue).

- Register stock before making an order:
```
# First, install http Client.
pip install httpie
http :8082/inventories id=1 stock=10
```

- Access to UI and make an order:
> Click '+' of Order UI.

<img width="574" alt="image" src="https://user-images.githubusercontent.com/487999/191061282-9cba3a28-219e-4fde-baa9-f9713b3f889a.png">

<img width="574" alt="image" src="https://user-images.githubusercontent.com/487999/191061179-211ff733-b7c7-4d26-9c33-e146ed565bf5.png">

<img width="574" alt="image" src="https://user-images.githubusercontent.com/487999/191061043-c9796f3f-4758-4052-aff4-71171f0c14fe.png">




#### Integrate the information of Delivery and Inventory through Order UI

- Add Inventory tag on Order.vue's template to call Inventory:

```
        <v-card-text>
            <String label="ProductId" v-model="value.productId" :editMode="editMode"/>
            <Number label="Qty" v-model="value.qty" :editMode="editMode"/>
            <String label="CustomerId" v-model="value.customerId" :editMode="editMode"/>
            <Number label="Amount" v-model="value.amount" :editMode="editMode"/>
            <String label="Status" v-model="value.status" :editMode="editMode"/>
            <String label="Address" v-model="value.address" :editMode="editMode"/>

            <Inventory v-model="inventory"></Inventory>

        </v-card-text>

```

- Declare inventory, a variable connected by v-model and give basic data: (line 98)
```
        data: () => ({
            snackbar: {
                status: false,
                timeout: 5000,
                text: ''
            },
            inventory: {stock: 5}
        }),

```
- Check if the result is same as the image below:

<img width="462" alt="image" src="https://user-images.githubusercontent.com/487999/191063786-aa08928e-eda9-41a4-9c21-bcb9ccdddef5.png">

- Filling in Inventory data by loading dynamically.
```
        data: () => ({
            snackbar: {
                status: false,
                timeout: 5000,
                text: ''
            },
            inventory: null
        }),
        async created(){
            var result = await axios.get('/inventories/' + this.value.productId);
            this.inventory = result.data;
        },
    ...
```

#### Handling dynamic data relationship through HATEOAS Link

- order/../infra/OrderHateoasProcessor.java:
```
@Component
public class OrderHateoasProcessor implements RepresentationModelProcessor<EntityModel<Order>>  {

    @Override
    public EntityModel<Order> process(EntityModel<Order> model) {
        model.add(Link.of("/inventories/" + model.getContent().getProductId()).withRel("inventory"));
        
        return model;
    }
    
}
```
- Re-run order service.
- Make an order by http.
```
http :8081/orders productId=1 qty=3 customerId=gdhong address=Seoul
```

- Check HATEOAS Link created:
```
> http :8081/orders
{
    "_links": {
        "inventory": {
            "href": "/inventories/1"
        },
        "order": {
            "href": "http://localhost:8081/orders/1"
        },
        "self": {
            "href": "http://localhost:8081/orders/1"
        }
    },
    "address": "Everland",
    "amount": null,
    "customerId": "jjy",
    "productId": "1",
    "qty": 1,
    "status": null
}
```
- Edit Order.vue to get the URI address of Inventory data indirectly through HATEOAS Link:
```
        async created(){
            var result = await axios.get(this.value._links.inventory.href);
            this.inventory = result.data;
        },

```
- As a result, we can notice that the same result comes out through Frontend.

#### We can composite scattered data of microservices on Frontend UI, but the Backend service must be alive and if there are too many data, performance problems can happen.

### Scenario Expansion: Output of the integrated delivery information
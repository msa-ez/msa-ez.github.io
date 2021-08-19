---
description: ''
sidebar: 'started'
---
# Create a Go Template 

## Go DDD tutorial 

### Model

![model](../../src/img/go-tutorial/model.png)

<h4> Order </h4>

- There are two events in Order: OrderPlaced and OrderCancelled. OrderPlaced set trigger with PostPersist, and OrderCancelled set trigger with PreRemove.
 
- OrderPlaced, that is, an ordered event, communicates with the Delivery Service by issuing an event to the kafka channel through Pub/Sub communication.
 
- OrderCancelled, that is, order canceled event is communicated with Delivery Service through REST API through Res/Req communication. OrderCancelled logic is executed only after DeliveryCancelled logic in Delivery Service precedes.


<h4> Delivery </h4>

- The two events of Delivery are DeliveryStarted and DeliveryCancelled. DeliveryStarted sets a trigger with PostPersist, and DeliveryCanclled sets a trigger with PreRemove.

### Code 

![code](../../src/img/go-tutorial/code.png)

If you click the code in the upper right corner on the EventStoring screen and set the language to go, the code above is generated. If you want to download it, click Download Archive.

### Test 

![code](../../src/img/go-tutorial/run.png)

<h4> Running the application </h4>

1. After moving to the downloaded file location, check if main.go exists in the current directory.

2. Execute the following command to download the module to run the application. (where main.go is)

```bash
go mod init [project name]
go mod tidy 
```
3. Create a binary file by executing the following command in the location of main.go
 
```bash
go build main.go
```
4. Execute the following command to run the binary file created through the above command.
 
```bash
./main
``

## Go 기술 Stack 

- Web Framework : echo

- ORM : gorm

- Kafka : confluent-kafka-go

- DB : SQlite

- REST Api : resty

## Before creating the template code

Go Template was created based on Spring-boot Template. The parts that are linguistically different from Java will be described in the detailed description. Among the functions provided as libraries in Spring-boot, functions not in go are implemented separately.

## Go template file structure

A code for Go template is also generated like Spring boot based on model driven. The comparison between Spring-boot and Go is as follows. 

| role | Spring boot | Go |
|-----|-------------|----|
|Aggregate | Entity.java | Entity.go|
|Event | Event.java | Event.go | 
|PolicyHandler | PolicyHandler.java | PolicyHandler.go | 
|PolicyEvent | PolicyEvent.java | PolicyEvent.go |
|ExternalEntity | ExternalEntity.java | ExternalEntity.go |
|ExternalService | ExternalService.java | ExternalService.go |
|Repository | Repoistory.java | Repository.go |
|Controller | Controller.java | Route.go | 
|Application | Application.java | main.go |
|Kafka | | KafkaProcessor.go | 
|DB | | DB.go | 
|utility | | Util.go | 

## Template description for each model

- This section describes the codes that are model-driven and generated based on the models generated through eventstorming. 

### · Entity.go

- Create aggregate code

```go
forEach: Aggregate
fileName: {{namePascalCase}}.go
path: {{boundedContext.name}}/{{boundedContext.name}}
---
package {{boundedContext.name}}

{{#eventsExists events}}
import (
	"gopkg.in/jeevatkm/go-model.v1"
	
	"gorm.io/gorm"
	{{#commandValueExists events}}
	"fmt"

	"order/external"
	{{/commandValueExists}}
)
{{/eventsExists}}
type {{namePascalCase}} struct {
	{{#aggregateRoot.fieldDescriptors}}
    {{#isKey}}
	{{namePascalCase}} int `gorm:"primaryKey" json:"id" type:"int"`
	{{/isKey}}
	{{^isKey}}
	{{namePascalCase}} {{#typeCheck className}} {{/typeCheck}} `json:"{{nameCamelCase}}" type:"{{#typeCheck className}}{{/typeCheck}}"`
	{{/isKey}}
	{{/aggregateRoot.fieldDescriptors}}
	
	
}

{{#lifeCycles}}
func (self *{{../namePascalCase}}) {{#triggerCheck trigger}}{{/triggerCheck}}(tx *gorm.DB) (err error){
	{{#events}}
	{{nameCamelCase}} := New{{namePascalCase}}()
	model.Copy({{nameCamelCase}}, self)

	Publish({{nameCamelCase}})
	
	{{#relationCommandInfo}}
        {{#commandValue}}
	{{aggregate.nameCamelCase}} = &{{aggregate.namePascalCase}}{}
	resp := external.{{namePascalCase}}({{aggregate.nameCamelCase}})
	fmt.Println(resp)
		{{/commandValue}}
	{{/relationCommandInfo}}
	{{/events}}
	return nil
}
{{/lifeCycles}}

<function>
    window.$HandleBars.registerHelper('typeCheck', function (className) {
        if(className.endsWith("String")){
            return "string"
        }
		else if(className.endsWith("Integer")){
			return "int"
		}
		else if(className.endsWith("Float")){
			return "float64"
		}
		else if(className.endsWith("Long")){
			return "int"
		}
		else if(className.ensWith("Boolean")){
			return "bool"
		}
		else if(className.ensWith("Double")){
			return "int"
		}
		
    });

	window.$HandleBars.registerHelper('triggerCheck', function (trigger) {
        if(trigger.endsWith("PreRemove")){
            return "BeforeDelete"
        }
        else if(trigger.endsWith("PostRemove")){
            return "AfterDelete"
        }
		else if(trigger.endsWith("PrePersist")){
			return "BeforeCreate"
		}
		else if(trigger.endsWith("PostPersist")){
			return "AfterCreate"
		}
		else if(trigger.endsWith("PreUpdate")){
			return "BeforeUpdate"
		}
		else{
			return "AfterUpdate"
		}
    });

	window.$HandleBars.registerHelper('eventsExists', function (events, options) {
		if(Object.values(events) != ""){
			return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
		
	});

	window.$HandleBars.registerHelper('commandValueExists', function(events, options){
		for(var ele in events){
			if(events[ele]['relationCommandInfo'].length!=0){
				return options.fn(this)
			}
		}
		return options.inverse(this)
		
	})
</function>
```

<h4> HandlerBar function </h4>

- typeCheck 

Since the attribute types of Entity are based on java, it converts them into types suitable for Go.

- eventsExists 

Check if there are events connected to the Aggregate. In Go, if you import and do not use it, a build error occurs, so if there is an event, it is imported, and if it is not, it is not imported. 

- commandValueExists 

Check if there is res/req communication. If there is, import external, if not, don't import external.

- triggerCheck 

After checking the trigger in the event, it is converted into a trigger suitable for Go. 

| Java 			| Go 		|
|---------------|-----------|
|PostPersist 	|afterCreate|
|PrePersist 	|beforeCreate|
|PostUpdate 	|afterUpdate|
|PreUpdate 		|beforeUpdate|
|PostDelete		|afterDelete|
|PreDelete		|beforeDelete|

<h4> Detail </h4>

- Create one Entity.go file per Aggregate.
 
- Event objects are contained within the lifeCycles object. (Events object can also be used independently)

- The trigger in lifeCycles has only the trigger name, not the annotation type trigger.
 
- For commands connected to events, information is stored in relationCommandInfo object, and to get each command information, it must be imported as commandValue object in relationCommandInfo.
 

---

### · Event.go

- Create event code 

```go
forEach: Event
fileName: {{namePascalCase}}.go
path: {{boundedContext.name}}/{{boundedContext.name}}
---
package {{boundedContext.name}}

import (
	"time"
)

type {{namePascalCase}} struct{
	EventType string	`json:"eventType" type:"string"`
	TimeStamp string 	`json:"timeStamp" type:"string"`
	{{#fieldDescriptors}}
	{{namePascalCase}} {{#typeCheck className}} {{/typeCheck}} `json:"{{nameCamelCase}}" type:"{{#typeCheck className}}{{/typeCheck}}"` 
	{{/fieldDescriptors}}
	
}

func New{{namePascalCase}}() *{{namePascalCase}}{
	event := &{{namePascalCase}}{EventType:"{{namePascalCase}}", TimeStamp:time.Now().String()}

	return event
}

<function>
    window.$HandleBars.registerHelper('typeCheck', function (className) {
        if(className.endsWith("String")){
            return "string"
        }
		else if(className.endsWith("Integer")){
			return "int"
		}
		else if(className.endsWith("Float")){
			return "float64"
		}
		else if(className.endsWith("Long")){
			return "int"
		}
		else if(className.ensWith("Boolean")){
			return "bool"
		}
		else if(className.ensWith("Double")){
			return "int"
		}
		
    });
</function>
```

<h4> Detail </h4>

- Create one Event.go file per Event.
 
- The handleBar function called typeCheck makes a variable type suitable for go like Entity.go.

- In Spring boot code, Event object inherits abstractEvent object and is used, but in Go, there is no concept of inheritance, so all major functions of abstractEvent are additionally implemented as various functions in Util.go.


### · PolicyHandler.go

- Create policyHandler code connected to Pub/Sub

```go
forEach: BoundedContext
fileName: PolicyHandler.go
path: {{name}}/{{name}}
---
package {{name}}

{{#policyExists policies}}
import (
	"github.com/mitchellh/mapstructure"
)
{{/policyExists}}

{{#policies}}
{{#relationEventInfo}}
func whenever{{eventValue.namePascalCase}}_{{../namePascalCase}}(data map[string]interface{}){
	
	event := New{{eventValue.namePascalCase}}()
	mapstructure.Decode(&event,data)
	{{#../../aggregates}}
	{{nameCamelCase}} := &{{namePascalCase}}{}
	{{nameCamelCase}}repository.save({{nameCamelCase}})
	{{/../../aggregates}}
	
}

{{/relationEventInfo}}
{{/policies}}

<function>
	window.$HandleBars.registerHelper('policyExists', function (policies, options) {
		if(Object.values(policies) != ""){
			return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
		
	});
</function>
```

<h4> HandleBar function </h4>

- policyExists

A handleBar function that determines whether a linked policy exists Imports mapstructure only when a linked policy exists.

<h4> Detail </h4>

 - There is information about policyHandler connected in the object called policies.
 
 - Information on the Event object associated with the policyHandler is contained in the relationEventInfo object.
 
 - Detailed information of each Event object is contained in eventValue in relationEventInfo.

 - In the Spring boot code, the code that reads all messages in PolicyHandler and instantiates them and executes the logic only when the object is the desired object is executed through a function called validate. This is the format to pass the message to.


---

### · PolicyEvent.go

- Create code for external Event structure associated with PolicyHandler

```go
forEach: RelationEventInfo
fileName: {{eventValue.namePascalCase}}.go
path: {{boundedContext.name}}/{{boundedContext.name}}
---
package {{boundedContext.name}}

import (
	"encoding/json"
	"time"
)

type {{eventValue.namePascalCase}} struct{
	EventType string	`json:"eventType" type:"string"`
	TimeStamp string 	`json:"timeStamp" type:"string"`
	{{#eventValue.fieldDescriptors}}
	{{namePascalCase}} {{#typeCheck className}} {{/typeCheck}} `json:"{{nameCamelCase}}" type:"{{#typeCheck className}}{{/typeCheck}}"` 
	{{/eventValue.fieldDescriptors}}
	
}

func New{{eventValue.namePascalCase}}() *{{eventValue.namePascalCase}}{
	event := &{{eventValue.namePascalCase}}{EventType:"{{eventValue.namePascalCase}}", TimeStamp:time.Now().String()}

	return event
}

<function>
    window.$HandleBars.registerHelper('typeCheck', function (className) {
        if(className.endsWith("String")){
            return "string"
        }
		else if(className.endsWith("Integer")){
			return "int"
		}
		else if(className.endsWith("Float")){
			return "float64"
		}
		else if(className.endsWith("Long")){
			return "int"
		}
		
    });
</function>
```

<h4> Detail </h4>

- Same as Event.go code, but implemented in the service on the BoundedContext side to which the PolicyHandler is attached.

---

### · ExternalService.go 

- Create ExternalService code that implements logic to communicate with external service command and res/req method

```go
forEach: RelationCommandInfo
fileName: {{commandValue.aggregate.namePascalCase}}Service.go
path: {{boundedContext.name}}/external
---
package external 

import (
	"github.com/go-resty/resty/v2"
	"strconv"
)

var client = resty.New()

{{#MethodPost commandValue.restRepositoryInfo.method}}
func {{commandValue.namePascalCase}}(entity interface{}) *resty.Response{
	resp, _ := client.R().
		SetBody(entity).
		Post("https://{{commandValue.boundedContext.name}}:8080/{{commandValue.aggregate.namePlural}}")

	return resp
}
{{/MethodPost}}
{{#MethodGet commandValue.restRepositoryInfo.method}}
func {{commandValue.namePascalCase}}(id int) *resty.Response{
	target := "https://{{commandValue.boundedContext.name}}:8080/{{commandValue.aggregate.namePlural}}/"+strconv.Itoa(id)

	resp, _ := client.R().
		Get(target)

	return resp
}
{{/MethodGet}}
{{#MethodUpdate commandValue.restRepositoryInfo.method}}
func {{commandValue.namePascalCase}}(entity interface{}) *resty.Response{
	resp, _ := client.R().
		SetBody(entity).
		Put("https://{{commandValue.boundedContext.name}}:8080/{{commandValue.aggregate.namePlural}}")

	return resp
}
{{/MethodUpdate}}
{{#MethodDelete commandValue.restRepositoryInfo.method}}
func {{commandValue.namePascalCase}}(id int) *resty.Response{
	target := "https://{{commandValue.boundedContext.name}}:8080/{{commandValue.aggregate.namePlural}}/"+strconv.Itoa(id)

	resp, _ := client.R().
		Delete(target)

	return resp
}
{{/MethodDelete}}


<function>
	window.$HandleBars.registerHelper('MethodGet', function(method, options){
        if(method.endsWith('GET')){
        	return options.fn(this)
		}
		else{
			return options.inverse(this)
		}
    });
	window.$HandleBars.registerHelper('MethodPost', function(method, options){
        if(method.endsWith('POST')){
        	return options.fn(this)
		}
		else{
			return options.inverse(this)
		}
    });
	window.$HandleBars.registerHelper('MethodUpdate', function(method, options){
        if(method.endsWith('PUT')){
        	return options.fn(this)
		}
		else{
			return options.inverse(this)
		}
    });
	window.$HandleBars.registerHelper('MethodDelete', function(method, options){
        if(method.endsWith('DELETE')){
        	return options.fn(this)
		}
		else{
			return options.inverse(this)
		}
    });
</function>
```
<h4> HandleBar Function </h4>

Implemented a function such as switch/case that can distinguish methods because it is necessary to generate the code suitable for the method according to the method.

- MethodGet 

return true for get method

- MethodPost

return true for post method

- MethodUpdate 

In case of update method, return true

- MethodDelete

In case of Delete method, return true

<h4> Detail </h4>

- A package is defined as a different package than the current one as external.
 
- The name of the file is the aggregate name of the external service connected by res/req communication + service.

- The information of the connected commands is in the commandValue object.

- The method of the corresponding command is in commandValue.restRepositoryInfo.method.

- In Spring boot code, res/req communication is performed using Feign client, but since Feign related api does not exist in Go, communication in res/req format is implemented using resty library.


---

### · ExternalEntity.go

- Create entity code corresponding to aggregate of external service connected by res/req communication

```go
forEach: RelationCommandInfo
fileName: {{commandValue.aggregate.namePascalCase}}.go
path: {{boundedContext.name}}/external
---
package external

{{#commandValue.aggregate}}
type {{namePascalCase}} struct {
	{{#aggregateRoot.fieldDescriptors}}
    {{#isKey}}
	{{namePascalCase}} int `gorm:"primaryKey" json:"id" type:"int"`
	{{/isKey}}
	{{^isKey}}
	{{namePascalCase}} {{#typeCheck className}} {{/typeCheck}} `json:"{{nameCamelCase}}" type:"{{#typeCheck className}}{{/typeCheck}}"`
	{{/isKey}}
	{{/aggregateRoot.fieldDescriptors}}
}
{{/commandValue.aggregate}}

<function>
    window.$HandleBars.registerHelper('typeCheck', function (className) {
        if(className.endsWith("String")){
            return "string"
        }
		else if(className.endsWith("Integer")){
			return "int"
		}
		else if(className.endsWith("Float")){
			return "float64"
		}
		else if(className.endsWith("Long")){
			return "int"
		}
    });

</function>

```

<h4> Detail </h4>

- A package is defined as a different package than the current one as external.

- Get the information of aggregates in the commandValue object with linked command information and create them in the same way as in the Entity.go file.

---

### · Repository.go

- Creating basic CRUDs for REST APIs

```go
forEach: Aggregate
fileName: {{namePascalCase}}Repository.go
path: {{boundedContext.name}}/{{boundedContext.name}}
---
package {{boundedContext.name}}

import (
	"net/http"
	"strconv"
	"github.com/labstack/echo"
)

func (self *{{namePascalCase}}) Get(c echo.Context) error {
	repository := {{namePascalCase}}Repository()
	entities := repository.GetList()
	return c.JSON(http.StatusOK, entities)
}

func (self *{{namePascalCase}}) GetbyId(c echo.Context) error{
	repository := {{namePascalCase}}Repository()
	id, _ := strconv.Atoi(c.Param("id"))
	self = repository.GetID(id)

	return c.JSON(http.StatusOK, self)
}

func (self *{{namePascalCase}}) Persist(c echo.Context) error{
	repository := {{namePascalCase}}Repository()
	params := make(map[string] string)
	
	c.Bind(&params)
	ObjectMapping(self, params)
	
	
	repository.save(self)

	return c.JSON(http.StatusOK, self)
}

func (self *{{namePascalCase}}) Put(c echo.Context) error{
	repository := {{namePascalCase}}Repository()
	id, _ := strconv.Atoi(c.Param("id"))
	params := make(map[string] string)
	
	c.Bind(&params)

	err := repository.Update(id, params)

	return c.JSON(http.StatusOK, err)
}

func (self *{{namePascalCase}}) Remove(c echo.Context) error{
	repository := {{namePascalCase}}Repository()
	id, _ := strconv.Atoi(c.Param("id"))
	self = repository.GetID(id)

	err := repository.Delete(self)

	return c.JSON(http.StatusOK, err)
}
```

<h4> Detail </h4>

- One CRUD must be created per entity, so one Repository.go is created per Aggregate.
 
- The function of spring-data-rest package is implemented in spring boot using echo framework in go.


--- 

### · Route.go

- Create route code corresponding to controller

```go
forEach: BoundedContext
fileName: Route.go
path: {{name}}/{{name}}
---
package {{name}}

import (
	"github.com/labstack/echo"
)

func RouteInit() *echo.Echo {
	e := echo.New()
	{{#aggregates}}
	{{nameCamelCase}} := &{{namePascalCase}}{}
	e.GET("/{{namePlural}}", {{nameCamelCase}}.Get)
	e.GET("/{{namePlural}}/:id", {{nameCamelCase}}.GetbyId)
	e.POST("/{{namePlural}}", {{nameCamelCase}}.Persist)
	e.PUT("/{{namePlural}}/:id", {{nameCamelCase}}.Put)
	e.DELETE("/{{namePlural}}/:id", {{nameCamelCase}}.Remove)
	{{/aggregates}}
	return e
}

```

<h4> Detail </h4>

- Specifies the path of functions corresponding to basic CRUD.

- Since there must be a CRUD for each Aggregate that corresponds to an entity, a CRUD is created for each Aggregate.

- In the Spring boot code, the work performed by the Rest controller was implemented by setting the routing on the echo framework in Go.


---

### · main.go

- Create the main code to run the application

```go
forEach: BoundedContext
fileName: main.go
path: {{name}}
---
package main

import(
	"{{name}}/{{name}}"
)

func main() {
	
	{{#aggregates}}
	{{../name}}.{{namePascalCase}}DBInit()
	{{/aggregates}}
	{{name}}.InitProducer()
	{{#policyExists policies}}
	{{name}}.InitConsumer()
	{{/policyExists}}
	{{^policyExists policies}}
	{{/policyExists}}
	e := {{name}}.RouteInit()

	e.Logger.Fatal(e.Start(":{{portGenerated}}"))
}

<function>
	window.$HandleBars.registerHelper('policyExists', function (policies, options) {
		if(Object.values(policies) != ""){
			return options.fn(this)
        }
        else{
            return options.inverse(this)
        }
		
	});
</function>

```

<h4> HandleBar Function </h4>

- policyExists

If the pub/sub communication method exists, that is, a function to check whether a policyHandler for the event exists in the external service.

<h4> Detail </h4>

- When the application is running, DB, kafkaProducer, and if necessary, Kafkaconsumer and echo framework are started.

## Go-only Template

- Unlike spring boot, there are many APIs that are not supported in Go.

- For this, only essential elements generate functions that fit the model.


### · DB.go

- Create Sqlite DB (H2 DB is used in the spring boot tutorial.)

- All logic related to DB is executed in this code.


```go
forEach: Aggregate
fileName: {{namePascalCase}}DB.go
path: {{boundedContext.nameCamelCase}}/{{boundedContext.nameCamelCase}}
---
package {{boundedContext.name}}
import (
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
)

var err error

type {{namePascalCase}}DB struct{
	db *gorm.DB
}

var {{nameCamelCase}}repository *{{namePascalCase}}DB

func {{namePascalCase}}DBInit() {
	{{nameCamelCase}}repository = &{{namePascalCase}}DB{}
	{{nameCamelCase}}repository.db, err = gorm.Open(sqlite.Open("{{namePascalCase}}_table.db"), &gorm.Config{})
	
	if err != nil {
		panic("DB Connection Error")
	}
	{{nameCamelCase}}repository.db.AutoMigrate(&{{namePascalCase}}{})

}

func {{namePascalCase}}Repository() *{{namePascalCase}}DB {
	return {{nameCamelCase}}repository
}

func (self *{{namePascalCase}}DB)save(entity interface{}) {
	err := self.db.Create(entity)

	if err != nil{
		log.Print(err)
	}
}

func (self *{{namePascalCase}}DB)GetList() []{{namePascalCase}}{
	entities := []{{namePascalCase}}{}
	self.db.Find(&entities)

	return entities
}

func (self *{{namePascalCase}}DB)GetID(id int) *{{namePascalCase}}{
	entity := &{{namePascalCase}}{}
	self.db.Where("id = ?", id).First(entity)

	return entity
}

func (self *{{namePascalCase}}DB) Delete(entity *{{namePascalCase}}) error{
	err2 := self.db.Delete(&entity).Error
	return err2
}

func (self *{{namePascalCase}}DB) Update(id int, params map[string]string) error{
	entity := &{{namePascalCase}}{}
	err1 := self.db.Where("id = ?", id).First(entity).Error
	if err1 != nil {
		return err1
	}else {
		update := &{{namePascalCase}}{}
		ObjectMapping(update, params)

		err2 := self.db.Model(&entity).Updates(update).Error
		return err2
	}

}
```

<h4> Detail </h4>

- Since two or more aggregates exist in one boundedContext, one DB.go file is created for each aggregate.
 
- In addition, when there are more than two aggregates, since there are more than two db tables to be created, implement the struct method to distinguish them.


--- 

### · KafkaProcessor.go 

- Creating code for Kafka-related logic

- The settings for Kafka producer and consumer are set in the current file.


```go
forEach: BoundedContext
fileName: KafkaProcessor.go
path: {{name}}/{{name}}
---
package {{name}}

import (
	"gopkg.in/confluentinc/confluent-kafka-go.v1/kafka"
	"fmt"
    "encoding/json"
)

var producer *kafka.Producer
var consumer *kafka.Consumer
var topic string

func InitProducer(){

    producer, err = kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "localhost"})
    if err != nil {
        panic(err)
    }
	topic = "{{options.package}}"
}

func InitConsumer(){
    consumer, err = kafka.NewConsumer(&kafka.ConfigMap{
        "bootstrap.servers": "localhost",
        "group.id":          "{{name}}",
        "auto.offset.reset": "earliest",
    })

    if err != nil {
        panic(err)
    }

    go KafkaConsumer()
	
}

func KafkaProducer() (*kafka.Producer, string){
	
	return producer, topic
}

func KafkaConsumer(){
    
	
    consumer.SubscribeTopics([]string{topic}, nil)
    //defer c.Close()
	var dat map[string]interface{}
    for {
        msg, err := consumer.ReadMessage(-1)
        if err == nil {
			if err := json.Unmarshal(msg.Value, &dat); err != nil {
				panic(err)
			}
            {{#policies}}
            if dat['eventType'] == {{#relationEventInfo}}"{{eventValue.namePascalCase}}"{{/relationEventInfo}}{
                {{#relationEventInfo}}
                whenever{{eventValue.namePascalCase}}_{{../namePascalCase}}(dat)
                {{/relationEventInfo}}
            }
            {{/policies}}
			
        } else {
            // The client will automatically try to recover from all errors.
            fmt.Printf("Consumer error: %v (%v)\n", err, msg)
        }
    }
}

func Streamhandler(message string){
	producer, topic := KafkaProducer()
	
	producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          []byte(message),
	}, nil)

}

```

<h4> Detail </h4>

- The group id is the name of boundedContext.

- The topic is the name of the project.

- The KafkaConsumer deserializes the message received through the kafka channel and calls the policyHandler function that executes the corresponding logic according to the eventType.


___ 

### · Util.go 

- It is a code that implements essential functions among APIs that are in Spring boot but not in Go. This is model driven and code is not generated, but one Util.go file is generated for each boundedContext.

```go
forEach: BoundedContext
fileName: util.go
path: {{name}}/{{name}}
---
package {{name}}

import (
	"reflect"
	"strconv"
    "fmt"
)

func ObjectMapping(anything interface{}, request map[string]string){

    target := reflect.ValueOf(anything)
    elements := target.Elem()


    for i := 0; i < elements.NumField(); i++ {
        //mValue := elements.Field(i)
        mType := elements.Type().Field(i)
        tag := mType.Tag
        structFieldValue := elements.FieldByName(mType.Name)
		tagName := tag.Get("json")
        if tag.Get("type") == "int"{
            temp,_ := strconv.Atoi(request[tagName])
            val := reflect.ValueOf(temp)
        	structFieldValue.Set(val)
        }else if tag.Get("type") == "string"{
            val := reflect.ValueOf(request[tagName])
            structFieldValue.Set(val)
        }else{
            fmt.Println("ELSE IN OBJECTMAPPING")
        }
    }
}

func getType(myvar interface{}) string {
    if t := reflect.TypeOf(myvar); t.Kind() == reflect.Ptr {
        return t.Elem().Name()
    } else {
        return t.Name()
    }
}

func ToJson(event interface{}) string {
	e, err := json.Marshal(event)
	if err != nil {

		return "ToJson error"
	}

	return string(e)
}

func Publish(event interface{}) {
	message := ToJson(event)

	streamhandler(message)
}
```

<h4> Detail </h4>

- The ObjectMapping function is a function that maps the map[string] string, which is the request type received through the echo framework, with the entity class. In general, objectMapping uses mapstructure, but this was implemented by supporting only types related to the map[string] interface.

- Publish, ToJson, and getType functions are implemented as methods of AbstractEvent in Spring boot code, but they are implemented as separate functions because inheritance is not possible in Go.





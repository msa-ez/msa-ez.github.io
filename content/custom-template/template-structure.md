---
description: ''
sidebar: 'started'
---
# Template File Structure
A template file consists of metadata that sets essential options and template code that declares dynamically changing data. 

Using the Aggregate.java file as a reference, let's explore how to structure a template file.

## 1. Defining Metadata
Metadata refers to the way the template iterates through data, the type and location of the generated files, and other configuration options. At the top of the template file, you can set options as follows:

Template
```
forEach: Aggregate
fileName: {{namePascalCase}}.java
path: {{boundedContext.name}}/{{{options.packagePath}}}/domain
---
```

### 1.1 Setting File Type

Use the forEach to define the type of file the template will generate. The value of forEach can be stickers modeled, and in this case, it is set to Aggregate.

### 1.2 Setting File Name

Use fileName to set the name of the generated file. Since the file is generated based on the number of stickers corresponding to forEach, dynamically generate the file name based on the specified conventions. 

In this example, it is set to {{namePascalCase}}.java, where the result will be dynamically replaced with the value of namePascalCase from each Aggregate.

### 1.3 Setting File Path
Finally, use path to set the path where the Order.java will be generated. The current Company.java should be generated under the domain subdirectory. 

Therefore, by referencing the data in the 'Model Explorer', set the paths so that the files specified by fileName are created under the domain.

Once the metadata options are set, input a hyphen ('---') at the bottom of the last metadata to separate it from the template code.


## 2. Template Code

### 2.1 Mustache

In the template file, you can use Mustache ('{{}}') to structure the template code using data generated through modeling. Mustache allows you to input the modeled data within the template.

For example, using the name from the Aggregate sticker, you can create a Java class as follows:

Template
```
public class {{name}} {

}
```
Template Result
```
public class Company {

}
```

### 2.2 Accessing Inner Attributes
Typically, when accessing attributes of the base sticker, you can use the {{attribute}} format.

However, when accessing attributes within a specific attribute, you use a period ('.'). 

This is written as {{attribute.innerAttribute}}.

Template
```
{{keyFieldDescriptor.name}}
```
Template Result
```
id
```
Among the fields of the Aggregate sticker, the current id field is set as the keyField. To retrieve the name of the id field, you access the name attribute inside keyFieldDescriptor.

### 2.3 Accessing Outer Attributes
In contrast to accessing inner attributes, there are situations where you need to access attributes outside the current scope.

To access attributes in the outer scope, use '../', and it's written as {{../outerAttribute}}.

Template
```
{{#aggregateRoot}}
    {{../name}}
{{/aggregateRoot}}
```
Template Result
```
Company
```
In the example, to retrieve the name of the Aggregate sticker while within the aggregateRoot attribute, 

you need to access the outer attribute using {{../name}}.

### 2.4 Naming Conventions

Data related to names within stickers is generated using various naming conventions. You can leverage these conventions to access event attributes and create methods, as shown below:

Template
```
{{#lifeCycles}}
    public void on{{trigger}}(){
        {{#events}}
            {{namePascalCase}} {{nameCamelCase}} = new{{namePascalCase}}(this);
        {{/events}}
    }
{{/lifrCycles}}
```
Template Result
```
public void onPostPersist() {
    OrderPlaced orderPlaced = new OrderPlaced(this);
    orderPlaced.publishAfterCommit();
}
```

In this example, methods are created by accessing the event stickers within the lifeCycles attribute and utilizing the naming conventions generated for the event stickers.
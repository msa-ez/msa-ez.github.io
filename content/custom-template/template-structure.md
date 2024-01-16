---
description: ''
sidebar: 'started'
---
# Template File Structure
A template file consists of metadata, which sets essential options, and template code, which declares dynamically changing data. 

Let's use the previously created Aggregate.java file as a reference to explain how to structure a template file.

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

You must set how the template file will be created. 

The forEach option can be used for this purpose, and it can take the values of stickers modeled. 

In this case, it is set to Aggregate.

### 1.2 Setting File Name

For a template file set with forEach: Aggregate, multiple files will be created based on the number of Aggregates. 

To ensure each file has a unique name, use the fileName option. Here, the file name is set to {{namePascalCase}}.java. 

This allows each file to be uniquely identified based on the namePascalCase value of the corresponding Aggregate.

### 1.3 Setting File Paths
Finally, use the path option to define where the Aggregate.java files will be created. 

The current setup places the files under the 'domain' directory, and the path is constructed based on the data from the 'Model Explorer.'

Once metadata options are configured, you can separate them from the template code by adding a dash line ('---') at the end.


## 2. Template Code

Template files can leverage data generated through modeling in the 'Model Explorer' to structure the template code. Mustache ({{}}) can be used to bring in data. Mustache is a simple template engine supporting various languages.

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

### 2.3 Accessing External Scope Attributes
In contrast to accessing inner attributes, there are situations where you need to access attributes outside the current scope.

To access attributes outside the current scope, use '../'. 

For instance, {{../externalAttribute}} allows access to attributes in the external scope:

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
Sticker data related to names is often generated with various naming conventions. You can utilize these conventions to access event attributes and create methods dynamically:

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

Here, the template accesses the lifeCycles attribute and dynamically generates methods based on the trigger attribute. 

The template then accesses the events attribute to create instances of event stickers using the generated naming conventions.
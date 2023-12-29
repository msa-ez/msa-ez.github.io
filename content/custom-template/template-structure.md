---
description: ''
sidebar: 'started'
---
# Template Structure

## 1. Definition of Metadata

To create a custom template, start by declaring metadata at the top of the file.

Metadata refers to the way the template iterates through data, the type and location of the generated file, and other configuration options.

Template
```
forEach: Aggregate
fileName: {{namePascalCase}}.java
path: {{boundedContext.name}}/{{{options.packagePath}}}/domain
---
```

### 1.1 Setting File Type
Here, use forEach to define the type of file the template will generate.

In this case, it's set to 'Aggregate' to specify the basis for generating the template.

### 1.2 Defining File Name

Next, use fileName to set the name of the generated file.

With fileName set to {{namePascalCase}}.java, the file will be created as Company.java.

### 1.3 Setting File Path

Finally, use path to define the path where Company.java will be generated.

By setting it to {{boundedContext.name}}/{{{options.packagePath}}}/domain, the Company.java file will be created in the 'domain' subfolder under the Bounded Context to which the Aggregate belongs.

Once metadata options are configured, add a dash ('---') at the end of the last metadata to indicate completion of metadata settings, separating it from the template code to be written below.


## 2. Definition of Mustache 

### 2.1 Mustache Syntax

To dynamically change data in the template file, use Mustache ('{{}}') and input data inside to allow dynamic changes.

To create a Java class based on the named Aggregate sticker, you can write:

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

### 2.2 Naming Conventions

When retrieving the name of a sticker, you can use naming conventions to return various results.

Template
```
{{nameCamelCase}}

{{namePascalCase}}
```
Template Result
```
company

Company
```

In this example, the name of the Aggregate sticker is retrieved using nameCamelCase and namePascalCase naming conventions to return 'company' and 'Company' as needed.

## 3. Mustache Data Access

### 3.1 데이터 내부 속성 접근

Typically, when accessing data from the base sticker, you can use the format {{data}}.

However, when accessing data attributes within a specific data object, you can use a period ('.').

Template
```
{{aggregateRoot.keyFieldDescriptor.name}}
```
Template Result
```
id
```
Here, the id field name is retrieved from the keyFieldDescriptor within the aggregateRoot. 

To obtain the name of the id field, you access the data property within the aggregateRoot, followed by the keyFieldDescriptor and its name attribute.

### 3.2 Accessing External Data Properties

In contrast to accessing internal data, there are instances where you need to access properties of external data.

To achieve this, you can use '../' to navigate to external data, and the syntax {{../externalData}}.

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
In this example, to retrieve the name of the Aggregate sticker, you need to access an external property while within the scope of aggregateRoot. 

Hence, using {{../name}} enables you to move to the parent property and obtain the name of the Aggregate.
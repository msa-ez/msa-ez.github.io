---
description: ''
sidebar: 'started'
---
# Conditional Statements

## 1. What are Conditional Statements?

Conditional statements are used to determine the appropriate result based on specific attributes or situations. 

Typically, {{#property}}{{/property}} syntax is used.

## 2. True Conditional Statements

True conditional statements are used when the result is to be executed only if the property's value is true.

Template
```
public class {{namePascalCase}} {

    {{#aggregateRoot.fieldDescriptors}}
        {{#isKey}}
        @Id
        {{/isKey}}
        private {{className}} {{nameCamelCase}};
    {{/aggregateRoot.fieldDescriptors}}
}
```
Template Result
```
public class Company {

    @Id
    private Long id;

    private String name;
}
```
![](https://github.com/msa-ez/platform/assets/123912988/4a47a7a4-cb96-4f7d-944b-4927be573373)

In the current context, the isKey attribute for aggregateRoot.

fieldDescriptors has a value of true for the id field and false for the name field. 

Using {{#isKey}}{{/isKey}}, the '@Id' annotation is added only for the id field.

## 3. False Conditional Statements

Opposite to {{#property}}{{/property}}, 

you can use {{^condition}}{{/condition}} or, alternatively, {{#unless condition}}{{/unless}} to execute a block of code only when a specific condition is false.


Template
```
public class {{namePascalCase}} {

    {{#aggregateRoot.fieldDescriptors}}
        {{^isVO}}
        {{#isKey}}
        @Id
        {{/isKey}}
        {{/isVO}}
        private {{className}} {{nameCamelCase}};
    {{/aggregateRoot.fieldDescriptors}}
}
```
Template Result
```
public class Company {

    @Id
    private Long id;

    private String name;
}
```

In this example, using {{^isVO}}{{/isVO}}, fields without values for isVO (in this case, id) are initially selected. 

Then, {{#isKey}}{{/isKey}} further refines the selection to only include id fields with a true isKey condition.

## 4. if ~ else ~

Conditional statements with if and else can yield different results based on whether the condition is true or false.

Use the {{#if condition}}{{else}}{{/if}} format. 

The code within {{#if condition}} will be executed if the condition is true; otherwise, the code within {{else}} will be executed.

Template
```
public class {{namePascalCase}} {

    {{#aggregateRoot.fieldDescriptors}}
        {{#if isKey}}
        @Id
        private {{className}} {{nameCamelCase}};
        {{else}}
        private {{className}} {{nameCamelCase}};
        {{/isKey}}
    {{/aggregateRoot.fieldDescriptors}}
}
```
Template Result
```
public class Company {

    @Id
    private Long id;

    private String name;
}
```
In this example, {{#if isKey}} ensures that '@Id' is added only for the id field if the condition is true. 

If the condition is false, as in the case of the name field, the code within {{else}} is executed, resulting in 'private String name;'.
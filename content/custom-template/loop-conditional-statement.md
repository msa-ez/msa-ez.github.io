---
description: ''
sidebar: 'started'
---

When inspecting data generated through 'Model Explorer,' you may encounter not only key-value pairs but also objects or arrays. 

To extract information from data created as objects or arrays, you can use loops to iterate through the data, executing the same code block multiple times to retrieve each set of internal data.

## 1. # Iteration

Use {{#iterableObject}}{{/iterableObject}} to iterate through objects or arrays. The iterableObject can be an object or an array.

```
fieldDescriptors: 
[
    {'name': 'id'},
    {'nameCamelCase': 'id'},
    {'className': 'Long'}
    {'isKey': true}
],
[
    {'name': 'userId'},
    {'nameCamelCase': 'userId'},
    {'className': 'String'}
    {'isKey': false}
],
[
    {'name': 'productName'},
    {'nameCamelCase': 'productName'},
    {'className': 'String'}
    {'isKey': false}
]
```

You can access Aggregate's fields using aggregateRoot.fieldDescriptors, and this data is structured as an array. 

To retrieve information for each field, use the following approach:

Template
```
{{#aggregateRoot.fieldDescriptors}}
    private {{className}} {{nameCamelCase}};
{{/aggregateRoot.fieldDescriptors}}
```

Template Result
```
private Long id;

private String userId;

private String productName;
```

## 2. each Iteration
You can use each to implement iteration, and the syntax is {{#each iterableObject}}{{/each}}.

Using each iteration, you can retrieve information about Aggregate's fields as follows:

Template
```
{{#each aggregateRoot.fieldDescriptors}}
    private {{{className}}} {{nameCamelCase}};
{{/each}}
```

Template Result
```
private Long id;

private String userId;

private String productName;
```

Conditional statements are useful when you need to retrieve the appropriate result based on a specific attribute or situation. Typically, {{#attribute}}{{/attribute}} is used.

## 3. Truthy Conditional Statement

Truthy conditional statements are used when you want to execute the code block only if the result of the attribute is true. Below is an example of using {{#attribute}}{{/attribute}} to generate '@Id' for a specific field:

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
public class Order {

    @Id
    private Long id;

    private String userId;

    private String productName;
}
```
Currently, the data for aggregateRoot.fieldDescriptors has true for the isKey attribute in the id field and false for the name field. 

By using {{#isKey}}{{/isKey}}, '@Id' is generated only for the id field with a true value.

## 4. Falsy Conditional Statement
In contrast to {{#attribute}}{{/attribute}}, you can use {{^ attribute}}{{/attribute}} or {{#unless attribute}}{{/unless}} for situations where the attribute is false. 

Below is an example of combining the previous truthy conditional statement with a falsy one:

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
public class Order {

    @Id
    private Long id;

    private String userId;

    private String productName;
}
```

In the current data for aggregateRoot.fieldDescriptors, the id field does not have a value for isVO, and the name field has an empty value. 

By using {{^isVO}}{{/isVO}}, we first select fields that are not VO, and then using {{#isKey}}{{/isKey}}, we further select id fields with true for isKey.

## 5. if ~ else ~

You can obtain different results based on the truth or falsity of the condition with conditional statements. 

Use {{#if condition}}{{else}}{{/if}}, where the code block below {{if condition}} is executed if the condition is true, and the code block below {{else}} is executed if the condition is false. 

Here's an example:

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
public class Order {

    @Id
    private Long id;

    private String userId;

    private String productName;
}
```
In this example, {{#if isKey}} ensures that '@Id' is added only for fields that satisfy the condition, while fields that do not meet the condition do not have '@Id'.
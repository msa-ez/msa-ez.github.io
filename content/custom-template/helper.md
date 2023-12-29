---
description: ''
sidebar: 'started'
---
# Helper

### 1.1 Helper

Now, let's discuss how to return results in a template using helpers.

A helper refers to a predefined function that returns the desired result through logic defining specific conditions. It is often referred to as a 'helper function.'


### 1.2 Filtering Data Using Helpers
In the previous step, we explained how to generate the '@Id' for the id field with 'isKey' set to true in Company.java. 

Now, we'll use a helper to dynamically set annotations for fields.

Helpers are used in the form of {{#HelperName arguments}}{{/HelperName}}, where arguments represent data sent to the helper function to perform its task.

Template
```
public class {{namePascalCase}} {

    {{#aggregateRoot.fieldDescriptors}}
        {{^isVO}}
        {{#isKey}}
        @Id
        {{#checkClassType ../aggregateRoot.fieldDescriptors}}{{/checkClassType}}
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
}
```
The 'checkClassType' helper takes 'aggregateRoot.fieldDescriptors' as an argument, representing the fields of the Aggregate. 

It selects fields with the className 'Long' and returns the result '@GeneratedValue(strategy = GenerationType.AUTO)'.

In this example, 'checkClassType' is enclosed within {{^isVO}}{{#isKey}}{{/isKey}}{{/isVO}} conditional statements. 

Even if multiple fields have the className 'Long,' the 'checkClassType' helper is applied only to the id field based on the conditions, resulting in the desired annotation for the Long-type id field.

## 2. Global Helper

Global helpers are predefined helper functions embedded by MSAEZ, available globally in templates.

### 2.1 ifNotNull
'ifNotNull' is used when displaying the displayName.

If the displayName is set for a sticker, you can use it as follows:

![](https://github.com/msa-ez/platform/assets/123912988/9a6ee441-4177-4d1e-ac04-8e8ab1f0ae53)

Template
```
{{#aggregates.fieldDescriptors}}
    {{#ifNotNull displayName name}}{{/ifNotNull}}
{{/aggregates.fieldDescriptors}}
```
Template Result
```
회사정보
```
In this example, the 'ifNotNull' helper checks the presence of displayName by sending it as an argument. 

Since displayName is set to '회사정보,' the result is '회사정보.'


### 2.2 checkVO

'checkVO' determines the presence of a Value Object (VO) and executes a specific code block only for VOs.

When a VO is set for a field, you can use it like this:

![](https://github.com/msa-ez/platform/assets/123912988/1cb0079c-1bd3-43c3-8967-a597b2f7d22d)

Template
```
{{#aggregates.fieldDescriptors}}
    {{#checkVO className}}
    @embedded
    private {{className}} {{nameCamelCase}};
    {{/checkVO}}
{{/aggregates.fieldDescriptors}}
```
Template Result
```
@embedded
private Address address;
```
In this example, 'checkVO' takes 'className' as an argument. 

If a field with a className matching a predefined VO name (e.g., 'Address') exists, the code block below '@embedded' is executed. 

The result is the generation of the 'Address' field with the '@embedded' annotation.


### 2.3 ifEquals

'ifEquals' evaluates a field attribute and executes a code block based on whether the condition is met.

When evaluating an attribute within a field, you can use it as follows:

Template
```
{{#aggregates.fieldDescriptors}}
{{#ifEquals isVO "true"}}
    @embedded
    private {{className}} {{nameCamelCase}}
{{/ifEquals}}
{{/aggregates.fieldDescriptors}}

```
Template Result
```
@embedded
private Address address;
```
In this example, 'ifEquals' is used to evaluate the 'isVO' attribute. 

If 'isVO' is equal to "true," the code block below '@embedded' is executed. 

This ensures that the '@embedded' annotation is added only for fields marked as VOs.


### 2.4 attached
'attached' retrieves information about another sticker attached to the base sticker.

When different stickers are attached during the modeling phase, you can use it as follows:

![](https://github.com/msa-ez/msa-ez-kor.github.io/assets/123912988/a2f63204-bd65-4d15-ad36-ef59c6240b51)

Template
```
{{#attached 'View' this}}
    {{name}}
{{/attached}}
```

Template Result
```
CompanyQuery 
```

In this example, the 'attached' helper is used with the argument 'View,' representing the type of the attached sticker. 

It checks the attached sticker's type based on the base sticker (in this case, an Aggregate) and retrieves information from the attached sticker (in this case, a View).

### 2.5 outgoing

'outgoing' is used to retrieve information about stickers connected through an outgoingRelation.

When different stickers have an outgoingRelation, you can use it as follows:

![](https://github.com/msa-ez/platform/assets/123912988/bf57b4e0-93f2-4485-9666-21e6627f5444)

Template
```
// User.java
{{#outgoing 'Aggregate' this}}
    {{name}}
{{/outgoing}}
```

Template Result
```
Company
```

In this example, the 'outgoing' helper takes 'Aggregate' as an argument, representing the type of the connected sticker. 

It checks if an outgoingRelation is formed and retrieves information from the connected sticker (in this case, an Aggregate).

### 2.6 incoming
'incoming' is the opposite of 'outgoing' and is used to retrieve information about stickers connected through an incomingRelation.

When different stickers have an incomingRelation, you can use it as follows:

Template
```
// Company.java
{{#incoming 'Aggregate' this}}
    {{name}}
{{/incoming}}
```

Template Result
```
User
```

In this example, the 'incoming' helper takes 'Aggregate' as an argument, representing the type of the connected sticker. 

It checks if an incomingRelation is formed and retrieves information from the connected sticker (in this case, a User).

### 2.7 reaching

'reaching' is used to retrieve information about stickers connected through a relation.

When different stickers have a relation, you can use it as follows:

![](https://github.com/msa-ez/platform/assets/123912988/dccd01a2-bc0f-4367-87af-8c30cc6c5f2d)

Template
```
//CompanyCreated.java
{{#reaching 'Command' this}}
    {{nameCamelCase}}
{{/incoming}}
```

Template Result
```
createUser
```
The 'reaching' helper takes 'Command' as an argument, representing the type of the connected sticker.
 
It checks if a relation is formed and retrieves information from the connected sticker (in this case, a Command).
---
description: ''
sidebar: 'started'
---
Global Helpers in MSAEZ are pre-defined helper functions embedded by the platform, accessible globally within templates. 

## 1. Attribute Evaluation

Here, we'll introduce some Global Helpers that evaluate attributes and return results based on conditions.

### 1.1 ifNotNull

The ifNotNull Global Helper is used when displaying the displayName. Assuming the displayName of the Order Aggregate sticker is set to 'OrderInfo,' you can use it as follows:

Template
```
{{#ifNotNull displayName name}}{{/ifNotNull}}
```
Template Result
```
OrderInfo
```

The ifNotNull helper evaluates the existence of displayName by sending both displayName and name as arguments. In this case, since displayName exists as 'OrderInfo,' the result is 'OrderInfo.'

### 1.2 ifEquals

The ifEquals Global Helper evaluates attributes within a field and executes a code block if the conditions match. 

If we evaluate the isKey attribute within the field descriptors, the template might look like this:

Template
```
{{#aggregates.fieldDescriptors}}
{{#ifEquals isKey "true"}}
    @Id
    private {{className}} {{nameCamelCase}}
{{/ifEquals}}
{{/aggregates.fieldDescriptors}}

```
Template Result
```
@Id
private Long id;
```
In this example, ifEquals is used to evaluate the isKey attribute within the aggregates.fieldDescriptors. 

The code block is executed only for the field with isKey as "true," resulting in the generation of the @Id annotation for the id field.



### 1.3 checkVO

The checkVO Global Helper determines the existence of a Value Object (VO) and executes a specific code block only for VO fields. 

Assuming 'Address' is a predefined VO, the usage might look like this:

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
The checkVO helper checks if the className matches any predefined VO names ('Address', 'Payment', 'Weather', 'Money', 'Email', 'Photo'). 

In this case, since 'Address' matches, the code block is executed for the Address field.

## 2. Retrieving Information Based on Sticker Relationships

In template files, there are instances where you need information not only from stickers specified in a forEach loop but also from other stickers. 

In the context of the provided modeling example, we'll introduce Global Helpers that allow you to retrieve information based on sticker relationships.

![](https://github.com/msa-ez/platform/assets/123912988/274407a9-f06d-4d39-ae37-76fce4a39a5b)

### 2.1 attached
The attached helper is used when you want to retrieve information about stickers attached to the base sticker. 

When there are different stickers attached during the modeling stage, you can use it as follows:

Template
```
{{#attached 'Event' this}}
    {{name}}
{{/attached}}
```

Template Result
```
OrderPlaced 
```

To use the attached helper, you need to send the sticker type of the attached sticker as an argument. 

In this example, the type 'Event' is sent as an argument. The attached helper then identifies the attached sticker type, allowing you to retrieve information about the 'OrderPlaced' sticker.

### 2.2 outgoing

The outgoing helper is employed when you want to obtain information about stickers connected through an outgoingRelation. 

If there is an outgoingRelation between the Command sticker 'order' and the Event sticker 'OrderPlaced,' you can use it as follows:

Template
```
{{#outgoing 'Event' this}}
    {{nameCamelCase}}
{{/outgoing}}
```

Template Result
```
orderPlaced
```

To use the outgoing helper, you send the type of the connected sticker as an argument. 

In this case, the Command sticker 'order' is connected to the Event sticker 'OrderPlaced' through an outgoingRelation, and 'Event' is sent as the argument. 

The outgoing helper checks if the outgoingRelation is formed and retrieves information about the connected Event sticker 'OrderPlaced.'

### 2.3 incoming

The incoming helper functions in the opposite way of outgoing and retrieves information about stickers connected through an incomingRelation. 

Suppose there is an incomingRelation from the Event sticker 'OrderPlaced' to the Command sticker 'order.' You can use it as follows:

Template
```
{{#incoming 'Command' this}}
    {{namePascalCase}}
{{/incoming}}
```

Template Result
```
Order
```

To use the incoming helper, you send the type of the connected sticker as an argument. 

In this example, an incomingRelation is formed from the Event sticker 'OrderPlaced' to the Command sticker 'order,' and 'Command' is sent as the argument. 

The incoming helper checks if the incomingRelation is formed and retrieves information about the connected Command sticker 'order.'

### 2.4 reaching

The reaching helper is employed when you want to obtain information about the last sticker in a sequence of stickers connected through relations. 

If there is a sequence from the Command sticker 'order' to the Event sticker 'DeliveryStarted,' you can use it as follows:

Template
```
{{#reaching 'Event' this}}
    {{nameCamelCase}}
{{/incoming}}
```

Template Result
```
deliveryStarted
```
To use the reaching helper, you send the type of the sticker from which you want to retrieve information as an argument.

In this case, the Command sticker 'order' is connected to the Event sticker 'DeliveryStarted,' and 'Event' is sent as the argument. 

The reaching helper checks the formed relations to determine the last sticker in the sequence and retrieves information about the connected Event sticker 'DeliveryStarted.'
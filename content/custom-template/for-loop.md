---
description: ''
sidebar: 'started'
---
# For-Loop

## 1. What is a For-Loop?

Data comes in various forms, including key-value pairs and objects or arrays. 

In order to retrieve information about each piece of data within objects or arrays, for-loops can be utilized. 

A for-loop is employed when you need to execute the same code block multiple times.



## 2. # For-Loop

A for-loop is utilized with {{#iterableObject}}{{/iterableObject}} to retrieve information about each piece of data within an iterable object.

```
fieldDescriptors: 
[
    {'name': 'id'},
    {'nameCamelCase': 'id'},
    {'className': 'Long'}
    {'isKey': true}
],
[
    {'name': 'name'},
    {'nameCamelCase': 'name'},
    {'className': 'String'}
    {'isKey': false}
]
```

To access the data for Aggregate's fields using aggregateRoot.

fieldDescriptors, where the data is organized in arrays according to the number of fields declared, you can write as follows:

Template
```
public class {{namePascalCase}} {

    {{#aggregateRoot.fieldDescriptors}}
        private {{className}} {{nameCamelCase}};
    {{/aggregateRoot.fieldDescriptors}}
}
```

Template Result
```
public class Company {

    private Long id;

    private String name;
}
```

## 3. Each For-Loop

The each for-loop can be used with each, in the form of {{#each iterableObject}}{{/each}}.

Template
```
public class {{namePascalCase}} {

    {{#each aggregateRoot.fieldDescriptors}}
        private {{{className}}} {{nameCamelCase}};
    {{/each}}
}
```

Template Result
```
public class Company {

    private Long id;

    private String name;
}
```
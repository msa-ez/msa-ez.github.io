---
description: ''
sidebar: 'started'
---
# Helper

This is an explanation of how to return values from template files using helpers.

A helper refers to a pre-defined type of function that returns the necessary result through logic configured for specific conditions. It is also known as a 'helper function.'

The usage of a helper is as follows:

```
{{#HelperName argument}}{{/HelperName}}

<funtion>
window.$HandleBars.registerHelper('HelperName', function (Helper에 전달된 인자값) {
    
   <code to perform helper's operation>
    
    return <result to be returned>;
});
</function>
```

Firstly, a helper can be declared in the form of {{#HelperName argument}}{{/HelperName}}. 

Next, declare the helper function corresponding to 'HelperName' in the <function> block. In this block, you can specify the operations of the helper function and declare the result to be returned, which can then be used to return the desired value.

Here, the argument represents the data sent to the helper function and plays a role in assisting the operation of the function.


## Data Filtering Using Helpers
In the previous explanation, we discussed how to generate '@Id' for the id field in Order.java with iskey set to true for each field.

Now, let's explore how to set data (annotations) using helpers.

Template
```
public class {{namePascalCase}} {

    @Id
    {{#addIdAnnotation aggregateRoot.fieldDescriptors}}{{/addIdAnnotation}}
    private {{className}} {{nameCamelCase}};
}

<function>
window.$HandleBars.registerHelper('addIdAnnotation', function (fieldDescriptors) {
    for(var i = 0; i < fieldDescriptors.length; i ++ ){
        if(fieldDescriptors[i] && fieldDescriptors[i].className == 'Long'){
            return "@GeneratedValue(strategy=GenerationType.AUTO)";
        }
    }
    return "";
});
</function>
```
Template Result
```
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String userId;

    private String productName;
}
```
Looking at the argument of the 'addIdAnnotation' helper, it sends aggregateRoot.fieldDescriptors. In this case, the addIdAnnotation function declared in the <function\> block returns a result only for fields with className 'Long'.

Here, the 'addIdAnnotation' helper is applied only to the Id field, so you can see that the annotation is generated only for the Id field.


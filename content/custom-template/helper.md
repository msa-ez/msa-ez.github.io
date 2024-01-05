---
description: ''
sidebar: 'started'
---
Let's delve into how to utilize helpers in Handlebars templates to generate desired output. Helpers are predefined functions that return a result based on specified conditions or logic, often used for more complex processing within templates. Here's how you can use helpers:

```
{{#HelperName argument}}{{/HelperName}}

<funtion>
window.$HandleBars.registerHelper('HelperName', function (Helper에 전달된 인자값) {
    
   <code to perform helper's operation>
    
    return <result to be returned>;
});
</function>
```

Begin by declaring a helper in the form of {{#HelperName argument}}{{/HelperName}}. 

Subsequently, define the corresponding helper function in the <function\> block, specifying the operations to be performed and the result to be returned.

The argument here refers to the data you want to send to the helper function, aiding in its operations.


## 2 Filtering Data Using Helpers
In a previous explanation, we discussed how to generate '@Id' for the id field with isKey set to true in Company.java. Now, let's explore using a helper to set data annotations.

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
In the 'addIdAnnotation' helper, the argument is set to aggregateRoot.fieldDescriptors. 

The helper function addIdAnnotation checks each field descriptor, and if the className is 'Long', it returns the annotation @GeneratedValue(strategy=GenerationType.AUTO).

Here, the 'addIdAnnotation' helper is selectively applied only to the Id field, resulting in the creation of annotations solely for the Id field.


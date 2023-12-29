---
description: ''
sidebar: 'started'
---
# 조건문

## 1. 조건문이란?

조건문은 특정 속성이나 상황에 대해 판별하여 상황에 맞는 결과값을 가져올 때 사용할 수 있습니다.

일반적으로 {{#속성}}{{/속성}}를 사용할 수 있습니다.

## 2. 참 조건문

참 조건문은 속성의 결과값이 true인 경우에만 하단의 코드블록을 실행할 때 사용할 수 있습니다.

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

현재 aggregateRoot.fieldDescriptors의 isKey에 대하여 id필드는 true의 값을, name필드는 ""의 값을 가지고 있습니다.

이때, {{#isKey}}{{/isKey}}를 통해 isKey의 데이터인 id필드에만 '@Id'가 생성되도록 설정할 수 있습니다.

## 3. 거짓 조건문

{{#속성}}{{/속성}}과 반대로 특정 속성에 대하여 거짓인 경우에만 하단의 블록을 실행할 때 사용할 수 있습니다.

일반적으로 {{^ 조건문}}{{/조건문}}으로 사용하며, {{#unless 조건문}}{{/unless}}를 통해서도 조건이 거짓인 경우에 대해 설정할 수 있습니다.


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

현재 aggregateRoot.fieldDescriptors의 isVO에 대한 데이터로 id필드는 값이 존재하지 않으며, name필드는 ""로 나타나고 있습니다.

따라서 {{^isVO}}{{/isVo}}를 통해 필드의 속성중 isVO가 false 조건에 부합하는 id, name필드를 1차로 선별한 후,

{{#isKey}}{{/isKey}}를 통해 isKey가 true인 id필드를 2차로 선별하였습니다.

즉, 두 조건문을 사용하여 VO필드가 아니면서 동시에 key값을 가진 필드 id에만 @Id가 생성되는 것을 확인할 수 있습니다.

## 4. if ~ else ~

조건문의 참과 거짓에 따라 서로 다른 결과값을 가져올 수 있습니다.

{{#if 조건문}}{{else}}{{/if}}의 형태로 사용 가능하며, {{if 조건문}}에 부합될 경우 하단의 블록 코드가 실행되고,

조건에 부합되지 않을 경우 {{else}} 하단의 블록 코드가 실행됩니다.

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
예시를 보면 {{#if isKey}}를 통해 조건에 부합한 id필드에만 '@Id'가 추가되도록 설정하였고,

조건에 부합하지 않은 name 필드의 경우 {{else}}조건에 부합되어 'private String name;'만 결과값으로 반환되는것을 확인할 수 있습니다.
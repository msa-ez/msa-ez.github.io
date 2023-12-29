---
description: ''
sidebar: 'started'
---
# 반복문

## 1. 반복문이란?

데이터는 키-값의 유형도 있지만 객체나 배열의 유형도 존재합니다. 

이때 객체나 배열에 대해 각각의 데이터에 대한 정보를 가져오기 위해서 반복문을 사용할 수 있습니다.

반복문은 동일한 코드 블록을 여러 번 실행할때 사용할 수 있습니다.



## 2. # 반복문

반복문은 {{#반복가능한객체}}{{/반복가능한객체}}로 사용하여 반복가능한 객체에 대하여 각각의 데이터에 대한 정보를 가져올 수 있습니다.

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

Aggregate의 필드는 aggregateRoot.fieldDescriptors로 접근할 수 있는데 해당 데이터는 필드에 선언한 수 만큼 배열로 구성되어있습니다.

이때 각 필드에 맞게 Aggregate의 필드를 생성하기위해서는 다음과 같이 작성할 수 있습니다.

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

## 3. each 반복문

each를 통해서 반복문을 사용가능하며, {{#each 반복가능한 객체}}{{/each}}의 형태로 사용할 수 있습니다.

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
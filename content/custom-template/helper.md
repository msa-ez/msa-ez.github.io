---
description: ''
sidebar: 'started'
---
# Helper

### 1.1 Helper 란?

이번에는 helper를 통해 template에서 결과값을 반환하는 방법에 대해 설명하겠습니다.

helper란 특정 조건을 구성하는 로직을 통해 필요한 결과값을 반환하는 미리 정의된 일종의 function을 의미하며 'helper function'이라고도 불립니다.


### 1.2 Helper를 활용한 데이터 필터링
이전단계에서 Company.java의 각 필드중 iskey가 true인 id 필드에 @Id를 생성하는 방법에 대해 설명하였습니다.

이번에는 Helper를 통해 데이터(어노테이션)를 설정하는 방법에 대해 설명하겠습니다.

먼저 Helper는 {{#HelperName 인자값}}{{/HelperName}}의 형태로 사용되고 있습니다. 

여기서 인자값은 helper function으로 보낼 데이터를 의미하며 함수의 작업을 수행하는 것에 도움을 주는 역할을 하고 있습니다.

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
'checkClassType' helper의 인자값을 보면 aggregateRoot.fieldDescriptors를 보내고 있습니다. 즉, Aggregate의 필드들을 인자값으로 보내게 됩니다.

이중 className이 'Long'인 필드를 선별하여 결과값으로 '@GeneratedValue(strategy = GenerationType.AUTO)'를 반환하게 됩니다.

예시의 경우 'checkClassType'이 {{^isVO}}{{#isKey}}{{/isKey}}{{/isVO}}조건문으로 감싸져있습니다. 

각각의 필드중 className이 'Long'을 가지고 있더라도 조건에 의해 id필드에만 'checkClassType' helper가 적용되며, 조건에 성립하여 Long타입의 id필드 위에 결과값이 반환된 것을 확인할 수 있습니다.

## 2. Global Helper 란?

Global Helper란 MSAEZ가 사전 정의하여 내장하고 있는 helper function으로 템플릿 전역에서 사용가능합니다.

### 2.1 ifNotNull
'ifNotNull'은  displayName을 출력할 때 사용합니다.

스티커의 displayName을 설정한 경우 아래와 같이 사용할 수 있습니다.

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

ifNotNull의 인자값으로 displayName과 name을 보내 displayName의 존재여부를 판단하고있습니다.

여기서는 displayName이 '회사정보'로 존재하고 있기 때문에 결과값으로 '회사정보'가 출력되는 것을 확인할 수 있습니다.


### 2.2 checkVO

'checkVO'는 VO의 존재여부를 파악하여 VO에 한해서만 특정 코드블록을 실행할 때 사용할 수 있습니다.

필드에 VO를 설정한 경우 아래와 같이 사용할 수 있습니다.

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
checkVO의 인자값으로 className을 보내고 있습니다.

이후 사전에 VO로 지정한 이름과 일치한 className이 존재할 경우 하단의 코드블록을 실행됩니다.

여기서는 VO로 지정된 Address가 있기 때문에 하단의 코드가 생성된 것을 확인할 수 있습니다.


### 2.3 ifEquals
ifEquals는 필드내에 속한 속성을 평가하여 조건에 부합되는 경우 코드블록을 실행할 때 사용할 수 있습니다.

필드내에 평가할 속성이 존재한다면 아래와 같이 사용할 수 있습니다.

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
ifEquals의 인자값으로는 평가할 속성과 평가할 내용을 보내야 합니다.

예시에서는 aggregates.fieldDescriptors에 존재하는 필드들의 속성중 isVO를 평가할 속성으로 보내고 평가할 내용으로 "true"를 보내었습니다.

여기서 'ifEquals'를 사용하여 isVO의 값이 "true"와 일치하는 필드에 한해서만 아래의 코드블록이 실행되도록 설정할 수 있으며

결과적으로 VO로 설정한 Address만 ifEquals의 조건에 해당되어 코드가 생성되는것을 확인할 수 있습니다.


### 2.4 attached
'attached'는 기준이 되는 스티커에 부착된 다른 스티커의 정보를 불러올 때 사용할 수 있습니다.

모델링 단계에서 서로다른 부착된 스티커가 있다면 아래와 같이 사용가능합니다.

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

예시처럼 'attached' helper를 사용하기 위해서는 인자값으로 부착된 스티커의 타입을 보내야 합니다.

여기서는 ReadModel스티커의 타입이 View로 설정되어 있어 인자값으로 View를 보냈습니다. 

이때, Aggregate 스티커 기준 부착된 스티커의 타입을 판별하고, View가 존재함으로써 ReadModel의 정보를 불러올 수 있게 됩니다.

### 2.5 outgoing

'outgoing'은 기준이 되는 스티커와 outgoingRelation 관게가 형성된 다른 스티커의 정보를 가져올 때 사용합니다.

모델링 단계에서 서로 다른 스티커가 outgoingRelation관계가 형성되어있다면 아래와 같이 사용가능합니다.

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

예시처럼 'outgoing' helper를 사용하기 위해서는 인자값으로 연결된 스티커의 타입을 보내야 합니다.

여기서는 참조할 Company의 스티커 타입이 Aggregate로 설정되어 있어 인자값으로 Aggregate로 보냈습니다.

이때, outgoingRelation관계가 형성 되어 있는지를 판별하고 형성 되어 있다면 형성된 스티커의 정보를 불러오게 되어 Company 정보를 불러올 수 있게 됩니다.

### 2.6 incoming
'incoming'은 'outgoing'과 반대로 기준이 되는 스티커와 incomingRelation관게가 형성된 스티커의 정보를 가져올 때 사용합니다.

모델링 단계에서 서로 다른 스티커가 incomingRelation 형성되어있다면 아래와 같이 사용가능합니다.

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

예시처럼 'incoming' helper를 사용하기 위해서는 인자값으로 연결된 스티커의 타입을 보내야 합니다.

여기서는 참조할 User의 스티커 타입이 Aggregate로 설정되어 있어 인자값으로 Aggregate로 보냈습니다.

이때 incomingRelation관계가 형성된 스티커의 타입을 확인하고 일치하면 형성된 스티커 User의 정보를 불러올 수 있게 됩니다.

### 2.7 reaching

'reaching'은 기준이 되는 스티커와 relation관계가 형성된 다른 스티커의 정보를 불러올 때 사용할 수 있습니다.

모델링에서 서로 다른 두 스티커에 relation 관계가 형성되어 있다면 아래와 같이 사용할 수 있습니다.

![](https://github.com/msa-ez/platform/assets/123912988/dccd01a2-bc0f-4367-87af-8c30cc6c5f2d)
위의 그림처럼 Event 스티커에서 Command 스티커로 Req/Res관계가 형성된 모델링이 있습니다.

여기서 Event 스티커 기준 연결된 Command스티커의 정보를 가져오기 위해서 reaching을 사용할 수 있습니다.

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
'reaching'을 사용하기 위해서는 인자값으로 연결된 Command 스티커의 타입을 보내야 하며

CompanyCreated 이벤트스티커와 연결된 createuser Command스티커의 타입인 'Command'가 인자값에 해당됩니다.

'reaching'을 사용하여 기준이 되는 파일과 outgoingRelation관계가 형성된 스티커가 있을 경우 해당 스티커의 정보를 불러오게 되는데,

여기서 CompanyCreated Command스티커 기준 createuser Command스티커와 outgoingRelation관계를 형성하고 있어 결과적으로 createuser Command스티커의 정보를 가져오게 됩니다.
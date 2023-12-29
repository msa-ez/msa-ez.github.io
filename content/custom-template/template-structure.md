---
description: ''
sidebar: 'started'
---
# 템플릿 구조

## 1. Metadata 정의

커스텀 템플릿을 생성하기위해서는 먼저 파일 최상단에 metadata를 선언합니다.  

metadata란 템플릿이 데이터를 반복하는 방식, 생성되는 파일의 유형 및 위치, 그 외 설정할 옵션 등을 의미합니다.

Template
```
forEach: Aggregate
fileName: {{namePascalCase}}.java
path: {{boundedContext.name}}/{{{options.packagePath}}}/domain
---
```

### 1.1 파일 유형 설정
여기서 forEach를 통해 템플릿이 생성될 파일의 유형을 설정합니다.

forEach의 값으로는 이벤트스티커들을 가져올 수 있으며 여기서는 Aggregate 기준으로 설정하였습니다.

### 1.2 파일 이름 정의 

그 다음 fileName을 통해 생성될 파일의 이름을 설정합니다.

fileName을 {{namePascalCase}}.java로 지정하였기 때문에 이 파일이 Company.java로 생성됩니다.

### 1.3 파일 경로 설정

마지막으로 path를 통해 Company.java가 생성될 경로를 설정합니다.

현재 {{boundedContext.name}}/{{{options.packagePath}}}/domain로 설정함으로써 해당 Aggregate가 속한 BoundedContext의 하위 폴더 domain에 Company.java 파일이 생성됩니다.

metadata의 옵션 설정들이 완료되면 하단에 작성할 템플릿코드와 분리되기 위해 마지막 메타데이터의 하단에 하이푼('---')처리를 입력하면 metadata설정이 완료됩니다.


## 2. Mustache 정의

### 2.1 Mustache 구문

템플릿 파일에서 데이터를 동적으로 변화하기 위해 Mustache ('{{}}')를 사용하며 내부에 데이터를 입력하여 동적으로 변화할 수 있습니다.

![](https://github.com/msa-ez/platform/assets/123912988/ce7a779a-ecb9-4b07-bdbb-7113dca67ba3)

모델링한 Aggregate 스티커의 이름을 통해 Java의 클래스를 생성하러면 다음과 같이 작성할 수 있습니다..

Template
```
public class {{name}} {

}
```
Template Result
```
public class Company {

}
```

### 2.2 네이밍 컨벤션

스티커의 이름을 가져올 때, 네이밍컨벤션을 활용하여 다양한 결과값을 반환할 수 있습니다.

Template
```
{{nameCamelCase}}

{{namePascalCase}}
```
Template Result
```
company

Company
```

예시에서는 Aggregate 스티커의 이름을 네이밍컨벤션으로 nameCamelCase와 namePascalCase를 이용하여 'company'와 'Company'로 결과값을 반환하여 필요한 상황에 맞게 데이터를 가져올 수 있습니다.

## 3. Mustache 데이터 접근

### 3.1 데이터 내부 속성 접근

일반적으로 기준이 되는 스티커의 데이터에 접근할 때는 {{데이터}}의 형식으로 접근 가능합니다.

하지만 특정 데이터의 내부에 있는 데이터 속성에 접근할 때는 '.'을 이용하며, 

{{데이터.내부속성}}로 작성할 수 있습니다.

Template
```
{{aggregateRoot.keyFieldDescriptor.name}}
```
Template Result
```
id
```
Aggregate 스티커의 필드 중, 현재 id 필드가 keyField로 설정되어 있습니다. 

따라서 id필드의 이름을 가져오기 위해서는 aggregateRoot 내부의 keyFieldDescriptor에 존재하는 name의 데이터를 가져올 수 있습니다.

### 3.2 데이터 외부 속성 접근

내부 데이터로 접근하는 것과 반대로 외부 데이터의 속성에 접근해야할 때가 있습니다.

이때, 외부 범위의 데이터를 접근하기 위해서는 '../'를 이용하며, {{../외부데이터}}로 작성할 수 있습니다.

Template
```
{{#aggregateRoot}}
    {{../name}}
{{/aggregateRoot}}
```
Template Result
```
Company
```
예시에서 Aggregate의 내부 속성인 aggregateRoot로 접근함에 따라 Aggregate 스티커의 이름을 가져오려면 외부 속성으로 접근해야합니다.

따라서 {{../name}}를 사용하여 상위 속성으로 이동하여 Aggregate의 이름을 가져올 수 있습니다.
---
description: ''
sidebar: 'started'
prev: '/started/writing-content/'
next: '/started/settings/'
---
# 도메인 주도 설계 학습

## MSA 분석기법 – DDD(Domain Driven Design)

## DDD 개요

 소프트웨어의 개발이 어려운 이유는 업무의 복잡성에서 시작된다. 개발자가 소프트웨어를 구현하는 복잡성보다 소프트웨어로 
구현하고자 하는 기능에 대한 본질적인 복잡성이 더 크다.

 그래서 업무를 가장 잘 이해하는 해당분야 전문가와 개발자 사이의 소통을 중심으로 특정 도메인을
개념적으로 표현한 모델을 통해, 여러 관계자들이 동일한 모습으로 도메인을 이해하고, 도메인 지식을 공유하는 것이 중요하다.
고객의 요구사항이 모델로 유연하게 설계되고, 이 모델로부터 구현이 자연스럽게 연결되어야 한다는 사상이 **Domain
Driven Design** 이다.

 이때, 가장 중요한 점은 여러 하위 도메인을 하나의 다이어그램에 모델링하면 안되고, 각 하위 도메인마다 별도로 모델을
만들어야 한다. 모델의 각 구성요소는 특정 도메인으로 한정할 때, 비로소 의미가 명확해지기 때문이다.


### 도메인 모델

  도메인 모델이란 특정 도메인을 개념적으로 표현한 것이다. 예를 들어, 쇼핑몰의 주문 도메인은 쇼핑몰에서 주문하기 위해 상품 수량을
 선택하고, 배송지 정보를 입력한다. 선택한 상품 가격과 수량으로 지불 금액을 계산하고 결제 수단을 선택한다. 
 
 주문한 뒤에도 배송 전이면 배송지 주소를 변경하거나 주문을 취소할 수 있다. 이 주문 도메인을 객체 모델로 구성하면
 아래와 같다.
 
> ![](../../src/img/image6.png)
> <p align="center">그림 1 객체 기반 주문도메인 모델</p>

 위 그림은 객체를 이용한 도메인 모델이다. 도메인을 이해하려면 도메인이 제공하는 기능과 도메인의 주요 데이터 구성을 파악해야
하는데, 이런 면에서 객체 모델은 도메인을 모델링하기에 적합히다.

 위 객체 모델은 도메인의 모든 내용을 담고 있지는 않지만 이 모델을 보면 주문(Order)은 주문번호와 지불할 총 금액이
있고, 배송정보(Shipping Information)를 변경할 수 있음을 알 수 있다. 또한, 주문을 취소할 수 있다는 것도 알 수
있다. 즉, 도메인 모델을 사용하면 여러 관계자들이 동일한 모습으로 도메인을 이해하고 도메인 지식을 공유하는데 도움이 된다.

이러한 도메인은 다수의 하위 도메인으로 구성된다. 각 하위 도메인이 다루는 영역은 서로 다르기 때문에 같은 용어라도 하위
도메인마다 의미가 달라질 수 있다. 예를 들어, 상품 도메인 내에서 상품이 상품가격, 상품이미지 URL, 재고 수량
등의 상세 내용을 담고 있는 ‘정보’를 의미한다면 배송 도메인의 상품은 고객에게 실제 배송되는 ‘물리적인 상품’을 의미한다.

도메인에 따라 용어의 의미가 결정되므로, 여러 하위 도메인을 하나의 다이어그램에 모델링하면 안된다. 상품과 배송 도메인 모델을
구분하지 않고 하나의 다이어그램에 함께 표시한다면, 다이어그램에 표시한 ‘상품’은 상품 도메인의 상품인지, 배송 도메인의
상품인지 제대로 이해하기가 힘들다.

모델의 각 구성요소는 특정 도메인을 한정(Bounded)할 때, 비로소 의미(Context)가 완전해지기 때문에, ‘상품’의
의미가 통용되는 경계를 구분(Boundary Definition)하고 그 경계 내에서 별도로 도메인 모델을 만들어야 한다.

---

### Bounded Context (한정된 문맥)

#### 도메인 모델과 경계

상품 도메인에서의 상품, 배송 도메인에서의 상품, 주문 도메인에서의 상품은 이름만 같지만 실제로 의미하는 것이 다르다. 상품
도메인에서의 상품은 상품 이미지, 상품명, 상품 가격, 상품 상세 설명과 같은 상품 정보가 위주라면 주문 도메인에서의
상품은 주문 대상이 되는 객체이며, 배송 도메인에서의 상품은 고객에게 배송되는 물리적 상품을 나타낸다. 또한, 상품 도메인에서
물리적으로 하나인 상품은 주문 및 배송 도메인에서는 여러 개 존재할 수 있다.

논리적으로 같은 존재처럼 보이지만, 하위 도메인에 따라 서로 다른 용어를 사용하는 경우도 있다. 시스템을 사용하는 사람을
회원도메인에서는 회원이라고 부르지만, 주문 도메인에서는 주문자라고 부르고, 배송 도메인에서는 보내는
사람이라 부르기도 한다.

SW 도메인과 건축 도메인에서도 동일한 용어지만 두 도메인 내에서의 의미가 서로 다른 예를 찾을 수 있는데, SW도메인에서의
‘프로젝트’가 현업이 요구하는 시스템을 개발하기 위한 전체 과정을 일컫는다면, 건축 도메인에서의 ‘프로젝트’는 사람이
주거하기 위한, 또는 생업에 필요한 건축물을 짓는 과정이다.

‘아키텍처’란 용어도 SW도메인에서는 서버, 네트워크, 소프트웨어 구성도나 ERD, UML과 같은 다이어그램 등을 지칭하나, 건축
도메인에서의 ‘아키텍처’는 건축물 구축에 필요한 평면도와 같은 설계 도면을 의미한다.

> ![](../../src/img/image7.png)
<p align="center">그림 2 동일 용어이나 서로 다른 도메인마다 상이한 의미</p>

이렇듯, 도메인마다 같은 용어라도 의미가 다르고, 같은 대상이라도 지칭하는 용어가 다를 수 있기 때문에 한 개의 모델로 모든
하위 도메인을 정확하게 표현할 수는 없으며, 올바른 도메인 모델을 개발하려면 하위 도메인마다 모델을 만들어야 한다.

이 때, 여러 하위 도메인이 섞이기 시작하면 모델의 의미가 약해지기 때문에, 각 모델은 명시적으로 구분되는 경계를 가져서 
서로 섞이지 않도록 해야 하는 것이 중요하다.

#### Bounded Context

모델은 특정한 경계 문맥(Context) 내에서 정확히 구분 가능한 완전한 의미를 가지는데, 이렇게 구분되는 경계를 DDD에서 **바운디드 컨텍스트(Bounded Context)** 라고 부른다. 

즉, 바운디드 컨텍스트는 동일한 컨텍스트의 범위를 표현하는 경계로 해당 경계 내에서 모델은 특정한 의미를 지니고 특정한 일을 수행한다.

바운디드 컨텍스트는 모델의 경계를 결정하며, 한 바운디드 컨텍스트는 논리적으로 하나, 또는 하나 이상의 모델을 갖는다. 

바운디드 컨텍스트는 도메인 구성원들이 사용하는 언어를 기준으로 구분 가능하다. 쇼핑몰의 ‘상품’, 및 ‘회원’ 이라는 용어에 대해, 
주문/결제 도메인과 배송 도메인 각각 서로 의미하는 바가 다르기 때문에, 두 도메인은 서로 다른 컨텍스트로 분리된다.


> ![https://cdn-images-1.medium.com/max/2400/1\*zfZayosLl8oSYOAtY-NYcQ.png](../../src/img/image8.png)
> <p align="center"> 그림 3 경계가 구분된 두 개의 바운디드 컨텍스트 </p>

바운디드 컨텍스트는 도메인 모델을 구분하는 경계가 되기 때문에 바운디드 컨텍스트는 구현하는 서브 도메인에 알맞은 모델을 포함한다.
같은 상품이라 하더라도 상품 바운디드 컨텍스트와 주문 바운디드 컨텍스트의 ‘상품’은 각 컨텍스트에 맞는 모델을 가진다.

### Ubiquitous Language (도메인 언어)

도메인 모델을 구분 짓는 경계인 바운디드 컨텍스트내에는 다양한 이해 관계자들이 존재한다. 도메인 업무에 능통한 도메인
전문가, 개발이 가능한 뼈대를 세우는 아키텍트, 실제 서브 도메인 서비스를 구축하는 개발자가 포함될 수 있으며, 이들은
담당하는 각 서브 도메인의 모든 권한을 가진다.
  
> <img src="../../src/img/image9.png" align="right" width="220" height="220"></img>
  
이러한 각 도메인별 소속 구성원들 간에는 원활한 의사 소통에 필요한 보편적 언어가 사용되는데 이를 도메인 언어, 또는 유비쿼터스
언어(Ubiquitous Language)라고 한다.


다시 말해, **한정된 맥락인 Bounded Context 내에서 협업 구성원들간 보편적으로 통용되는 도메인 언어가 유비쿼터스
언어**이다.

이러한 도메인 언어가 보편적이지 않다면, 개발자가 사용하는 용어를 도메인 전문가가 이해하지 못해, 도메인 전문가가 이해하는데 
추가 비용이 들어간다. 
  
  ---
  
> ![](../../src/img/image10.png)
> <p align="center">그림 8 유비쿼터스 언어는 바운디드 컨텍스트내에 통용되는 도메인 언어</p>

구성원들이 각자의 언어를 사용하는 경우, 의사소통이 힘들어 상대방이 내뱉은 단어를 내가 사용하는 단어로 번역해서
이해해야 하고, 서로 협의된 내용에 대해서도 각자 해석이 달라지지 않도록 수식어를 달아야 한다. 

의사소통은 물론, 이벤트스토밍, 도메인 모델링, 프로그램 개발에 이르기까지 일관된 용어로 소통, 문서작성 뿐만 아니라 코드개발까지
일관된 언어가 사용되어야 바운디드 컨텍스트의 경계가 견실하게 유지될 수 있는 것이다.

## DDD구현을 위한 이벤트스토밍 (EventStorming)

이벤트스토밍은 Event와 BrainStorming의 합성어로 Domain Expert와 개발 전문가가 함께 모여 워크샵 형태로
진행되는 방법론이다. DDD 방법론 중, 복잡한 UML다이어그램이나 도구 없이 수행할 수 있어 MSA를 구현하는데 가장 최적의
접근법이다.

이벤트스토밍은 시스템에서 발생하는 이벤트를 중심(Event-First)으로 분석하는 기법으로 특히, Non-Blocking,
Event-driven한 MSA 기반 시스템을 분석에서 개발까지 필요한 도메인에 대한 빠른 이해를 도모하는데 유리하다.

기존의 유즈케이스나 클래스 다이어그래밍 방식은 고객 인터뷰를 통해 요구사항을 정제하고, 상세 설계를 통한 엔티티 구조를 인지하는
방식이었으나, 이벤트스토밍은 별다른 사전 훈련된 지식과 도구없이 진행할 수 있다.

> ![](../../src/img/image11.png)
> <p align="center">그림 9 UML객체 기반 모델링과 이벤트스토밍 방법론 비교</p>

진행 과정은 참여자 워크숍 방식의 방법론으로 결과는 스티키 노트를 벽에 붙힌 것으로 결과가 남으며, 오렌지 스티키 노트들의 연결로
비즈니스 프로세스가 도출되고 이들을 이후 BPMN과 UML등으로도 정재하여 전환할 수 있다.
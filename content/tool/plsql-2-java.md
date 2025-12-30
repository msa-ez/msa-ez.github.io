---
description: ''
sidebar: 'started'
---

# Legacy Modernizer

<div style="position: relative; padding-bottom: 56.25%; padding-top: 0px; height: 0; overflow: hidden;">
	<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
        src="https://www.youtube.com/embed/-cMP4bCkiFc" 
        frameborder="0" crolling="no" frameborder="none" allowfullscreen="">
    </iframe>
</div>
<br>

AI 기반 레거시 모더나이저 도구는 기존의 복잡한 스토어드 프로시저를 현대적이고 클린한 자바 아키텍처로 변환하도록 설계되었습니다. 이 도구는 단순한 표면적 변환을 넘어, 구조적이고 문법적인 변화를 포함하여 공유 데이터베이스 절차 방식에서 견고한 객체 지향 모델로의 전환을 지원합니다.

핵심 변환 과정에서는 비즈니스 로직이 포함된 난해한 PL/SQL 코드를 도메인 전문가와 개발자가 쉽게 협업하고 유지할 수 있도록 유비쿼터스 언어를 사용하여 보다 접근하기 쉬운 형태로 전환합니다. 이를 통해 코드의 이해도와 유지보수성을 크게 향상시킵니다.

## Legacy Modernizer 동작 세부 구조
<img src="https://www.uengine.org/images/Legacy-Code-2-Clean-Code.jpg">

## Legacy Modernizer의 기능 및 흐름
### 1. ANTLR를 활용한 구문 분석
스토어드 프로시저 파일의 내용 전체를 LLM (Large Language Model)에게 전달하게 되면, 최대 토큰 수를 넘어가기 때문에,  LLM (Large Language Model)에 데이터를 전달할 때, 토큰 제한과 문맥 유지를 고려하여 의미적으로 연결된 덩어리로 쪼개서 전달하는 것이 중요합니다. 

예를 들어 코드 내에서 각 블록(예: IF 문, SELECT 문, DECLARE)은 중간에서 잘라 전달하지 않고, 의미적으로 완전한 단위로 나누어 전달하게 되면, 문맥을 유지되고, 모델이 데이터를 정확하게 이해하고 처리할 수 있게 됩니다. 이를 위해 ANTLR (ANother Tool for Language Recognition) 같은 파싱 도구를 사용하여 코드의 구조를 파악하고, 이를 트리 구조로 변환하는 과정이 필요합니다.

<img src="https://github.com/user-attachments/assets/cfdd2696-292a-41fc-949f-c6f7c09f4292">

### 2. 그래프 형태로 시각화
스토어드 프로시저의 시각화 과정은 다음과 같이 진행됩니다. Antlr을 통해 생성된 구문 트리를 기반으로 스토어드 프로시저의 구조를 단계별로 분석합니다. 분석 과정에서 수집된 토큰들을 LLM에 전달하여 의미론적 정보를 추출하고, 이를 바탕으로 그래프 데이터베이스에 노드와 관계를 구성합니다. 최종적으로 생성된 그래프를 통해 사용자는 스토어드 프로시저의 구조와 로직을 보다 직관적으로 파악할 수 있습니다.

<img src="https://github.com/user-attachments/assets/c2b2b284-9f73-4ba0-b633-e863b6406949">

#### 그래프 데이터베이스(Graph Database)란?
* Graph Database 정의
그래프 데이터베이스는 데이터를 노드(Node)와 관계(Edge)로 표현하는 데이터베이스입니다. 노드는 개체를 나타내고, 관계는 이들 간의 연결을 표현합니다. 특히 복잡한 관계를 가진 데이터를 저장하고 조회하는데 최적화되어 있으며, 데이터 간의 관계를 직관적으로 모델링하고 탐색할 수 있습니다.

* 선택하게 된 이유
PL/SQL을 Java로 전환하는 과정에서 그래프 데이터베이스를 활용한 이유는 코드의 구조적 특성을 효과적으로 표현하기 위해서입니다. 벡터 데이터베이스가 텍스트의 의미적 유사성 분석에 강점이 있는 반면, 그래프 데이터베이스는 코드의 계층적 관계와 순차적 흐름을 더 명확하게 표현할 수 있습니다. 특히 프로시저 내의 제어 흐름, 변수 참조, 함수 호출 등의 관계를 노드와 엣지로 표현함으로써, Java 코드 생성에 필요한 구조적 정보를 효과적으로 활용할 수 있습니다.

### 3. 자바로 전환
그래프 데이터베이스에 저장된 구조화된 정보를 기반으로 Java 코드로의 변환이 단계적으로 이루어집니다. PL/SQL의 테이블 구조는 Java의 엔티티 클래스로 매핑되며, SELECT, INSERT와 같은 데이터 조작 구문은 JPA 리포지토리 인터페이스로 변환됩니다. 비즈니스 로직을 포함한 나머지 부분들은 서비스 클래스로 구현되어, 전체적으로 계층화된 Java 애플리케이션 구조를 형성하게 됩니다.

<img src="https://github.com/user-attachments/assets/64599fc7-b9d2-4a67-a0d9-d9ed8ec51abd">

### 4. 테스트 검증
변환된 Java 코드의 정확성 검증을 위해 AI 기반의 JUnit 테스트 자동 생성 시스템을 구현했습니다. 사용자는 테스트에 필요한 초기 데이터(Given)와 검증하고자 하는 프로시저(When)를 선택할 수 있으며, 이를 기반으로 적절한 JUnit 테스트 케이스가 자동으로 생성됩니다. 이를 통해 PL/SQL에서 Java로 전환된 코드가 원래의 비즈니스 로직을 정확하게 구현하고 있는지 체계적으로 검증할 수 있습니다.

<img src="https://github.com/user-attachments/assets/881e0570-4030-4c59-a897-c2026879e744">

## 수행 방법
<!-- #### 데모 : 근태 관리 시스템 자바 코드 전환 -->

**1. [Legacy Modernizer](http://modernizer.uengine.io/) 에 접속합니다.**

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/01.png">
<br><br>

**2. [Anthropic Console](https://console.anthropic.com/settings/keys) 사이트를 통해 API 키를 발급받아서 입력합니다.**

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/02.png">
<br>

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/03.png">
<br><br>

**3. PL/SQL 코드를 다운받아 압축을 풉니다. ([샘플 스토어드 프로시져 파일](https://www.uengine.org/images/sample_stored_procedure_file_new.zip))**

**4. PL/SQL 코드를 자바로 변환하기 위해, 다운받은 샘플 스토어드 프로시져 파일을 아래와 같이 드래그 & 드롭하여 업로드합니다.**

<!-- 분석 과정을 통해 데이터를 처리하게 됩니다.** -->

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/04.png">
<br>

<!-- - 변환 시 직면하는 주요 도전 중 하나인 LLM 문자열 크기 제한을 해결하기 위해 PL/SQL 코드를 여러 단위로 분할하여 전달합니다.
- Antlr와 같은 파싱 도구를 활용하여 구문 구조를 파악하고, 의미 있는 문맥을 유지하며 문을 분할하여 분석에 활용합니다.
 - 원본 코드도 확인 가능하며, 직원 존재 여부 확인, 정규직 여부 확인 함수는 전달된 직원키를 사용하여 확인할 수 있습니다.
- 이미 존재하는 직원인지 확인하는 함수를 호출하여 존재하지 않다면 인서트문을 실행합니다. -->
- 분석 대상은 **스토어드 프로시저(SP)** 파일이며, 다음과 같은 파일들을 함께 업로드하는 것이 필요합니다.
    - **SP_프로시저명**: 주요 분석 대상
    - **DDL_테이블명**: 테이블 정의
    - **SEQ_시퀀스명**: 시퀀스 정의
- ⚠️ **파일명 규칙은 필수**입니다. (`SP_`, `DDL_`, `SEQ_` 형식)
- 특히 **DDL 파일은 정확도 향상에 매우 중요**하며, 업로드 여부에 따라 분석 품질에 큰 차이가 발생할 수 있습니다.
<br><br>

**5. 해당 파일을 분석해서 그래프 형태로 시각화 합니다.**

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/05.png">
<br>

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/06.png">
<br>

<!-- - 업로드한 PL/SQL 파일 단위과 같이 4개의 최상위 노드가 구성되고, 각각 해당되는 구성을 하나씩 펼쳐서 볼 수 있습니다.
- 직원 정보의 유무를 확인하며, 특정 테이블에서 레코드를 조회하는 셀렉트 문이 포함되어 있습니다.
- 함수의 입력 매개변수와 지역 변수를 설명하는 스펙이 있으며, 비즈니스 로직을 나타내는 노드가 존재합니다.
- 세부 노드는 각각 summary가 존재하여, 무슨 역할을 하는지 파악할 수 있습니다. -->
- 스토어드 프로시저 및 함수, 테이블의 흐름을 그래프 형태로 시각화되어 확인할 수 있습니다.
<br><br>

**6. 그래프 시각화에서 각 노드를 클릭하면 해당 노드에 관련된 정보를 확인할 수 있고, 노드를 더블 클릭하면 각각 해당되는 구성을 하나씩 펼쳐서 볼 수 있습니다.**

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/07.png">
<br>
<!-- - 셀렉트, DML (Data Manipulation Language) 노드는 테이블과 연관이 되어있으며, 셀렉트는 FROM으로 인서트, 딜리트, 업데이트는 NEXT로 연결되어 있습니다.
- 테이블을 클릭하면 필드 정보와 NULL 여부를 확인할 수 있고, 같은 테이블이기 때문에 클릭시 하이라이트로 표시가 됩니다.
- 함수를 클릭할때도 하이라이트가 표시되어 어떤 함수가 호출되는지 쉽게 파악할 수 있으며, 다양한 프로시저와 패키지가 구성되어 있습니다.
- 출퇴근 관리 패키지도 똑같은 구조로 되어있으며, 이러한 그래프 정보들을 활용하여 자바로 변환하게 됩니다. -->

- 업로드된 스토어드 프로시저는 다음과 같은 구조로 자동 분석됩니다.
<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/07-1.png" style="margin-top: 10px;">

  - `SPEC` 노드: 함수의 **입력 매개변수**
  - `DECLARE` 노드: **지역 변수**
  - `TRY-EXCEPTION` 노드: **예외 처리 흐름**
  - 기타 노드들: **비즈니스 로직 흐름**
  - 각 노드에는 **summary 정보**가 포함되어 있어, 역할 및 기능을 쉽게 파악할 수 있습니다.
<br><br>

**7. 클릭 시, 같은 테이블 또는 함수 노드들이 '하이라이트'되어 한눈에 연관성을 파악할 수 있습니다.**

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/08.png">
<br>

- 이를 통해 **어떤 프로시저가 어떤 테이블이나 함수를 호출하고 있는지 시각적으로 추적**이 가능합니다.
<br><br>

**8. 각 노드에 관한 상세정보창은 접었다 펼쳤다 할 수 있으며, 마우스 스크롤을 통해 확대/축소하여 전체적인 흐름을 볼 수 있습니다.**
<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/09.png">
<br>

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/10.png">
<br><br>

**9. '데이터 삭제' 버튼을 누르면 저장된 그래프 데이터를 삭제하고 다시 분석이 가능합니다.**

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/11.png">
<br>

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/12.png">
<br>

- 같은 내용의 그래프 트리가 존재하면 분석을 하지않고 그대로 반환하기 때문에, **분석중 그만두었거나 새로고침으로 인해 끊겼다면 삭제하고 다시 진행해주세요.**
<br><br>

**10. CONVERT TARGET PROJECT 버튼을 누르면 변환이 시작되며, 그래프 정보를 단계별로 사용하여 필요한 자바 클래스 파일을 생성합니다.**

<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/13.png">
<br>
<img src="https://ju0735.github.io/uengine-new.github.io/images/legacy-modernizer/14.png">
<br>

<img src="https://ju0735.github.io/uengine-new.github.io/images/demo-corporate/use-04.jpg">
<br>

- 변환 결과는 **ZIP 파일 형태로 다운로드** 받을 수 있으며, **IDE 편집기(예: IntelliJ, Eclipse 등)**에서 쉽게 열어볼 수 있습니다.
- Java 프로젝트 구조는 다음과 같이 구성됩니다.
    - `Command`, `Controller`, `Entity`, `Repository`, `Service`
    - 각 클래스는 실제 프로시저의 비즈니스 로직을 반영한 메서드들로 구성됩니다.

<!-- - 각 업로드된 파일에 따라 어떤 패키지 파일과 어떤 프로시저가 컨버팅되는지를 표시합니다.
- 자바로 전환된 결과는 zip 형태로 다운로드 받을수도 있습니다.
- 변환된 자바 프로젝트는 커맨드, 컨트롤러, 엔티티, 리포지토리, 서비스로 구분되어 각 메서드가 실제 로직을 실행하는 구조로 되어 있습니다.
- 예를들어, INS_EMPLOYEE는 직원을 등록하는 프로시저로, '직원키', '직원이름', '부서코드', '정규직 여부' 정보를 받게되어 관련 메서드를 호출하여 해당 직원 정보를 생성하고 저장합니다.
<br><br> 

**6. 자바로 변환된 결과가 제대로 되었는지 확인하기 위해 특정 프로시저를 실행할 수 있으며, 추가로 파라미터와 필요한 초기 데이터를 입력할 수 있습니다.**

<img src="https://www.uengine.org/images/demo-corporate/use-05.jpg">

- 직원, 급여, 결근여부 등 입력된 정보는 자동으로 테스트 케이스를 생성하는 데 사용됩니다.
- 여러 케이스를 추가하여 다양한 상황을 테스트하고, 정직원 여부에 따른 급여 변화 등을 확인합니다.
- 테스트 결과는 화면에 반영되며, 테스트를 수행한 뒤의 데이터와 입력한 프로시저 정보를 통해 검증됩니다.
<br><br>

**7. 테스트가 성공하면 Given-When-Then 로직이 제대로 실행된 것을 확인할 수 있습니다.**

<img src="https://www.uengine.org/images/demo-corporate/use-06.jpg">

- 실제 테스트 시행 시 트랜지션 로그가 생성되어 보여집니다.
- Given은 입력한 정보를, When은 프로시저 호출, 파라미터 정보, Then은 호출 결과를 보여줍니다.
- test폴더에 파일이 생성되고, CASE 1 에 입력한 값과 정보가 동일하며 정규직의 경우 한 번 결근시 10만원 감소하여, 총 90만원으로 변환되는 로직을 확인할 수 있습니다.
<br><br>

<img src="https://www.uengine.org/images/demo-corporate/use-07.jpg">

- CASE 2 도 마찬가지로 입력 값과 정보가 동일하며, 정규직이 아닐 경우 한 번 결근시 20만원 감소하여, 80만원에서 60만원으로 변동된 결과가 나타납니다.
- CASE 2 에 입력한 데이터를 기반으로 java에서도 초기 데이터를 등록하게 되고 Given-When-Then 로직이 제대로 실행된 것을 확인할 수 있습니다.
- 만일 테스트가 실패하면, 피드백 루프를 통해 계속 코드를 수정하며 같은 결과를 도출하게 됩니다. -->

<style>
.mobile-view {
    display: none;
}
.btn-pdf {
    text-align: center; 
    line-height: 30px; 
    border-radius: 8px;
    display: inline-block;
    text-align: center;
    margin-bottom: 30px;
    padding: 8px 16px;
}
.btn-pdf a {
    font-size: 16px;
    font-weight: bold;
    color: #fff !important;
    text-decoration: none;
}

@media screen and (max-width: 499px) {
    .responsive-table {
        display: none;
    }

    .mobile-view {
        display: block;
    }

    .mobile-view div {
        font-size: 16px;
        font-weight: bold;
        margin-top:20px;
    }
}
</style>
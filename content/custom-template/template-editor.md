---
description: ''
sidebar: 'started'
---

## 1. Template Editor 란?
Template Editor란 MSAEZ내에 내장되어 있는 템플릿 편집기능으로 선택한 템플릿 파일의 코드를 변경하였을 때, 변환된 결과값을 즉각적으로 확인할 수 있는 기능을 제공하고 있습니다.

MSAEZ에서 Template Editor를 사용하는 방법은 다음과 같습니다.

![](https://github.com/msa-ez/platform/assets/123912988/5d2ff91f-2992-474f-9104-094e6aa9dd68)

먼저 모델링을 완료한 모델의 코드 프리뷰를 열어 Template을 선택합니다.

현재 예시에서는 spring-boot 템플릿을 선택하였습니다.

이후 좌측 상단에 위치한 Edit Template 아이콘을 클릭하면 Template Editor 화면에 접근하여 기능을 사용할 수 있습니다.

## 2. 템플릿 파일 선택

선택한 템플릿의 코드를 수정하기 위해서는 우선 템플릿 파일을 선택해야 합니다.

![](https://github.com/msa-ez/platform/assets/123912988/d9680e6b-6a13-4f18-be78-6cf12320b442)

위의 사진처럼 Template Editor 화면 좌측에 위치한 'Template Explorer' 목록에서 선택한 템플릿에 대한 폴더를 확인할 수 있습니다.

여기서 수정할 템플릿 파일이 존재하는 경로로 이동하여 템플릿 파일을 선택할 경우 'EDIT TEMPLATE' 영역에 선택한 템플릿 파일의 코드가 변경되어 화면에 노출되는 것을 확인할 수 있습니다.


## 3. 템플릿 코드 수정

![](https://github.com/msa-ez/platform/assets/123912988/f77e8e08-fa7c-4ce6-bf23-acc59c2a703c)

이전 단계에서 선택한 Aggregate.java의 템플릿 코드가 'EDIT TEMPLATE' 영역에 노출된 것을 확인할 수 있습니다.

이제 해당 영역에서 템플릿 코드를 원하는 대로 수정이 가능합니다.

수정시에 필요한 스티커별 정의된 데이터는 좌측 영역의 'Model Explorer'에서 확인가능하며, 이를 이용하여 더욱 쉽게 데이터를 참조하여 코드를 수정할 수 있습니다.

이제 좌측의 'Model Explorer'를 참조하여 클래스 내부에 {{keyFieldDescriptor.name}} 데이터가 생성되도록 추가해보겠습니다.

![](https://github.com/msa-ez/platform/assets/123912988/bd096c0e-d7b9-473d-bd90-21ab2b34b8b8)

위의 사진처럼 클래스 내부에 데이터를 추가한 후 우측 상단의 실행 버튼을 클릭하면 'EDIT TEMPLATE' 영역에 선언된 코드를 기준으로 변경된 결과값을 확인할 수 있습니다.



## 4. 변환된 파일 확인
'EDIT TEMPLATE'에서 코드를 수정하여 변환을 진행하면 아래의 예시처럼 우측 영역에 변환된 결과값이 나타나는 것을 확인할 수 있습니다.

![](https://github.com/msa-ez/platform/assets/123912988/e795b10f-633f-481f-9a8d-14bb10d693a8)

여기서 우측 상단의 'selected file'을 확인할 수 있는데, 'selected file'은 모델링한 스티커별 변환된 파일의 종류를 확인할 수 있습니다.

![](https://github.com/msa-ez/platform/assets/123912988/9a2516f8-166a-4816-a159-eef845cc10ab)

예시에서는 모델링 단계에서 생성한 Aggregate 스티커 User와 Company에 대한 파일이 생성되었습니다.

여기서 파일을 선택하면 선택한 파일의 변환된 코드를 확인할 수 있어 각 파일별 생성된 결과값에 대해서 확인할 수 있습니다.
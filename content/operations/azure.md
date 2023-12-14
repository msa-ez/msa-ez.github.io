---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Azure Cloud Setup (AKS, ACR 설정)

## Azure Cloud 접속 설정 

- 크롬 브라우저를 오픈하고 새로운 탭에서 portal.azure.com에 접속한다.
- 내 계정정보를 입력하고 관리콘솔에 로그인한다.


### 1. 구독(Subscription) 확인

- 서비스 Keyword에 '구독, or Subscription'을 입력하고 클릭   
- 결과 페이지에서 매칭된 구독 정보가 확인된다.


### 2. '리소스 그룹' 생성 '리소스 그룹' 서비스 검색 후, 만들기 클릭
- 구독 선택
- 리소스 그룹명 입력 : e.g. user25-rsrcgrp : e.g. user25-rsrcgrp
- 영역(Region) 선택 - '(Asia Pacific) Korea Central'
- 다음 선택 > 만들기 클릭

netes)' 생성  

- 'AKS' 서비스 검색 후, 만들기 클릭
- 구독 확인 및 리소스 그룹 선택
- 클러스터 이름 입력 : e.g. user25-aks
- 노드 수 범위지정 : 3-3
- 다음 선택 > 검토+만들기 클릭
- 최종 '만들기' 클릭하여 AKS 생성
- 프로비저닝 중 내용은 콘솔 우측상단의 'Alert Icon'을 눌러 확인가능하다.


### 4. Azure Client 설치

- GitPod 콘솔에서 'az' 를 입력하여 설치 여부를 확인한다. 
- azure Client 설치가 안되어 있을 경우, 아래 커맨드로 설치한다.
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash 
```  

### 5. Azure Client SSO 설정

- azure Client가 설치되어 있는 경우, Credential 설정을 진행한다.
```bash
az login --use-device-code
```

- 아래와 같은 메시지가 출력된다.
```
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code RQ92TVHGC to authenticate.
```
  - Ctrl 키를 누른 상태에서 링크를 클릭한다. (https://microsoft.com/devicelogin)
  - 코드 입력란에 출력된 메시지 후반부의 9글자 대문자를 붙여넣는다.
- 진행 중 아래 팝업창이 나타난 경우, 'Open'을 클릭한다.
![image](https://github.com/acmexii/demo/assets/35618409/f4a7ba21-093d-4124-891c-50cb554f80c8)
- 내가 사용할 계정정보를 클릭하고, 설정이 완료되면 창(탭)을 닫는다.
- 터미널에도 다음과 유사한 설정완료된 내용이 출력된다.
![image](https://github.com/acmexii/demo/assets/35618409/571fe061-0682-42f3-84db-6345004a6354)


### 6. K8s Client 설정

#### kubernetes Client에 Target AKS Context 설정

```bash
az aks get-credentials --resource-group (RESOURCE-GROUP-NAME) --name (Cluster-NAME)
```  

#### AKS worknode 확인

```
kubectl get all

kubectl get node
NAME                                STATUS   ROLES   AGE   VERSION
aks-agentpool-26392033-vmss000002   Ready    agent   41m   v1.25.6
aks-agentpool-26392033-vmss000001   Ready    agent   41m   v1.25.6
aks-agentpool-26392033-vmss000002   Ready    agent   41m   v1.25.6
```

### 7. ACR(Azure Container Registry) 생성
- Azure가 제공하는 이미지 저장소
```bash
az acr create --resource-group (RESOURCE-GROUP-NAME) --name (REGISTRY_NAME) --sku Basic

# REGISTRY_NAME 에는 숫자와 문자만 사용가능, e.g. user00registry
```  

#### AZure 콘솔에서 설정정보 확인

- https://portal.azure.com/ 의 내 '리소스그룹'에 접속
- 생성된 AKS와 ACR을 최종 확인한다.


### 트러블 슈팅

- Resource group could not be found.
```
# 계정 정보와 설정된 구독 정보를 확인
az account show

# 관리콘솔에서 생성시 지정한 구독정보로 사용설정
az account set --subscription "종량제1"
```

- (AlreadyInUse) The registry DNS name user25.azurecr.io is already in use.
```
# ACR 이름을 중복을 회피하도록 부여한 다음 재시도 
```

### (예시) 마이크로서비스별 이미지 빌드/푸시 할 경우

#### Azure AKS에 ACR Attach
- ACR에 저장된 이미지를 AKS에서 사용하려면 바인딩 작업이 선행되어야 한다.
```bash
az aks update -n (Cluster-NAME) -g (RESOURCE-GROUP-NAME) --attach-acr (REGISTRY_NAME)
```  

#### AZure 콘솔에서 설정정보 확인

- https://portal.azure.com/ 의 내 '리소스그룹'에 접속
- 생성된 AKS와 ACR을 최종 확인한다.


### 트러블 슈팅

- Resource group could not be found.
```
# 계정 정보와 설정된 구독 정보를 확인
az account show

# 관리콘솔에서 생성시 지정한 구독정보로 사용설정
az account set --subscription "종량제1"
```

- (AlreadyInUse) The registry DNS name user25.azurecr.io is already in use.
```
# ACR 이름을 중복을 회피하도록 부여한 다음 재시도 
```

### (예시) 마이크로서비스별 이미지 빌드/푸시 할 경우

#### - Azure ACR Login 설정
```bash 
az acr login --name (REGISTRY_NAME) --expose-token
```  

#### 예시, 주문서비스 이미지 빌드와 푸시
- docker Command 
```
docker build -t (REGISTRY_NAME).azurecr.io/welcome:v1 .
docker push (REGISTRY_NAME).azurecr.io/welcome:v1
```
- 인증오류 발생시, 
```bash 
az acr login --name (REGISTRY_NAME)
```  
- az acr Command
```
az acr build --registry (REGISTRY_NAME) --image (REGISTRY_NAME).azurecr.io/welcome:v2 .
```

### 내가 만든 내 이미지 배포해 보기
```
kubectl create deploy myhome --image=(REGISTRY_NAME).azurecr.io/welcome:v1
kubectl expose deploy myhome --type=LoadBalancer --port=80
```
### 웹브라우저에서 서비스 접속하기
```
kubectl get service
# 조회되는 EXTERNAL-IP 복사 후, 브라우저 주소창에 붙여넣기
```



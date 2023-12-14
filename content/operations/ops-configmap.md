---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Kubernetes에 환경변수 구성하기

## 컨테이너로부터 환경변수 분리

- 컨피그맵(Configmap)은 쿠버네티스가 컨테이너에서 필요한 환경설정 내용을 컨테이너와 분리해 저장하고 제공해 주기 위해 사용한다.
- 단순한 환경정보의 수정을 위해 전체 CI/CD 파이프라인을 태우면서 배포해야 하는 것은 민첩성에 부합한 운영이 아니다.
- 본 랩에서는 Configmap으로부터 필요한 환경정보를 전달받아 주문서비스를 실행하는 랩을 실습한다.


### ConfigMap 활용하기

- 먼저, Imperative한 방식으로 ConfigMap을 생성해 본다.
- Class는 MSA, Lab은 ConfigMap 값을 가진 컨피그 맵 객체를 생성한다.
```
kubectl create configmap my-config --from-literal=class=MSA --from-literal=Lab=ConfigMap
```
- 생성된 CM 객체를 조회하고 값을 확인해 본다.
```
kubectl get configmap my-config -o yaml
```
- ConfigMap 등록된 클래스(class) 정보를 생성되는 컨테이너에 전달하려면, 배포 YAML에 다음과 같이 정의하여야 한다.
```
...
...
spec:
  containers:
  - name: cm-file
    image: user/order:v1
    imagePullPolicy: Always
    ports:
    - containerPort: 8080
    env:
    - name: CLASS
      valueFrom:
        configMapKeyRef:
          name: my-config
          key: class
...
...
```

- 이제는 YAML 기반의 ConfigMap을 생성하고, 이를 주문서비스에서 활용해 보자.
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: config-dev
  namespace: default
data:
  ORDER_DB_URL: jdbc:mysql://mysql:3306/connectdb1?serverTimezone=Asia/Seoul&useSSL=false
  ORDER_DB_USER: myuser
  ORDER_DB_PASS: mypass
  ORDER_LOG_LEVEL: DEBUG
EOF
```
- 생성된 ConfigMap 객체를 확인한다.
```
kubectl get configmap
kubectl get configmap config-dev -o yaml
```

### ConfigMap 예제코드 다운로드
```
git clone https://github.com/msa-school/lab-shop-configmap.git
cd lab-shop-configmap
```


### ConfigMap 설정 중, 일부 설정만 참조하기

- 주문서비스의 Logging 레벨을 Configmap의 ORDER_DEBUG_INFO 참조하도록 설정 확인
- VS Code로 주문서비스 Code 확인
```
cd order
kubernetes > deployment.yaml 
```
- 주문서비스 Kubernetes에 배포
- order > README.md을 참조하여 docker hub 이미지를 생성하고, 내 Cluster에 배포
```
mvn package -B -DskipTests
docker build -t username/order:v1 .
docker run username/order:v1
docker push username/order:v1
```
```
kubectl apply -f kubernetes/deployment.yaml
```

- 배포 후, 컨테이너 Log를 통해 DEBUG 로그레벨이 적용되었음을 확인
```
kubectl logs -l app=order
```

### Log Level을 Debug에서 Info 수준으로 변경

- ConfigMap의 ORDER_LOG_LEVEL을 수정하여 업데이트
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: config-dev
  namespace: default
data:
  ORDER_DB_URL: jdbc:mysql://mysql:3306/connectdb1?serverTimezone=Asia/Seoul&useSSL=false
  ORDER_DB_USER: myuser
  ORDER_DB_PASS: mypass
  ORDER_LOG_LEVEL: INFO
EOF
```

- 주문 컨테이너를 재실행
```
kubectl delete pod -l app=order
kubectl get pod
```

- 재실행 후, 컨테이너 Log를 통해 INFO 로그레벨이 적용되었음을 확인
```
kubectl logs -l app=order
```

- Configmap에서 각 Container로 전달된 환경정보를 확인하기 위해 아래 커맨드를 실행해 보자.
```
kubectl exec pod/ORDER 객체 -- env
```
- 배포시 전달된 ORDER_LOG_LEVEL 정보가 주문 컨테이너 OS에 설정되었음을 알 수 있다.


### ConfigMap에 있는 모든 데이터 한꺼번에 전달하기

- 주문서비스 > kubernetes > deployment.yaml 38~43라인을 아래 YAML로 수정한다.
```
        envFrom:
        - configMapRef:
            name: config-dev
```

-주문서비스를 다시 배포한 다음, 컨테이너 OS의 환경정보를 확인한다.
```
kubectl delete deploy -l app=order
kubectl apply -f kubernetes/deployment.yaml

kubectl exec pod/ORDER 객체 -- env
```

- 이외에도 컨피그맵을 볼륨으로 가져와서 사용할 수 있는데, 각 데이터 키를 이름으로가지는 파일을 만들어서 넣어주는 방식도 있다.


## Secret 활용

- Secret도 ConfigMap과 동일한 형태로 yaml파일이 작성된다.
- 차이점은 Plain type의 ConfigMap과 다르게 Base64 형태로 value가 저장된다는 것과 암호, 토큰 또는 민감한 정보를 저장하기 위한 오브젝트인 점에서 차이가 있다.
- Secret 사용 예시
```
.....
.....
  env:
    - name: LOG_LEVEL
      valueFrom:
        configMapKeyRef:
           name: config-dev
           key: ORDER_LOG_LEVEL
    - name: DB_PASS
      valueFrom:
        secretKeyRef: 
          name: secret-dev
          key: ORDER_DB_PASS
```

### Docker Credential Secret 생성 및 활용

- 시나리오
  - 도커허브에 배포한 Homepage 이미지에 대해 접근모드를 Private으로 전환한다.
  - 이미지 배포시 Credentials이 없으면 ImagePullBackOff 오류가 발생한다.
  - Docker Credential을 가지는 Secret 객체를 생성해 Yaml Spec.에 추가해 주면 ACL이 설정된 이미지가 정상 배포됨을 확인한다.

#### 이미지 저장소를 Private Mode로 설정

- 도커허브에 접속하여 배포한 Home, or welcome 이미지 Settings 메뉴에서 Visibility를 Private 모드로 변경
- 아래 YAML을 deploy-with-secret.yaml 로 저장한다.
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-home
  labels:
    app: home
spec:
  replicas: 1
  selector:
    matchLabels:
      app: home
  template:
    metadata:
      labels:
        app: home
    spec:
      containers:
      - name: home
        image: [MY-IMAGE-NAME]
        ports:
        - containerPort: 80
```

- 저장한 deploy-with-secret.yaml 을 배포한다.
```
kubectl apply -f deploy-with-secret.yaml
```

```
kubectl get all
kubectl describe pod/[POD 객체]
```

- Private Mode로 전환됨에 따라 Image가 Pulling되지 않는다.
- Pod의 라이프사이클 로그를 조회한다.
```
kubectl describe pod/[Pod 객체]
```
- 조회결과, 이미지는 존재하나 인증(Authorization) 오류가 확인된다.
- 만약, Private Mode임에도 정상 배포다면 이는 Runtime Cache에서 참조된 것으로 아래 YAML Spec.을 추가하고 다시 적용해 본다.
```
    spec:
      containers:
      - name: home
        image: [MY-IMAGE-NAME]
		imagePullPolicy: Always    # <<< 이 라인 추가
        ports:
        - containerPort: 80		
```

#### Docker Config Secret 생성
```
kubectl create secret docker-registry my-docker-cred \
--docker-server=https://index.docker.io/v1/ \
--docker-username=[DOCKER-ACCOUNT] \
--docker-password=[PASSWORD] \
--docker-email=[E-MAIL]
```
- Dcoker hub일 경우, docker-server에 ‘https://index.docker.io/v1/’ 입력
- 생성된 Secret을 확인한다.
```
kubectl get secret
kubectl get secret my-docker-cred -o yaml
```
- 조회된 .dockerconfigjson value를 base64 디코딩하여 Docker Credential을 확인한다.
```
echo [.dockerconfigjson Value] | base64 --decode
```

#### Service 재배포
- 아래 imagePullSecrets 속성을 배포 스펙에 추가하고 저장한다.
```
...
    spec:
      containers:
      - name: home
        image: [MY-IMAGE-NAME]
        ports:
        - containerPort: 80
      imagePullSecrets:	        # 여기서부터 추가
      - name: my-docker-cred
```

#### 컨테이너 재배포
```
kubectl delete -f deploy-with-secret.yaml
kubectl apply -f deploy-with-secret.yaml
kubectl get all
```

- 컨테이너가 정상적으로 생성되어 Running Pod Status가 확인된다.
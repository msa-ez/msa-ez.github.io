---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Labels and Annotations

### Labels and Annotations

- aws와 kubectl 환경설정 후, 객체가 존재하면 모두 삭제한다.

```
kubectl get all
kubectl delete deploy,svc --all
```

- 내가 만든 홈페이지를 배포한다.
```
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: home
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
          image: apexacme/welcome:v1
          ports:
            - containerPort: 80
EOF
```

#### 배포된 home 객체 확인 및 레이블 조회
```
kubectl get all
kubectl get pod --show-labels
```

#### 레이블 통한 객체 조회(Equal-Based Selector)
```
kubectl get pods -l app=home
kubectl get pods --selector app=home
kubectl delete pod -l app=home
```

#### 레이블 통한 객체 조회(Set-Based Selector)
```
kubectl get pods --selector 'app in (home, home1)'
kubectl get po --selector 'env in(home, home1), app in (home, home1)'
```

#### Deployment에 Label 추가 및 삭제
```
kubectl get deploy
kubectl label deploy home app=home
kubectl get deployment --show-labels
kubectl delete deploy --selector app=home
kubectl get all
```

### 서비스 롤백에 Annotation 활용


#### 홈페이지 v1 배포 및 배포주석 추가
```
kubectl create deploy home --image=apexacme/welcome:v1
kubectl get deploy -o wide
kubectl annotate deploy home kubernetes.io/change-cause="v1 is The first deploy of My Homepage."
```

- 홈페이지 v2로 업그레이드 하기
```
kubectl set image deploy home home=apexacme/welcome:v2
kubectl get deploy -o wide
```

#### 배포주석 달기
```
kubectl annotate deploy home kubernetes.io/change-cause="v2 is The 2nd version of My Homepage."
```

#### 배포 히스토리 확인
```
kubectl rollout history deploy home
```
- 다음과 같이 출력됨을 확인
  REVISION     CHANGE-CAUSE
  1 v1 is The 1st deploy of My Homepage.
  2 v2 is The 2nd version of My Homepage.

#### 이전 버전으로 롤백하기
```
kubectl rollout undo deploy home
kubectl get deploy -o wide
# 배포 이력에서 특정 버전으로 롤백하기
kubectl rollout undo deploy home --to-revision 5
```

- 초기 버전(apexacme/welcome:v1)으로 롤백되었는지 확인합니다.
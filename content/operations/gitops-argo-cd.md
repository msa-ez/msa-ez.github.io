---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# [GitOps] Argo CD 를 통한 카나리 배포

## Argo CD 를 통한 배포

- Argo CD 는 GitOps기반의 지속적인 배포를 지원하는 Kubernetes Plug-in 이다:
- 이번 실습에서는 깃헙기반의 배포 매니페스트를 자동으로 읽어 배포하는 실습을 진행한다.
- 실습에 필요한 아래 Github 리소스를 내 GitHub으로 복제(접속 후, Fork)해 둔다.
```
https://github.com/argoproj/argocd-example-apps.git
```

### Install Argo CD

- 먼저 Argo cd 를 Cluster에 설치한다:

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Argo CD UI 를 접속하기 위하여 LoadBalancer 로 전환한다:
```
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

Argo CD UI 의 External IP 주소를 획득한다
```
kubectl get svc argocd-server -n argocd
```

접속한다.

Argo CD 는 기본 https 로 UI 서비스가 열리므로, 인증서가 없이 서비스를 열었으므로, 이를 그냥 접속하기 위해서 해당 페이지에서 허공에 대고 "thisisunsafe" 를 입력하면 다음과 같은 페이지로 넘어간다 ㅡㅡ;

![](https://i1.wp.com/DeployHappiness.com/wp-content/uploads/2019/02/01.png?fit=442%2C230&ssl=1)

접속 user id 는 admin 이고 password 는 다음과 같이 Secret 에서 얻어내어야 한다 (무슨 CD 툴이 왠 보안에 엄청 신경을):
```
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```
- 조회된 비밀번호를 붙여넣고 로그인(SIGN IN)하면 아래와 같은 메인이 출력된다.
![argo-main](https://github.com/acmexii/demo/assets/35618409/00719984-5f28-4aab-adc7-11af7769099b)

### Argo CD GitOps 설정

- 상단에 보여지는 'NEW APP'을 클릭하여 애플리케이션을 등록한다.

![](https://argo-cd.readthedocs.io/en/stable/assets/new-app.png)

- Guestbook Application 을 등록한다:

![](https://argo-cd.readthedocs.io/en/stable/assets/app-ui-information.png)


- 내 계정으로 복제된 guest book application 의 git 주소를 argo 에 등록한다.

![](https://argo-cd.readthedocs.io/en/stable/assets/connect-repo.png)

- 배포될 타겟 클러스터를 지정한다:

![](https://argo-cd.readthedocs.io/en/stable/assets/destination.png)

> kubernetes.default.svc 가 내가 포함된 서비스의 기본 접속 주소이다.
> namespace를 "guestbook"으로 설정한다.

- 상단의 'CREATE'를 눌러 설정을 저장한다.

- Argo Main에 guestbook 애플리케이션이 카드목록으로 나타난다.
![image](https://github.com/acmexii/demo/assets/35618409/d94f0803-e162-43c1-98d7-5096b8aed91a)
- 출력된 guestbook 애플리케이션 하단의 'SYNC'를 눌러 동기화를 진행한다:
> 팝업에서 다시 'SYNCHRONIZE'를 한번 더 클릭한다.
> 
### 미션 (Manual Sync)

Git guestbook 폴더 하위에 있는 Manifests에 변화를 주고, 이를 동기화 시켜서 반영이 되는지 확인한다:
```
Github > guestbook 폴더의 배포 yaml을 편집하여 이미지 이름을 nginx:1.19.10로 수정하고 저장(Commit)한다.
Argo CD UI에서 'Sync'를 눌러 GitOps 배포를 진행한다.
```

![](https://argo-cd.readthedocs.io/en/stable/assets/guestbook-app.png)

![](https://argo-cd.readthedocs.io/en/stable/assets/guestbook-tree.png)


### 확장미션 (Auto Sync)
Canary 배포 Manifest를 가진 신규 Argo CD 앱 추가

### 시나리오

1. order-canary 폴더를 argocd-example-apps Git 리파지토리 루트에 생성한다.
1. order-canary 폴더에 canary.yaml을 생성하고ㅎ아래의 링크 내용을 열어 복사해 저장(Commit)한다.
<a href="https://raw.githubusercontent.com/msa-school/Lab-required-Materials/main/Ops/canary.yaml" target="_blank">canary.yaml 링크</a>
1. Argo CD UI상에서 새로운 애플리케이션을 생성한다.
> 애플리케이션 이름은 order로 설정한다.
> Sync 옵션은 Automatic으로 설정한다.
> 나머지 옵션은 guestbook을 참고하여 설정한다.
1. 등록된 order 애플리케이션을 동기화하여 배포한다.
1. 이어서 47행의 이미지를 아래처럼 수정하고, Argo CD를 통한 카나리배포를 모니터링한다. 
```
 image: "jinyoung/app:blue"  -->  image: "nginx:1.7.9"
```
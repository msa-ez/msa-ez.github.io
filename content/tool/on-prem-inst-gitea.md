---
description: ''
sidebar: 'started'
---
# on-prem 설치 설명서

# Gitea로 Docker Compose에 MSAEZ 설치

## MSAEZ 초기화

```sh
docker compose up -d
```

## Gitea 설정

### 1. Gitea 초기화

1. http://127.0.0.1:3000/ 에 접속합니다.
2. Gitea 초기 구성(Initial Configuration)을 설정합니다.
3. **Administrator Account Setting.**
4. Install Gitea.

![alt text](https://github.com/user-attachments/assets/3851af2f-2964-4372-9001-319ab3a2b6de)

### 2. Gitea 구성 설정

1. Gitea 설정 파일(Configuration File) 편집

```ini
# ./gitea/gitea/conf/app.ini

# Add Cors Configuration
...
[cors]
ENABLED = true
ALLOW_DOMAIN = *

[server]
APP_DATA_PATH = /data/gitea
DOMAIN = gitea
SSH_DOMAIN = gitea
HTTP_PORT = 3000
# Edit ROOT_URL http://127.0.0.1:3000/ - >http://gitea:3000/
ROOT_URL = http://gitea:3000/
DISABLE_SSH = false
SSH_PORT = 22
SSH_LISTEN_PORT = 22
LFS_START_SERVER = true
LFS_JWT_SECRET = UPSh8CoIsH5nBiwg2kHeBWsKiIt97afTRSg0Jm2eeyA
OFFLINE_MODE = true
...
```

### 3. Gitea로 OAuth2 애플리케이션 설정

1. Gitea 로그인 (Administrator)
2. 오른쪽 상단의 **Profile Icon** 클릭
3. **Settings** - **Applications** 클릭
4. **Manage OAuth2 Applications** 입력
   - Application Name : **원하는 이름** 예) acebase
   - Redirect URIs. Please use a new line for every URI.: **http://localhost:5757/oauth2/mydb/signin**
5. **Create Application** 클릭
6. MSAEZ 설치에는 애플리케이션 등록 후 발급된 **Client ID & Client Secret**가 필요하므로 저장해줍니다.
   > ![alt text](https://github.com/user-attachments/assets/5b6c5038-1f29-4bcc-b70f-ed7fe004ee97)
7. **Save** 클릭

### 4. Docker Compose 옵션 설정

1.  Acebase OAuth2 Client ID & Client Secret 설정

```yml
# ./docker-compose.yaml
---
acebase:
  image: ghcr.io/msa-ez/acebase:v1.0.18 # Acebase Docker Image
  # image: sanghoon01/acebase:v1.1 # Acebase Docker Image
  container_name: acebase
  networks:
    - MSAEZ
  ports:
    - 5757:5757
  volumes:
    - ./acebase/mydb.acebase:/acebase
  environment:
    DB_HOST: "0.0.0.0" # DB Host Name
    DB_NAME: mydb
    DB_PORT: 5757
    DB_HTTPS: "false"
    CLIENT_ID: 689a0fc9-a7af-4e67-8096-ad2d2b05db66 # OAuth Client ID
    CLIENT_SECRET: gto_uwrnodpkfxajmppgmcyislv7vdcsk53lxyaifkmoxczqncqzyi6q # OAuth Client Secret
    PROVIDER: gitea
    GIT: "gitea:3000" # Git URL
    PROTOCOL: http
```

### 5. 호스트 파일 추가

```text
# /etc/hosts

127.0.0.1 gitea
```

### 6. Docker Compose 다시 시작

```sh
docker compose down
docker compose up -d
```

### 7. MSAEZ 연결

> http://localhost:8080

---


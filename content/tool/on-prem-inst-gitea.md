---
description: ''
sidebar: 'started'
---
# On-Premises Installation Guide

# Install MSAEZ on Docker Compose with Gitea

## Initialize MSAEZ

```sh
docker compose up -d
```

## Gitea Configuration

### 1. Initialize Gitea

1. Access http://127.0.0.1:3000/
2. Configure Gitea Initial Configuration
3. **Administrator Account Setting.**
4. Install Gitea.

![alt text](https://github.com/user-attachments/assets/3851af2f-2964-4372-9001-319ab3a2b6de)

### 2. Gitea Configuration

1. Edit Gitea Configuration File

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

### 3. Configure OAuth2 Application in Gitea

1. Gitea Login (Administrator)
2. Click the **Profile Icon** in the upper right corner
3. Click **Settings** - **Applications**
4. Enter **Manage OAuth2 Applications**
5. Click **Create Application**
   - Application Name : **Desired Name** e.g. acebase
   - Redirect URIs. Please use a new line for every URI.: **http://localhost:5757/oauth2/mydb/signin**
5. Click **Create Application**
6. MSAEZ Installation requires **Client ID & Client Secret** issued after registering the application. Please save it.
   > ![alt text](https://github.com/user-attachments/assets/5b6c5038-1f29-4bcc-b70f-ed7fe004ee97)
7. Click **Save**

### 4. Docker Compose Configuration

1. Set Acebase OAuth2 Client ID & Client Secret

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

### 5. Add Host File

```text
# /etc/hosts

127.0.0.1 gitea
```

### 6. Restart Docker Compose

```sh
docker compose down
docker compose up -d
```

### 7. Connect MSAEZ

> http://localhost:8080

---


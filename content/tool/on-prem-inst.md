---
description: ''
sidebar: 'started'
---
# Installing on-premise MSA-Easy

### 1. Clone helm Charts 
    git clone https://github.com/msa-ez/on-prem-helm.git
---
### 2. Create & Connect Kubernetes Cluster
---
### 3. Install helm chart-based MSA-Easy
  - Cluster ip: ```kubectl cluster-info```
  - Domain: A domain from DNS Service
  - token: ```kubectl describe secret default```
    #### 1. Contents to edit from each yaml files
    - <b>deployment.yaml</b>: Cluster ip, Domain, token
    - <b>values.yaml</b>: Cluster ip, Domain
    - <b>2q</b>: Domain  
    - <b>ingress.yaml</b>: Domain 
    - <b>issuer.yaml</b> Domain
      * Remark everything from <b>issuer.yaml</b> after edit
    #### 2. helm install on-prem . 
      * After on-prem install, delete remarks from <b>issuer.yaml</b>
    #### 3. Apply issuer, secrets.yaml 
        kubectl apply -f issuer.yaml, secrets.yaml
    #### 4. Install ingress-nginx
    ```
      helm upgrade --install ingress-nginx ingress-nginx \
        --repo https://kubernetes.github.io/ingress-nginx \
        --namespace ingress-nginx --create-namespace
    ```
---
### 4. Create & Set DNS Service Domain Record
  #### 1. Create Record 
  ![createRecord1](https://user-images.githubusercontent.com/65217813/192461326-ad37d114-cc4e-4fb8-8813-f45270e31c7d.png)
   - Create Records for gitlab, kas, minio, registry, *, api, www, file, acebase
    <img width="1007" alt="onprem_createRecord" src="https://user-images.githubusercontent.com/65217813/192455799-0f3300f6-7fd9-4ef6-8665-8b5fbafb9831.png">
  #### 1. edit record(gitlab, kas, minio, registry)
   - IP to register : ```kubectl get ing```
   ![getIngress](https://user-images.githubusercontent.com/65217813/192466549-3336cd69-9a73-440a-843b-0711822f371d.png)
   - edit IP
   ![editIngressRecord](https://user-images.githubusercontent.com/65217813/192468220-9a1670b3-9ec3-4ffe-98c7-7dc86c6e1778.png)
  #### 2. edit record(*, api, www, file, acebase)
   - IP to register : ```kubectl get svc -n ingress-nginx```/ external-ip 
   - edit in the same way as above
---
### 5. install operator related to ide
  #### 1. Install Operator
    cd ide-operator
    make deploy IMG=gcr.io/eventstorming-tool/theia-ide-lab:v137
---
### 6. Install NFS
  #### 1. <b>values.yaml/disk</b> edit(into the disk name to connect to the cluster)
  #### 2. install nfs 
    cd gcp_helm
    helm install gcp-msaez .
---

---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# 파일공유를 위한 클라우드 스토리지 활용(Azure)

## 주문서비스에 파일공유를 위한 NFS 연결하기

이번 랩에서는 여러 마이크로서비스간 파일 공유를 위해 일반적으로 NAS(Network Attached Storage)로 알려진 NFS 파일시스템을 Azure 클라우드에 생성하고, 이를 주문서비스에서 마운트시켜 비정형 정보 저장소로 활용하는 예제를 실습한다.


### EmptyDir Volume

- 한 Pod 내에서 컨테이너들간 공유가능한 볼륨 유형이다.
- 먼저, 아래 YAML로 Volume을 생성한다.
```
kubectl apply -f -<<EOF
apiVersion: v1
kind: Pod
metadata:
  name: shared-volumes
spec:
  containers:
  - image: redis
    name: redis
    volumeMounts:
    - name: shared-storage
      mountPath: /data/shared
  - image: nginx
    name: nginx
    volumeMounts:
    - name: shared-storage
      mountPath: /data/shared
  volumes:
  - name: shared-storage
    emptyDir: {}
EOF
```

- Pod내 한 컨테이너에서 생성한 볼륨이 다른 컨테이너에서 가시적인지 확인한다.
```
kubectl exec -it shared-volumes --container redis -- /bin/bash
cd /data/shared
echo test… > test.txt
exit
```
```
kubectl exec -it shared-volumes --container nginx -- /bin/bash
cd /data/shared
ls
```


### HostPath Volume

- 예제는 컨테이너가 바인딩된 워커노드의 /tmp 폴더를 공유하는 설정이다.
- 먼저, 아래 YAML로 Volume을 생성한다.
```
kubectl apply -f -<<EOF
apiVersion: v1
kind: Pod
metadata:
  name: hostpath
spec:
  containers:
  - name: redis
    image: redis
    volumeMounts:
    - name: somepath
      mountPath: /data/shared
  volumes:
  - name : somepath
    hostPath:
      path: /tmp
      type: Directory
EOF
```

- 컨테이너로 접속하여 마운트된 볼륨을 확인한다.
```
kubectl exec -it pod/hostpath -- /bin/sh
ls -al /data/shared
```

### Network Volume : NFS

#### 네트워크 볼륨생성에 필요한 스토리지 클래스를 확인해 보자.
```
kubectl get storageclass
```

```
NAME                    PROVISIONER          RECLAIMPOLICY   VOLUMEBINDINGMODE     
azurefile               file.csi.azure.com   Delete          Immediate              
azurefile-csi           file.csi.azure.com   Delete          Immediate              
azurefile-csi-premium   file.csi.azure.com   Delete          Immediate              
azurefile-premium       file.csi.azure.com   Delete          Immediate              
default (default)       disk.csi.azure.com   Delete          WaitForFirstConsumer   
managed                 disk.csi.azure.com   Delete          WaitForFirstConsumer   
managed-csi             disk.csi.azure.com   Delete          WaitForFirstConsumer   
managed-csi-premium     disk.csi.azure.com   Delete          WaitForFirstConsumer   
managed-premium         disk.csi.azure.com   Delete          WaitForFirstConsumer   
```

- 아래 YAML로 PVC(Persistence Volume Claim)를 생성하자.
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azurefile
spec:
  accessModes:
  - ReadWriteMany
  storageClassName: azurefile
  resources:
    requests:
      storage: 1Gi
EOF
```

```
kubectl get pvc
```

####  NFS 볼륨을 가지는 주문마이크로서비스 배포

```
kubectl apply -f - <<EOF
apiVersion: "apps/v1"
kind: "Deployment"
metadata: 
  name: order
  labels: 
    app: "order"
spec: 
  selector: 
    matchLabels: 
      app: "order"
  replicas: 1
  template: 
    metadata: 
      labels: 
        app: "order"
    spec: 
      containers: 
      - name: "order"
        image: "ghcr.io/acmexii/order-liveness:latest"
        ports: 
          - containerPort: 80
        volumeMounts:
          - mountPath: "/mnt/data"
            name: volume
      volumes:
      - name: volume
        persistentVolumeClaim:
          claimName: azurefile  
EOF
```

- 배포 후 주문 컨테이너에 접속하여 제대로 파일시스템이 마운트되었는지 확인한다.
```
kubectl get all
kubectl exec -it [pod/ORDER POD 객체] -- /bin/sh
cd /mnt/data
echo "NFS Strorage Test.. " > test.txt
```

- 이후, 주문서비스를 2개로 Scale Out하고 확장된 주문 서비스에서도 test.txt가 확인되는지 검증한다.
- 또한, 2번째 컨테이너에서도 리소스를 생성해 본다. (ReadWriteMany)
```
kubectl scale deploy order --replicas=2
kubectl exec -it [pod/ORDER POD 객체] -- /bin/sh
ls /mnt/data
echo "NFS Strorage Test2.. " > test2.txt
```
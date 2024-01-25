---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Persistent Volume

Based on the provided 12th event storming model, utilize the deployment modeling tool provided by MSAEZ to automatically generate the manifest YAML for Kubernetes objects. Apply these manifests to the cluster to set up storage.

## Event Storming Model Preparation

- Load the model from the link in a new tab.
**[Model Link](https://www.msaez.io/#/storming/mallbasic-for-ops)**
- If the model doesn't load in the browser, click on the avatar icon (person-shaped) in the upper right, log in with your **Github** account, and reload.
- The 12th event storming model consisting of orders, delivery, and products should appear.
- The loaded model will not display the sticker list in the right palette. Click on the FORK icon in the top menu to clone the given model.

![image](https://github.com/acmexii/demo/assets/35618409/1e16e849-7ae9-4b33-b39c-db4ef0939507)
- The sticker list should now appear in the right palette.


## Deployment Modeling

- Add Ingress topping to the forked model.
- Adding Ingress topping is as simple as going to **Code** > **Preview** > **Toppings** in the menu and checking Ingress under Service Mesh.

![image](https://github.com/acmexii/demo/assets/35618409/a55fc02b-2c67-492e-a233-10aee09d3cee)

- With Ingress applied, click on **DEPLOY** in the top menu.

![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

- The Kubernetes default deployment model, which includes Services and Deployments, will now show an added Ingress diagram at the top of the service stack.

![image](https://github.com/acmexii/demo/assets/35618409/9a3ffc7d-4910-4b6f-b3a7-0178f15abb17)

- Additionally, automatic path names for routing from the Ingress gateway to each individual service will be displayed.

- Use a Cloud IDE to generate and push images for each service. Then, set the created image names in the Deployment objects.



## Persistence Object Modeling

- In the modeling tool, select **Persistence** > **PersistentVolumeClaim** to create a PVC sticker.

![image](https://github.com/acmexii/demo/assets/35618409/5d4b0cc8-7159-4aab-ab72-9c424efd896f)

- Double-click on the created PVC sticker and input the storage information for the order service as follows:

> Name : o-data

> Access Modes : ReadWriteOnce

> Storage : 10 Gi

> Volume Mode : Filesystem

![image](https://github.com/acmexii/demo/assets/35618409/298d7014-97f7-4eb8-b5e1-c8949989ca51)

- At this point, delete line 14 (storageClassName) in the YAML spec to use the default storage class (Provisioner) set by most CSPs.
- Next, click on the **order** Deployment object, use the arrow tool to map it to the **o-data** PVC.

![image](https://github.com/acmexii/demo/assets/35618409/be3accc4-bda3-473d-8745-3e04eae4c2ac)

- Once the mapping is set, the order service deployment YAML spec will automatically include volume mount information using the **o-data** storage.

![image](https://github.com/acmexii/demo/assets/35618409/22696b78-e9a3-4b2e-afa9-06845f376174)

- Apply the same volume modeling to the delivery and product services.

![image](https://github.com/acmexii/demo/assets/35618409/e7f9d971-148c-4f7d-a9a0-ea90e3fdf300)


## Deploy to the Cluster

- Manually deploy using the client (kubectl) on the configured cluster context.
```
kubectl apply -f kubernetes/template/template.yml
```
- If Kafka is not installed on the target cluster, install Kafka using Helm.
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-kafka bitnami/kafka --version 23.0.5
```
- If there is no Ingress Controller, install the Ingress Controller.
```
helm repo add stable https://charts.helm.sh/stable
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
kubectl create namespace ingress-basic

helm install nginx-ingress ingress-nginx/ingress-nginx --namespace=ingress-basic
```

- Check the deployed PVCs.
```
kubectl get pvc 
```
- The deployed PVC specs will be displayed, similar to the following (example from GCP):
```
NAME              STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
d-data            Bound    pvc-05cadaa8-0dd4-407f-85f5-d25fbb02939b   10Gi       RWO            standard-rwo   49m
data-my-kafka-0   Bound    pvc-676d0c9d-043d-41bd-ba57-b9397e63b565   8Gi        RWO            standard-rwo   125m
o-data            Bound    pvc-6b3a94e4-d7e6-42f3-9c4c-d4cc675db94d   10Gi       RWO            standard-rwo   49m
p-data            Bound    pvc-ab492454-4c05-4e58-8462-67d8e0f7c3aa   10Gi       RWO            standard-rwo   49m
```

## Verify Order Container Storage

- Access the order container to check the bound storage and create data.
```
kubectl exec -it pod/ORDER object -- /bin/sh
ls /data
```
- The storage size specified in the PVC claim will be visible, showcasing the supported storage by the cloud service provider.


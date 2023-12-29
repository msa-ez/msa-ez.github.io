---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# 12st Mall Basic Deploy

## Instruction

Based on the provided 12th event storming model, use the deployment modeling tool provided by MSA-Ez to automatically generate the manifest YAML for Kubernetes objects. Apply these manifests to the cluster for deployment.

## Event Storming Model Preparation

- Load the model from the link in a new tab.
[Model Link : https://www.msaez.io/#/storming/mallbasic-for-ops](https://www.msaez.io/#/storming/mallbasic-for-ops)
- If the model doesn't load in the browser, click on the avatar icon (person-shaped) in the upper right, log in with your Github account, and reload.
- The 12th event storming model consisting of orders, delivery, and products should appear.
- The loaded model will not display the sticker list in the right palette. Click on the FORK icon in the top menu to clone the given model.
![image](https://github.com/acmexii/demo/assets/35618409/1e16e849-7ae9-4b33-b39c-db4ef0939507)
- The sticker list should now appear in the right palette.

## Deployment Modeling

- Click on 'DEPLOY' in the model's top menu.
![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

- The default Kubernetes deployment model, including Services and Deployments, will be displayed, organized by bounded context.
![image](https://github.com/acmexii/demo/assets/35618409/ad81f353-7b71-4381-bd42-3ceb25a1a698)

- First, complete the business logic using Cloud IDE. Dockerize each service by generating Docker images and pushing them to the repository.
- For the order service:
```
cd order
mvn package -B -Dmaven.test.skip=true
docker build -t [dockerhub ID]/order:v1 .     
docker image ls
docker push [dockerhub ID]/order:v1 .
``` 

- In the properties pane that appears when clicking on the Deployment object for each service, enter the image as follows.
![image](https://github.com/acmexii/demo/assets/35618409/0aa6cb13-65b0-49b9-a243-e78b7d21a709)

- Click on 'KUBECTL' in the upper right of the deployment model to view the deployment manifest YAML.
![image](https://github.com/acmexii/demo/assets/35618409/70cfdffa-bacd-4f63-bc4e-5f40b9ad8999)

- The merged deployment specifications will be shown in template.yml.

## Manually Deploy to the Cluster

- Manually deploy using the client (kubectl) on the configured cluster context.
```
kubectl apply -f kubernetes/template/template.yml
```

- Check the deployment results.
```
kubectl get all 
```
- The Pods constituting the 12th service should be visible and running correctly.
```
NAME                            READY   STATUS    RESTARTS   AGE
pod/delivery-7d748d7678-wnpcq   1/1     Running   0          37s
pod/order-647876474-lj9ls       1/1     Running   0          37s
pod/product-5849b8c769-d48vp    1/1     Running   0          37s

NAME                 TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/delivery     ClusterIP   10.36.14.79   <none>        8080/TCP   37s
service/kubernetes   ClusterIP   10.36.0.1     <none>        443/TCP    26m
service/order        ClusterIP   10.36.7.182   <none>        8080/TCP   37s
service/product      ClusterIP   10.36.9.129   <none>        8080/TCP   36s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/delivery   0/1     1            1           37s
deployment.apps/order      0/1     1            1           38s
deployment.apps/product    0/1     1            1           37s

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/delivery-7d748d7678   1         1         1       37s
replicaset.apps/order-647876474       1         1         1       37s
replicaset.apps/product-5849b8c769    1         1         1       37s
```

## Understanding On-Prem MSA-Ez Deployment

- On-Prem MSA-Ez provides automated toolchains for building and deploying microservices.
- Depending on the version of the event storming model, each service image is tagged, built, and pushed to the configured Harbor container registry.
- Subsequently, the manifest YAML is updated, and Argo CD, based on GitOps configuration, automatically detects and deploys it to the specified cluster.
![image](https://github.com/acmexii/demo/assets/35618409/4a51c1e3-400f-4d5b-8d0a-edb742f12e94)

- Check the Argo endpoint.
```
kubectl get svc argocd-server -n argocd
```

- Access the endpoint from a browser.
```
ID : admin
password : kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

- The deployment progress and results based on the configured deployment strategy can be checked as follows.
![image](https://github.com/acmexii/demo/assets/35618409/f9201dfb-5a29-42eb-9b89-df90b380609d)




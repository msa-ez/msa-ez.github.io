---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Ingress Deployment Model Design

Based on the provided 12th event storming model, utilize the deployment modeling tool provided by MSAEZ to automatically generate the manifest YAML for Kubernetes objects. Apply these manifests to the cluster.

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
- Adding the Ingress topping is as simple as going to **Code** > **Preview** > **Toppings** in the menu and checking Ingress under Service Mesh.

![image](https://github.com/acmexii/demo/assets/35618409/a55fc02b-2c67-492e-a233-10aee09d3cee)

- With Ingress applied, click on **DEPLOY** in the top menu.

![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

- You should now see a diagram of services with the addition of Ingress on top.

![image](https://github.com/acmexii/demo/assets/35618409/9a3ffc7d-4910-4b6f-b3a7-0178f15abb17)
- Additionally, automatic path routing from the Ingress gateway to each individual service is automatically configured.

- Similar to the previous lab (12st Mall Deployment Model Diagramming and Utilization), use the Cloud IDE to complete the business logic, dockerize each service, and push the Docker images to the repository.
- For the order service:
```
cd order
mvn package -B -Dmaven.test.skip=true
docker build -t [dockerhub ID]/order:v1 .     
docker image ls
docker push [dockerhub ID]/order:v1 .
``` 

- In the properties window that appears when clicking on the Deployment object model for each service, set the image as follows:

![image](https://github.com/acmexii/demo/assets/35618409/936467d7-be76-4686-97f5-fe592786831b)

- Click on **KUBECTL** in the top right of the deployment model to view the deployment manifest YAML.

![image](https://github.com/acmexii/demo/assets/35618409/97cdb8d0-2c87-4f1d-a464-e63df1540556)

- The deployment specifications, including Ingress, are merged into one YAML on the template.yml and can be viewed.

## Manually Deploying to the Cluster

- Manually deploy using the client (kubectl) on the configured cluster context.
```
kubectl apply -f kubernetes/template/template.yml
```
- If there is no Ingress Controller, install the Ingress Controller using Helm.
```
helm repo add stable https://charts.helm.sh/stable
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
kubectl create namespace ingress-basic

helm install nginx-ingress ingress-nginx/ingress-nginx --namespace=ingress-basic
```

- Check the deployment results.
```
kubectl get ingress -o yaml 
```
- The deployed Ingress routing specifications are displayed as follows:
```
apiVersion: v1
items:
- apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    annotations:
    ...
    ...
  spec:
    rules:
    - http:
        paths:
        - backend:
            service:
              name: order
              port:
                number: 8080
          path: /orders
          pathType: Prefix
        - backend:
            service:
              name: product
              port:
                number: 8080
          path: /products
          pathType: Prefix
        - backend:
            service:
              name: delivery
              port:
                number: 8080
          path: /deliveries
          pathType: Prefix
    ...
    ...          
```

---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Automatic Scaling (HPA) Deployment

Based on the provided 12th event storming model, utilize the deployment modeling tool provided by MSA-Ez to model the Horizontal Pod Autoscaler (HPA) manifest for workload automatic scaling. Apply this to the cluster afterward.


## Event Storming Model Preparation

- Load the model from the link in a new tab.
[Model Link](https://www.msaez.io/#/storming/mallbasic-for-ops)
- If the model doesn't load in the browser, click on the avatar icon (person-shaped) in the upper right, log in with your Github account, and reload.
- The 12th event storming model consisting of orders, delivery, and products should appear.
- The loaded model will not display the sticker list in the right palette. Click on the FORK icon in the top menu to clone the given model.
![image](https://github.com/acmexii/demo/assets/35618409/1e16e849-7ae9-4b33-b39c-db4ef0939507)
- The sticker list should now appear in the right palette.

## Deployment Modeling

- Add Ingress topping to the forked model.
- Adding the Ingress topping is as simple as going to 'Code' > 'Preview' > 'Toppings' in the menu and checking the Ingress under Service Mesh.
![image](https://github.com/acmexii/demo/assets/35618409/a55fc02b-2c67-492e-a233-10aee09d3cee)

- With Ingress applied, click on 'DEPLOY' in the top menu.
![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

- You should now see a diagram of services with the addition of Ingress on top.
![image](https://github.com/acmexii/demo/assets/35618409/9a3ffc7d-4910-4b6f-b3a7-0178f15abb17)
- Additionally, automatic path routing from the Ingress gateway to each individual service is automatically configured.

- Use the Cloud IDE to create and push images for each service. Then, set the created image names in the Deployment objects.

## Modeling HPA Objects

- HPA automatically updates workload resources and scales the size of the workload automatically based on demand.
- In the modeling tool area, select 'Autoscaler' > 'Horizontal Pod Authscaler' to create an HPA sticker.
![image](https://github.com/acmexii/demo/assets/35618409/5cc1cdf8-11e0-4fc0-a47a-14173c3317e8)

- Double-click the created HPA sticker and enter the HPA object information for the order service as follows:
> Name : order-hpa
> Replicas : Min-1, Max-5
> Resource Type : cpu
> AverageUtilization : 20
- 'Map 'order-hpa' to Deployment 'order'.
![image](https://github.com/acmexii/demo/assets/35618409/ea13ad2b-ba9d-417f-88bc-1e624e4f5317)

- For the product service, enter the HPA object information as follows:
> Name : product-hpa
> Replicas : Min-1, Max-5
> Resource Type : memory
> AverageUtilization : 20
- Map 'product-hpa' to Deployment 'product'.
![image](https://github.com/acmexii/demo/assets/35618409/5f863b49-842c-4482-be62-4399c6e143c8)

## Deploying to the Cluster

- Deploy manually using the client (kubectl) on the configured cluster context.
```
kubectl apply -f kubernetes/template/template.yml
```
- If Kafka is not installed on the target cluster, install Kafka with Helm.
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-kafka bitnami/kafka --version 23.0.5
```
- If there is no Ingress Controller, install the Ingress Controller as well.
```
helm repo add stable https://charts.helm.sh/stable
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
kubectl create namespace ingress-basic

helm install nginx-ingress ingress-nginx/ingress-nginx --namespace=ingress-basic
```

- Check the created HPA objects for the order and product services.
```
kubectl get hpa
```
```
NAME          REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
order-hpa     Deployment/order     80%/20%   1         5         5          17m
product-hpa   Deployment/product   51%/20%   1         5         5          17m
```

## Verify Automatic Scaling

- First, install the Pod for generating workloads.
```
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: siege
spec:
  containers:
  - name: siege
    image: apexacme/siege-nginx
EOF
```

- Access the order service from the created siege pod to test if it connects.
```
kubectl exec -it siege -- /bin/bash
siege -c1 -t2S -v http://order:8080/orders
```

- Currently, there is only one instance of the order service, and test if it is connected to the order service from the 'siege' Pod.
```
siege -c20 -t40S -v http://order:8080/orders
```
- As the load increases, you can see that the order service is utilized according to the configured threshold.
```
NAME          REFERENCE            TARGETS     MINPODS   MAXPODS   REPLICAS   AGE
order-hpa     Deployment/order     422%/20%   1         5         5          22m
product-hpa   Deployment/product   55%/20%     1         5         5          22m
```

- The autoscaler automatically scaled out the order and product services based on the workload, indicating successful automatic scaling.
```
kubectl get pod -l app=order
NAME                     READY   STATUS    RESTARTS   AGE
order-55498f4b8f-b99xx   2/2     Running   0          9m5s
order-55498f4b8f-rsqdk   2/2     Running   0          9m19s
order-55498f4b8f-x9rlr   2/2     Running   0          5h59m
order-857878887c-64dnd   2/2     Running   0          9m19s
order-857878887c-ggd6k   2/2     Running   0          9m5s
```

```
kubectl get pod -l app=product
NAME                       READY   STATUS    RESTARTS   AGE
product-66d57b87db-4wqsv   2/2     Running   0          9m55s
product-66d57b87db-5wkgv   2/2     Running   0          9m25s
product-66d57b87db-n5tqt   2/2     Running   0          9m25s
product-66d57b87db-r7ljp   2/2     Running   0          11m
product-66d57b87db-zw8gw   2/2     Running   0          10m
```


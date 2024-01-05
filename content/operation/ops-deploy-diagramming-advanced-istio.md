---
description: ''
sidebar: 'started'
prev: ''
next: ''
---
# Istio Mesh

Based on the provided 12th event storming model, utilize the deployment modeling tool provided by MSA-Ez to automatically generate the manifest YAML for Kubernetes objects. Apply these manifests to the cluster.


## Event Storming Model Preparation

- Load the model from the link in a new tab.
[Model Link](https://www.msaez.io/#/storming/mallbasic-for-ops)
- If the model doesn't load in the browser, click on the avatar icon (person-shaped) in the upper right, log in with your Github account, and reload.
- The 12th event storming model consisting of orders, delivery, and products should appear. 
- The loaded model will not display the sticker list in the right palette. Click on the FORK icon in the top menu to clone the given model.
![image](https://github.com/acmexii/demo/assets/35618409/1e16e849-7ae9-4b33-b39c-db4ef0939507)
- The sticker list should now appear in the right palette.

## Deployment Modeling

- Add Istio topping to the forked model.
- Adding Istio topping is as simple as going to 'Code' > 'Preview' > 'Toppings' in the menu and checking Istio under Service Mesh.
![image](https://github.com/acmexii/demo/assets/35618409/4dfd204a-39c0-4f34-a2e6-d14802cd5d7b)

- After adding Istio topping, if you check the Kubernetes folder in the code list, you'll see 'template' > 'istio.yml' added.
![image](https://github.com/acmexii/demo/assets/35618409/5ed07284-52d9-4058-82e4-40c343d41b3f)
- The Istio CRDs objects added by MSA-Ez are as follows:
> Gateway: Istio Ingressgateway-based Istio Gateway 
> VirtualService: An object determining how requests route to which service (or Subset) and the amount of traffic it should receive.
> DestinationRule: Defines Subsets (stable, canary) for each service container and sets routing policies (load balancing, connection pool, etc.)


## Detailed Design of Istio Objects

- Click on 'DEPLOY' in the top menu to see the Istio object model.
![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

![image](https://github.com/acmexii/demo/assets/35618409/e4ee1273-bf3a-43bb-8b8b-604307c677be)
> 'main-gw' Gateway object using Istio Ingressgateway
> 'drule-order' DestinationRule object with two Subsets (stable, canary)
> 'vsvc-order' VirtualService object routing the 'order' Service with weights based on Subsets
  > Various conditions (uri, method, headers, port, source Labels, gateways, queryParams) for routing can be configured
  > The default two Subsets (stable, canary) are identical, so modifying the weights will still route to the same service, but can be used for future Blue-Green and Canary deployments
- Similar Istio CRDs objects are automatically generated for the delivery and product services.
![image](https://github.com/acmexii/demo/assets/35618409/32f67182-ef3e-4773-bfe1-fe7b49bc96b6)


## Deploy to the Cluster

- Manually deploy using the client (kubectl) on the configured cluster context.
```
kubectl apply -f kubernetes/template/template.yml
kubectl apply -f kubernetes/template/istio.yml
```
- If Istio is not installed on the target cluster, install Istio with the following commands.
```
export ISTIO_VERSION=1.18.6
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=$ISTIO_VERSION TARGET_ARCH=x86_64 sh -
```
- Move to the Istio package folder and set the execution path.
```
cd istio-$ISTIO_VERSION
export PATH=$PWD/bin:$PATH
```

- Install Istio with the 'demo' profile.
```
istioctl install --set profile=demo --set hub=gcr.io/istio-release
```
```
    ✔ Istio core installed
    ✔ Istiod installed
    ✔ Egress gateways installed
    ✔ Ingress gateways installed
    ✔ Installation complete
```
- Set Istio to be applied to the 'default' namespace.
```
kubectl label namespace default istio-injection=enabled
```

- Apply the generated istio.yml and 12st Mall deployment yaml.
```
kubectl apply -f kubernetes/template/template.yml
```

- Check the deployed services and Istio CRDs objects.
```
kubectl get pod
```
```
NAME                        READY   STATUS    RESTARTS   AGE
delivery-588b45cc85-r9bsn   2/2     Running   0          3m54s
my-kafka-0                  2/2     Running   0          5m58s
order-55498f4b8f-x9rlr      2/2     Running   0          3m54s
product-75f5b7c4fd-9wxnr    2/2     Running   0          3m54s
```
- Check the CRDs objects for routing rules for each deployed service.
```
kubectl get VirtualService
```
```
NAME            GATEWAYS      HOSTS   AGE
vsvc-delivery   ["main-gw"]   ["*"]   8m8s
vsvc-order      ["main-gw"]   ["*"]   8m8s
vsvc-product    ["main-gw"]   ["*"]   8m7s
```
- Check the CRDs objects for routing policies for each service.
```
kubectl get DestinationRule
```
```
destrule-delivery   delivery   9m22s
destrule-order      order      9m22s
destrule-product    product    9m21s
```

- Obtain the Istio Ingress Gateway address and access the order service URI (/orders).
```
curl GET [ISTIO INGRESS GATEWAY]/orders
```
```
HTTP/1.1 200 OK
content-type: application/hal+json
date: Tue, 19 Dec 2023 01:55:41 GMT
server: istio-envoy
transfer-encoding: chunked
vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers
x-envoy-upstream-service-time: 10

{
    "_links": {
        "orders": {
            "href": "http://34.22.90.243/orders{?page,size,sort}",
            "templated": true
        },
        "profile": {
            "href": "http://34.22.90.243/profile"
        }
    }
}
```
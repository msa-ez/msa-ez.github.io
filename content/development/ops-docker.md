---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Application Packaging with Container (Docker)

### How to Utilize Docker Image

#### Create an image-based Conatiner

```
docker image ls
docker run --name my-nginx -d -p 8080:80 nginx
docker run --name my-new-nginx -d -p 8081:80 nginx

docker image ls
docker container ls   # = docker ps
```  

- Check the Service
  - Cloud IDE > Labs > Open Ports > 8080
  - Cloud IDE > Labs > Open Ports > 8081

- Check by httpie
```
http :8080
http :8081
```

#### Delete Container & Image

- Before deleting the image, we must get rid of the container using them.

```
docker container ls ; // check the running container
docker container stop my-nginx  #docker stop <containerid>
docker container stop my-new-nginx
docker container rm my-nginx
docker container rm my-new-nginx
docker image rm nginx
docker images
```
- Delete all at once:
```
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)
```

#### Create Image

- Create a build script(Dockerfile) of application & image.
  - Cloud IDE > File > Folder > put in 'Docker'
  - Create two files below under the created folder.
  - Cloud IDE > File > New File > put in 'index.html'
  - Put in the line below at index.html 
  
```
   <h1> Hi~ My name is Hong Gil-Dong...~~~ </h1>
```

- Save it.
- Cloud IDE > File > New File > put in 'Dockerfile' (no extension)
- Put in the line below at Dockerfile

```
    FROM nginx
    COPY index.html /usr/share/nginx/html/
```
 
-  Save it.

- Build the image

```
docker build -t apexacme/welcome:v1 .
docker images
docker run -p 8080:80 apexacme/welcome:v1
```

#### Push Image to Remote Registry(Hub.docker.com)

- Create docker hub account
- Access to https://hub.docker.com
  - Sign-Up & E-Mail verification
 
```
docker login 
docker push apexacme/welcome:v1
# ex) If 'apexacme' is your account:
```  
> Notice: If the error 'access denied' came out, you are not logged in or you didn't make your repository name with your account name. e.g. apexacme --> your own account


#### Check the Image created at Docker Hub

- Access to https://hub.docker.com
- Reload repositories menu and check pushed images.


#### Create a Container based on Docker Hub Image

```
docker image rm apexacme/welcome:v1
docker run --name=welcome -d -p 8080:80 apexacme/welcome:v1
```  

- Check if the service is running well:
Open new terminal and put in the command below. (Menu > Terminal > New Terminal)
```
$ http localhost:8080

HTTP/1.1 200 OK
Accept-Ranges: bytes
Connection: keep-alive
Content-Length: 23
Content-Type: text/html
Date: Wed, 12 May 2021 05:12:28 GMT
ETag: "609b5cd7-17"
Last-Modified: Wed, 12 May 2021 04:43:03 GMT
Server: nginx/1.19.10

<h1> Hello world </h1>
```


### Packaging Java Application
- Open a terminal, move to order/delivery/gateway folder and run the command below.
````
cd inventory
mvn package -B -Dmaven.test.skip=true
````
- Check if the jar file has been created at target folder.
```
java -jar target/inventory-0.0.1-SNAPSHOT.jar
```
Check if we can run it by the command.
- ctrl+c to get out of jar execution.


- Check if Dockerfile is placed on the top root of order, delivery and gateway.
- Run the command below at the file path of Dockerfile. 

````
 docker login
 docker build -t [dockerhub ID]/inventory:[Today's date] .     
 docker images
 docker push [dockerhub ID]/inventory:[Today's date]  
````
 - Run it by docker run
 ```
 docker run  [dockerhub ID]/inventory:[Today's date]  
 ```


### Preview of Next Lab
Kubernetes Sandbox: https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-app/deploy-interactive/

```
$ kubectl run myhomepage --image=jinyoung/welcome:v1

deployment.apps/myhomepage created


$ kubectl expose deploy myhomepage --port=80 --type=LoadBalancer

service/myhomepage exposed


$ kubectl get svc -w
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP                                                                   PORT(S)        AGE
myhomepage   LoadBalancer   10.100.98.191   addef84b932ff416186e2166ff397d74-589148294.ap-northeast-2.elb.amazonaws.com   80:30271/TCP   9s


$ http addef84b932ff416186e2166ff397d74-589148294.ap-northeast-2.elb.amazonaws.com:80
HTTP/1.1 200 OK
Accept-Ranges: bytes
Connection: keep-alive
Content-Length: 23
Content-Type: text/html
Date: Wed, 12 May 2021 05:36:40 GMT
ETag: "609b5cd7-17"
Last-Modified: Wed, 12 May 2021 04:43:03 GMT
Server: nginx/1.19.10

<h1> Hello world </h1>


kubectl get all
NAME                              READY   STATUS    RESTARTS   AGE
pod/myhomepage-58dd9ffb74-kw5km   1/1     Running   0          17m

NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP                                                                   PORT(S)        AGE
service/myhomepage   LoadBalancer   10.100.98.191   addef84b932ff416186e2166ff397d74-589148294.ap-northeast-2.elb.amazonaws.com   80:30271/TCP   15m

NAME                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/myhomepage   1/1     1            1           17m

NAME                                    DESIRED   CURRENT   READY   AGE
replicaset.apps/myhomepage-58dd9ffb74   1         1         1       17m


$ kubectl get rs -w
NAME                    DESIRED   CURRENT   READY   AGE
myhomepage-58dd9ffb74   1         1         1       27m



#### New Terminal

$ kubectl delete po --all

pod "myhomepage-58dd9ffb74-wjf68" deleted



Check if desired & current of rs remains (pod regenerates) on the previous terminal:

myhomepage-58dd9ffb74   1         0         0       28m
myhomepage-58dd9ffb74   1         1         0       28m
myhomepage-58dd9ffb74   1         1         1       28m


```


### Using Github Container Registry

#### Login 
```
docker login ghcr.io -u <github account> -p <Personal Access Token>
```

* github account is not an e-mail address, it is github's self account string.
* To get Personal Access Token, Generate New Token at Account > Settings > Developer Settings > Personal Access Token, and give "write package" for authority and get the created token.

#### Example for Build / Push
```
docker build -t ghcr.io/jinyoung/welcome:v2021101202 .

docker push ghcr.io/jinyoung/homepage:v2021101202
```

* Add ghcr.io/ in front of image name when you build.
* Keep the same image name when you push.

#### Check the Image and Set Access Authority

You can check at Account > Your Repositories > Packages

To set authority, click Setting package, click Set Visibility, set Public at pop-up, then check the name.

#### Details
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/RO3Mw8Gks9Q" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
---
description: ''
sidebar: 'started'
---
# K8s Deployment Modeling

The 12th Microservices implemented and designed using the Domain-Driven Design (DDD) pattern are deployed and operated in a cloud-native infrastructure environment. The term 'cloud-native infrastructure environment' refers to each service that constitutes the 12th shopping mall being deployed not on a single VM but independently operated, isolated, and using container virtualization technology known as **[Docker](https://www.docker.com)**.

The management platform for these containers is called a 'container orchestrator,' with Kubernetes being a prominent example. Kubernetes provides orchestration features such as Self Healing, Auto Scale-Out, Service Mesh, Monitoring, Tracing, etc., ensuring the processes of the deployed 12th shopping mall comply with SLA while operating independently. **[More Info](http://www.kubernetes.io)**

MSAEZ is built on the foundation of Event Storming models, providing deployment diagramming tools necessary for Kubernetes cluster deployment. The designed deployment model is stored in a Git version control server and is automatically deployed using the Argo stack, which synchronizes Git versioning with the operational environment versioning. **[More Info](https://argoproj.github.io/)**

![image](../../src/img/k8s/k8s.png)


## Deployment Modeling 

The diagramming tool for Kubernetes deployment based on the Event Storming model is approached as follows:

![image](https://github.com/acmexii/demo/assets/35618409/07d45fce-528a-4261-a1e3-c100e068c6b0)

Similar to the Event Storming tool, the deployment diagramming tool consists of:

- A palette area for Kubernetes object modeling
- A canvas area for modeling
- An area for previewing the resulting deployment YAML

When accessed from the Event Storming tool, the diagramming tool reads the microservice implementation patterns configured in the model and constructs the deployment diagram with corresponding objects. Deployment personnel can complete the deployment shape on the cluster by adding orchestration objects, such as the required basic instance count and file storage, from the palette.

![image](https://github.com/acmexii/demo/assets/35618409/ad81f353-7b71-4381-bd42-3ceb25a1a698)

Detailed deployment modeling methods can be learned in the Modeling Practice menu.
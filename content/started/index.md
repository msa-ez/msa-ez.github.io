---
description: ''
sidebar: 'started'
---
# Introduction

[**MSAEZ**](https://www.msaez.io/) is an integrated platform designed to support the analysis, design, implementation, and operation of microservices. Through this platform, business experts and developers can collaboratively analyze and design the target domain using domain-centric design and event storming techniques. 

Additionally, it enables the automatic generation of source code based on Clean Architecture for each designed subdomain.

![](../../src/img/started/simage.png)

MSAEZ supports the full lifecycle of BizDevOps using ChatGPT for automation and guidance, providing an optimal execution environment for agile cloud-native application implementation.

## Key Features of MSAEZ

- **Online Event Storming Collaboration Tool**

MSAEZ provides a web-based platform with sticky note and whiteboard functionalities for online event storming collaboration. Event Storming, rooted in Domain-Driven Design (DDD), allows all stakeholders to define and understand events in the service, fostering a comprehensive approach to how events occur and their interactions.

- **Template-Based Clean Code Generation**

Leveraging the Mustache template engine, MSAEZ facilitates easy automatic generation of skeleton code from the designed model. Business developers can customize the generated code by adding various microservices patterns, referred to as "Topping," as optional features.

- **Custom Template Support**

In addition to built-in DSL templates (Java, Python, Go, NodeJS, Spring-boot-Mybatis, Spring-boot-JPA), MSAEZ allows developers to create and apply custom templates. Detailed guidelines and manuals are provided for creating custom templates, enabling optimization for the specific framework needs of organizations implementing microservices.

- **Latest OpenAI-Based Expertise Support**

MSAEZ utilizes state-of-the-art OpenAI engines, including ChatGPT, to support agile product (microservices) development. It provides interfaces within the MSAEZ tool for automating event storming, generating business logic, and facilitating automatic testing/debugging across all stages.

- **Integration with Version Control and Cloud IDE Usage**

MSAEZ supports the linkage of model-based generated code with GIT-based repositories. When MSAEZ users log in with their **GitHub** accounts, the code generated from Event Storming models is committed/pushed in real-time to their Git repository through the version control integration UI provided by MSAEZ. Moreover, the codes from the repository are instantly loaded into cloud IDEs (GitPod, CODESPACE). This integration supports DevOps developers in implementing and testing business logic in an agile environment.

Even if Event Storming design information changes while DevOps developers are utilizing the initial version model to implement business logic, the version control server's branch merge functionality seamlessly integrates design and implementation changes, avoiding conflicts.

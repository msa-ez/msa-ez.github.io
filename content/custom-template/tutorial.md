---
description: ''
sidebar: 'started'
---
# Tutorial for template design

## Custom Template
The custom template adds the desired template in addition to the provided template so that the code can be generated according to the desired template with the result of Eventstorming Model.

In order to use the EventStoring result as a desired template, a custom template must be created. Template file is largely divided into two parts, creation-related metadata and source code, and the metadata and source code are divided into “---”.

The template creation basically uses the {{ Mustache }} engine, and Mustache is the engine that brings the value in {{ }} as the key value.

Information of how the template-applied properties are created : https://intro.msaez.io/custom-template/custom-template/#custom-template

Here is a simple example of spring-boot template applied for aggregate from the model.

> AggregateRoot.java
![스크린샷 2023-03-28 오후 5 09 46](https://user-images.githubusercontent.com/113568664/228171561-6d6ca9dc-2c5d-420d-9216-4604aee2ed0c.png)

And this is how the result came out as a source code by applying the template above.

> File.java
![스크린샷 2023-03-28 오후 5 17 06](https://user-images.githubusercontent.com/113568664/228173493-2adfa72d-ea88-4dba-bce3-9af28e82d930.png)

As it is shown on the image above, the values with Mustache engine is being converted into actual source code.

Example templates for various languages/frameworks including spring-boot are here :
https://github.com/orgs/msa-ez/repositories?q=template&type=all&language=&sort= 

### How to Change Template 

If you want to change to a template of another language/framework, you can simply select it at the top of the code preview window.

![스크린샷 2023-05-16 오후 4 51 55](https://github.com/kykim97/factory-pattern/assets/113568664/452ddc05-9e5d-44e6-84fc-27a38842973a)

As an example, after changing from the existing Spring Boot to the Axon Framework template, the changes in the Aggregate file are as follows.

> AggregateRoot.java for Axon Framework
![스크린샷 2023-05-16 오후 5 17 09](https://github.com/kykim97/factory-pattern/assets/113568664/a969cc29-1612-4900-b42a-524ba3ceb5ac)

As an example, after changing from the existing Spring Boot to the Axon Framework template, the changes in the Aggregate file are as follows.

>FileAggregate.java
![스크린샷 2023-05-16 오후 5 17 54](https://github.com/kykim97/factory-pattern/assets/113568664/f3454a75-15e1-45c7-918c-55f70cfc3b6e)

As such, depending on the characteristics of each language/framework within a single file, the application of annotations and the type of dependencies to be imported change, ultimately changing the entire project itself into an application tailored to the language/framework.
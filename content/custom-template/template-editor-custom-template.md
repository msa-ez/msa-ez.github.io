---
description: ''
sidebar: 'started'
---
# Creating Custom Templates in MSAEZ
Here is a step-by-step guide on developing custom templates based on the MSAEZ model:

## 1. Creating a Repository
To develop custom templates, you need to create a repository.

Go to https://github.com/.

Create a new repository for your template files. 

![](https://github.com/msa-ez/platform/assets/123912988/b6f49e7b-4674-47a5-8ed9-69caf94fac64)

In this example, the repository is named 'custom-spring-boot' to include the template language used.

## 2. Template Selection

You need to register the repository based on the URL of the created repository.

![](https://github.com/msa-ez/platform/assets/123912988/0d2651bd-2082-413b-8536-2f8f08b9aeb1)

As shown above, click the template chip at the top left corner of the code preview to navigate to the template selection screen. Then, click the 'select' button next to the Custom Template in the list. This will bring up a screen where you can enter the Git repository URL of the repository created in the previous step. After entering the URL, click the 'APPLY' button to apply the template.

Once applied, click the 'Edit Template' icon to enter the Template Editor.

The Template Editor is an embedded feature in MSAEZ that allows you to edit the code of the selected template file and immediately see the transformed result.

## 3. Creating a folder and file

Upon entering the Template Editor, check the Template Explorer at the bottom left. 

If no folders and files are created, you need to create the template file and the folder structure for it.

![](https://github.com/msa-ez/platform/assets/123912988/1f82fd51-e869-4437-9059-b9615111da36)

To establish a basic structure, create folders by clicking the folder creation icon to the right of the selected template name in the Template Explorer, as shown in the example above.

![](https://github.com/msa-ez/platform/assets/123912988/13e15099-475b-4fd7-8a26-cce064ee3b31)

In the example, the folder structure is created based on the spring-boot structure. Subsequently, let's create a template file under the domain folder.

To create a file under the folder, click on the folder name, and then click the file creation icon on the right. Create a file such as Aggregate.java, as shown below.

![](https://github.com/msa-ez/platform/assets/123912988/0d277770-5dcd-44c0-b2eb-334077e25a67)

## 4. Verifying Template Data

Data generated through modeling in MSAEZ can be referenced, and this data can be utilized to structure the code in the template file.

As shown in the example below, in the 'MODEL EXPLORER' at the top left of the Template Editor, you can check the data generated through modeling in MSAEZ.

![](https://github.com/msa-ez/platform/assets/123912988/1181c8a3-636f-4777-9552-ce7d9670ea30)
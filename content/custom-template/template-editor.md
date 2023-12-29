---
description: ''
sidebar: 'started'
---

## 1. What is Template Editor?
Template Editor is an embedded feature within MSAEZ that allows you to edit template files and immediately see the transformed result when you modify the code.

The steps to use Template Editor in MSAEZ are as follows:

![](https://github.com/msa-ez/platform/assets/123912988/5d2ff91f-2992-474f-9104-094e6aa9dd68)

First, open the code preview of the completed model in MSAEZ.

Select the template you want, in this example, the spring-boot template.

Click on the "Edit Template" icon at the top left to access the Template Editor.

## 2. Selecting a Template File

To modify the code of the selected template, you need to first choose the template file.

![](https://github.com/msa-ez/platform/assets/123912988/d9680e6b-6a13-4f18-be78-6cf12320b442)

In the Template Editor, on the left side, you can see the 'Template Explorer' list showing the folders for the selected template. 

Navigate to the path where the template file to be modified is located, and upon selecting it, the code of the chosen template file will be displayed in the 'EDIT TEMPLATE' area.


## 3. Modifying Template Code

![](https://github.com/msa-ez/platform/assets/123912988/f77e8e08-fa7c-4ce6-bf23-acc59c2a703c)

Once the template code of Aggregate.java is displayed in the 'EDIT TEMPLATE' area, you can now freely modify the template code as desired. 

The data defined for each sticker can be easily referenced using the 'Model Explorer' on the left, making it easier to modify the code with reference to the sticker-specific data.

As an example, let's add data within the class to create {{keyFieldDescriptor.name}}.

![](https://github.com/msa-ez/platform/assets/123912988/bd096c0e-d7b9-473d-bd90-21ab2b34b8b8)

Add data within the class as shown above, then click the execute button in the top right to see the transformed result in the 'EDIT TEMPLATE' area based on the declared code.



## 4. Checking the Transformed File
After making modifications in the 'EDIT TEMPLATE' area, the transformed result appears in the right area, as shown in the example below.

![](https://github.com/msa-ez/platform/assets/123912988/e795b10f-633f-481f-9a8d-14bb10d693a8)

The 'selected file' in the top right allows you to see the types of files generated for each sticker during the modeling phase. In the example, files were generated for the User and Company stickers.

![](https://github.com/msa-ez/platform/assets/123912988/9a2516f8-166a-4816-a159-eef845cc10ab)

Selecting a file allows you to view the transformed code for the chosen file, providing a way to verify the results for each generated file.
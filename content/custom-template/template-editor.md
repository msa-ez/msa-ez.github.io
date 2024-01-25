---
description: ''
sidebar: 'started'
---
# Template Editor

After explaining how to utilize Template Editor by creating custom templates, let's delve into using the Template Editor with the templates integrated into MSAEZ.

![](https://github.com/msa-ez/platform/assets/123912988/cc4af1ed-58eb-4829-b571-8fd11fbe1dc0)

Open the code preview of the completed model.

Click the 'Base' button on the left to choose a template integrated into MSAEZ. In this example, the spring-boot template is selected.

![](https://github.com/msa-ez/platform/assets/123912988/5d2ff91f-2992-474f-9104-094e6aa9dd68)

Click the 'Edit Template' icon in the top-left to access the Template Editor.

## Choosing Template Files:

To modify the selected template's code, you need to choose the template file.

![](https://github.com/msa-ez/platform/assets/123912988/d9680e6b-6a13-4f18-be78-6cf12320b442)

In the Template Editor's left 'Template Explorer,' navigate to the folder and file of the chosen template. 

Selecting a template file updates the code displayed in the 'EDIT TEMPLATE' section.

## Editing Template Code:

![](https://github.com/msa-ez/platform/assets/123912988/f77e8e08-fa7c-4ce6-bf23-acc59c2a703c)

You can see the template code for Aggregate.java, which you selected in the previous step of choosing a template file, displayed in the 'EDIT TEMPLATE' section.

Now, in this area, you can modify the template code as desired.

Next, using the 'Model Explorer' on the left, let's refer to it to add {{keyFieldDescriptor.name}} data inside the class.

![](https://github.com/msa-ez/platform/assets/123912988/bd096c0e-d7b9-473d-bd90-21ab2b34b8b8)

As shown in the image above, after adding data inside the class, click the execute button in the top right. This will show the changed result based on the code declared in the 'EDIT TEMPLATE' section.

## Check Edited File

If you modify the code in 'EDIT TEMPLATE' and proceed with the conversion, you can confirm the converted results in the right section as shown in the example below.

![](https://github.com/msa-ez/platform/assets/123912988/7ef625b5-511e-41c9-8ab7-2c4172f03edc)

Here, you can check the 'selected file' in the top right, which indicates the types of files converted for each sticker modeled.

![](https://github.com/msa-ez/platform/assets/123912988/b327bc57-3d63-49f2-a906-a111b3c73f4d)

In this example, files for the Aggregate stickers Order and Delivery created during the modeling phase have been generated. 

By selecting a file, you can examine the converted code for the chosen file, allowing you to verify the results for each file.

## Applying Changes to Modified Files


After going through the previous steps to modify the template, you can create a new template repository or update an existing template repository using the modified template.



![](https://github.com/msa-ez/platform/assets/123912988/45263853-6e02-42ce-a8f2-103547102032)

First, select the template you modified in 'Edited Template Files' at the bottom left.

Then, scroll to the right, where you'll find the 'open git Menu' icon.

![](https://github.com/msa-ez/platform/assets/123912988/c099e3ee-10b5-4016-9cbf-168ecb5f90ac)

Click the icon, as shown in the image above, allows you to create it in your **GitHub** account repository. After renaming the repository according to your purpose, clicking 'Create' will generate the GitHub repository with the specified name.
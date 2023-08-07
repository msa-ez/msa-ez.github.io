---
description: ''
sidebar: 'started'
---
# Creating Custom Template

## Custom Template

## concept

The custom template adds the desired template in addition to the provided template so that the code can be generated according to the desired template with the EventStorming result.

## Template Description

In order to use the EventStoring result as a desired template, a custom template must be created. Template file is largely divided into two parts, creation-related metadata and source code, and the metadata and source code are divided into “---”.
 
The template creation basically uses the {{ Mustache }} engine, and Mustache is the engine that brings the value in {{ }} as the key value.

## Create a template

Purpose: Creates HelloWorld.py file as an example and displays the names created by using the print function for the results of EventStoming.

1. Create HelloWorld.py file as below.


<pre class=" language-python">

forEach: BoundedContext ----- 1
fileName: HelloWorld.py ----- 2
path: {{boundedContext}}/{{{options.packagePath}}} ----- 3
---
print("BoundedContext: {{name}}");

{{#aggregates}}

print("Aggregate: {{name}}");

{{#events}}

print("event: {{name}}");

{{/events}}

{{#commands}}

print("command: {{name}}");

{{/commands}}

{{#policies}}

print("policy: {{name}}");

{{/policies}}

{{/aggregates}}

</pre>

The value for each metadata can be written by referring to the following.

| Number | Name       | Detail of fuction           |
| -- | -------- | ---------------- |
| 1  | forEach  | The creation unit object of the file. |
| 2  | filename | The name of the file to be created  |
| 3  | path     | path to the file's creation  |

2. Put the created HelloWorld.py file in the ./public/static/template/helloWorld folder.

3. After putting the template, if you check the template selection part in the code     preview, you can see that the HelloWorld template has been added as shown in the figure below.

> ![](../../src/img/image67.png)
> <p align="center">그림 HelloWorld 템플릿 선택</p>

4. You can see that a file called HelloWorld.py is created in the folder with each Bounded Context name.

5. Check each of the two HelloWorld.py.

> ![](../../src/img/image68.png)

> ![](../../src/img/image69.png)

You can check that the names of the elements input in each Bounded Context are normally input in the print function.

6. Download the contents of the template and run it.

> ![](../../src/img/image70.png)

> ![](../../src/img/image71.png)

7. Through the created EventStorming, HelloWorld.py is created for each Bounded Context, and you can see that the names of each BoundedContext, Aggregate, Event, Command, and Policy are output in HelloWorld.py.

## Template creation variables

### · Common Variables (except BoundedContext)

| variable name      | variable role                                         |
| ------------------- | --------------------------------------------------- |
| name                | name written on sticky note                        |
| nameCamelCase       | CamelCase conversion result of name written on sticky note         |
| namePascalCase      | PascalCase conversion result of name written on sticky note  |
| boundedContext      | BoundedContext name to which it belongs         |
| options.package     | Package Name (ProjectName)                       |
| options.packagePath | package path ( src/main/java/{{ projectName }} for java) |

### · BoundedContext variable

<table>
<thead>
<tr class="header">
<th>variable name</th>
<th>variable role</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td>BoundedContext name</td>
</tr>
<tr class="even">
<td>aggregates</td>
<td><p>List of Aggregates belonging to that BoundedContext</p>
<p>(Variable of Aggregate written at the bottom can be used)</p></td>
</tr>
<tr class="odd">
<td>portGenerated</td>
<td>Created port number (starting from 8081)</td>
</tr>
</tbody>
</table>

### · Aggregate variable

<table>
<thead>
<tr class="header">
<th>variable name</th>
<th>variable role</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>aggregateRoot. fieldDescriptors</td>
<td>List of Entity in Aggregate</td>
</tr>
<tr class="even">
<td>aggregateRoot. keyFieldDescriptors</td>
<td>Aggregate key value</td>
</tr>
<tr class="odd">
<td>events</td>
<td><p>List of events belonging to Aggregate</p>
<p>(Event variables written at the bottom can be used)</p></td>
</tr>
<tr class="even">
<td>commands</td>
<td><p>List of commands belonging to Aggregate</p>
<p>(Variables of Command written at the bottom can be used)</p></td>
</tr>
<tr class="odd">
<td>policies</td>
<td><p>List of policies belonging to Aggregate</p>
<p>(Variables of Policy written at the bottom can be used)</p></td>
</tr>
</tbody>
</table>

### · Event variable

| variable name    | variable role                      |
| ---------------- | ----------------------          |
| aggregate        | Aggregate information to which you belong  |
| fieldDescriptors | Event Entity List        |
| eventToPolicy    | How to pass events to policy  |
| trigger          | Trigger related to event delivery method |

### · Command variable

| variable name     | variable role          |
| ----------- | --------------------- |
| aggregate   | Aggregate information to which you belong |
| restfulType | Which method is RestAPI?  |

### · Policy variable

| variable name     | variable role                |
| ----------------- | ---------------------- |
| aggregate         | Aggregate information to which you belong |
| eventToPolicy     | How Policy receives Events |
| relationEventInfo | Information about the connected Event |

### · View variable

| variable name               | variable role               |
| ----------------- | ---------------------- |
| aggregate         | Aggregate information to which you belong |
| dataProjection    | view's data structure method variable |
| viewFieldDescriptors | Table information according to data structure |
| aggregateEvents   | Events information of the Aggregate to which you belong |

### · fieldDescriptors
| variable name           | variable role             |
| ----------------- | ---------------------- |
| name         |  variable name |
| className    | the data type of the variable |
| isKey | Key value for table (Default: false)) |


### · viewFieldDescriptors

**CQRS**


| variable name             | variable role           |
| ----------------- | ---------------------- |
| isKey         | Key value (default: false) |
| className   | the data type of the variable |
| columnName    | variable name |
| sourceEvent | Variable from the information of the event of that variable |
| eventDirectValue   | Map eventDirectValue value to columnName value when sourceEvent occurs |
| viewColumnName   | Mapping variables from the information of the Aggregate to which they belong |
| sourceEventColumn   | Events information of the Aggregate to which you belong |

**UI Mashup**


| variable name   | variable role          |
| ----------------- | ---------------------- |
| isKey         | Key value (default: false) |
| className   | the data type of the variable |
| columnName    | variable name |
| sourceRepository   | -To be updated- |
| repositoryDirectValue   | -To be updated- |
| hateoas   | -To be updated- |
| link   | -To be updated- |



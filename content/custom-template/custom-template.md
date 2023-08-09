---
description: ''
sidebar: 'started'
---
# Custom Template Objects

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



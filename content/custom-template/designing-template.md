---
description: ''
sidebar: 'started'
---
# Developing Custom Template

## Creating Template File

Article below is the way of creating template file to convert eventstorming model into actual source code.

Following example is a source code of AggregateRoot.java file from axon template.

```
.forEach: Aggregate
fileName: {{namePascalCase}}Aggregate.java
path: {{boundedContext.name}}/{{{options.packagePath}}}/aggregate
---
package {{options.package}}.aggregate;

import org.axonframework.commandhandling.CommandHandler;
import org.axonframework.eventsourcing.EventSourcingHandler;
import org.axonframework.modelling.command.AggregateIdentifier;
import static org.axonframework.modelling.command.AggregateLifecycle.*;
import org.axonframework.spring.stereotype.Aggregate;

import org.springframework.beans.BeanUtils;
import java.util.List;
import java.util.UUID;

import lombok.Data;
import lombok.ToString;

{{#checkDateType aggregateRoot.fieldDescriptors}} {{/checkDateType}}
{{#checkBigDecimal aggregateRoot.fieldDescriptors}} {{/checkBigDecimal}}

import {{options.package}}.command.*;
import {{options.package}}.event.*;
import {{options.package}}.query.*;
```

For the first, the type of eventstorming sticker must be declared(Aggregate, Command, Policy, ...).

Then you need to set the name and the path of the file by using {{ Mustache engine }}.

And the package name must be declared, and all required libraries must be imported to each files.

```
@Aggregate
@Data
@ToString
public class {{namePascalCase}}Aggregate {

    {{#aggregateRoot.fieldDescriptors}}
    {{#isKey}}
    @AggregateIdentifier
    {{/isKey}}
    private {{{className}}} {{nameCamelCase}};
    {{/aggregateRoot.fieldDescriptors}}

    public {{namePascalCase}}Aggregate(){}

    {{#commands}}
    @CommandHandler
    {{#if (isRepositoryPost this)}}
    public {{../namePascalCase}}Aggregate({{namePascalCase}}Command command){
    {{else}}
    public void handle({{namePascalCase}}Command command){
    {{/if}}

        {{#triggerByCommand}}
        {{eventValue.namePascalCase}}Event event = new {{eventValue.namePascalCase}}Event();
        BeanUtils.copyProperties(command, event);     

        {{#if (isRepositoryPost ../this)}}
        //TODO: check key generation is properly done
        if(event.get{{@root.aggregateRoot.keyFieldDescriptor.namePascalCase}}()==null)
            event.set{{@root.aggregateRoot.keyFieldDescriptor.namePascalCase}}(createUUID());
        {{/if}}

        apply(event);

        {{#relationCommandInfo}}
        {{#commandValue}}
        //Following code causes dependency to external APIs
        // it is NOT A GOOD PRACTICE. instead, Event-Policy mapping is recommended.

        {{options.package}}.external.{{aggregate.namePascalCase}} {{aggregate.nameCamelCase}} = new {{options.package}}.external.{{aggregate.namePascalCase}}();
        // mappings goes here
        {{relationCommandInfo.boundedContext.namePascalCase}}Application.applicationContext.getBean({{options.package}}.external.{{aggregate.namePascalCase}}Service.class)
        .{{nameCamelCase}}({{aggregate.nameCamelCase}});
        {{/commandValue}}
        {{/relationCommandInfo}}
        {{/triggerByCommand}}
    }

    {{/commands}}
```

The first annotation @Aggregate indicates that the file is a template that converts aggregate stickers, and @Data & @ToString receive data from the model and convert it into String form.

Next comes the class declaration. The template creates the class name based on the name of Aggregate sticker and gets the attributes saved in it.

{{#aggregateRoot.fieldDescriptors}} plays the role of bringing attributes from the Aggregate, {{#isKey}} turns the key value of the attributes and by the annotation @AggregateIdentifier, the whole group of attributes turn into constructors of the source code.

Then the @CommandHandler appears. It takes the role of collecting informations from command stickers and convert them into methods to request domain events.

Each commands turns into methods and they work as a trigger to run the service.

```
//<<< Etc / ID Generation
    private String createUUID() {
        return UUID.randomUUID().toString();
    }
//>>> Etc / ID Generation

    {{#policies}}

//<<< Clean Arch / Port Method
    
    @CommandHandler
    public void handle({{namePascalCase}}Command command){
        {{#triggerByCommand}}
        {{eventValue.namePascalCase}}Event event = new {{eventValue.namePascalCase}}Event();
        BeanUtils.copyProperties(this, event);     
        apply(event);

        {{#relationCommandInfo}}
        {{#commandValue}}
        //Following code causes dependency to external APIs
        // it is NOT A GOOD PRACTICE. instead, Event-Policy mapping is recommended.

        {{options.package}}.external.{{aggregate.namePascalCase}} {{aggregate.nameCamelCase}} = new {{options.package}}.external.{{aggregate.namePascalCase}}();
        // mappings goes here
        {{relationCommandInfo.boundedContext.namePascalCase}}Application.applicationContext.getBean({{options.package}}.external.{{aggregate.namePascalCase}}Service.class)
        .{{nameCamelCase}}({{aggregate.nameCamelCase}});
        {{/commandValue}}
        {{/relationCommandInfo}}
        {{/triggerByCommand}}
    }
//>>> Clean Arch / Port Method

    {{/policies}}
```

For the key values of each aggregates, the template randomly creates their own UUID in string type.

Or if there are any rules for creating id declared as policy, the template brings the information and create an id to be used in handlers.

The Annotation @CommandHandler calls the command stickers and turns the action into events to run the service.

```
//<<< EDA / Event Sourcing

    {{#events}}
    
    @EventSourcingHandler
    public void on({{namePascalCase}}Event event) {

        {{#isCreationEvent}}
        BeanUtils.copyProperties(event, this);
        {{/isCreationEvent}}

        //TODO: business logic here

    }

    {{/events}}
//>>> EDA / Event Sourcing
```

The final step starts with the annotation @EventSourcingHandler.

It handles the domain events from eventstorming model and it brings on method for each events.

You can add any business logics for the domain events you want to include at your application inside @EventSourcingHandler.

### Publishing & Applying Template File

When you are done with designing custom template file, you can push it to your own GitHub Repository and utilize it to convert the eventstorming model into source code.

Click the CODE button from the board and open change template page.

> Change Template Page
![스크린샷 2023-06-08 오후 2 08 30](https://github.com/kykim97/google-drive/assets/113568664/938f205e-23c4-4d36-9613-4544acac9fe2)

Select Custom Template and put in the github repo URL of the template file you published previously.

> Put in the URL
![스크린샷 2023-06-08 오후 2 09 22](https://github.com/kykim97/google-drive/assets/113568664/b9561a53-e536-411f-862a-2e1ee81dceef)

Then check the result file converted by the template file you applied to the example model.

> Result File
![스크린샷 2023-06-08 오후 4 35 24](https://github.com/kk-young/google-drive/assets/92732781/41ea7181-2caa-47aa-aff2-b623bfd53b66)


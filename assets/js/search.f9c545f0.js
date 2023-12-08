(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{wQbG:function(e,t,a){"use strict";a.r(t);a("QWBl"),a("2B1R"),a("+2oP"),a("rB9j"),a("hByQ"),a("GKVU"),a("FZtP");var n=a("VTBJ"),o=a("YGJC"),r=a("CjXH"),i={components:{ChevronRightIcon:r.d,SearchIcon:r.j},data:function(){return{query:"",focusIndex:-1,focused:!1}},computed:{results:function(){return new o.a(this.headings,{keys:["value"],threshold:.25}).search(this.query).slice(0,15)},headings:function(){var e=[];return this.$static.allMarkdownPage.edges.map((function(e){return e.node})).forEach((function(t){t.headings.forEach((function(a){e.push(Object(n.a)({},a,{path:t.path,title:t.title}))}))})),e},showResult:function(){return this.focused&&this.query.length>0}},methods:{increment:function(){this.focusIndex<this.results.length-1&&this.focusIndex++},decrement:function(){this.focusIndex>=0&&this.focusIndex--},go:function(){var e;0!==this.results.length&&(e=-1===this.focusIndex?this.results[0]:this.results[this.focusIndex],this.$router.push(e.path+e.anchor),this.$refs.input.blur(),this.query="")}}},l=a("KHd+"),c=a("Kw5r"),d=c.a.config.optionMergeStrategies.computed,h={allMarkdownPage:{edges:[{node:{id:"e1060ebab66912c625c3067356759b40",path:"/tool/on-prem-inst/",title:"Installing on-premise MSA-Easy",headings:[{depth:1,value:"Installing on-premise MSA-Easy",anchor:"#installing-on-premise-msa-easy"},{depth:3,value:"1. Clone helm Charts",anchor:"#1-clone-helm-charts"},{depth:3,value:"2. Create & Connect Kubernetes Cluster",anchor:"#2-create--connect-kubernetes-cluster"},{depth:3,value:"3. Install helm chart-based MSA-Easy",anchor:"#3-install-helm-chart-based-msa-easy"},{depth:4,value:"1. Contents to edit from each yaml files",anchor:"#1-contents-to-edit-from-each-yaml-files"},{depth:4,value:"2. helm install on-prem .",anchor:"#2-helm-install-on-prem-"},{depth:4,value:"3. Apply issuer, secrets.yaml",anchor:"#3-apply-issuer-secretsyaml"},{depth:4,value:"4. Install ingress-nginx",anchor:"#4-install-ingress-nginx"},{depth:3,value:"4. Create & Set DNS Service Domain Record",anchor:"#4-create--set-dns-service-domain-record"},{depth:4,value:"1. Create Record",anchor:"#1-create-record"},{depth:4,value:"1. edit record(gitlab, kas, minio, registry)",anchor:"#1-edit-recordgitlab-kas-minio-registry"},{depth:4,value:"2. edit record(*, api, www, file, acebase)",anchor:"#2-edit-record-api-www-file-acebase"},{depth:3,value:"5. install operator related to ide",anchor:"#5-install-operator-related-to-ide"},{depth:4,value:"1. Install Operator",anchor:"#1-install-operator"},{depth:3,value:"6. Install NFS",anchor:"#6-install-nfs"},{depth:4,value:"1. values.yaml/disk edit(into the disk name to connect to the cluster)",anchor:"#1-bvaluesyamldiskb-editinto-the-disk-name-to-connect-to-the-cluster"},{depth:4,value:"2. install nfs",anchor:"#2-install-nfs"}]}},{node:{id:"b91c645ed9e7dc1650c0a99b0abb5fb3",path:"/tool/google-drive-examples/",title:"Google Drive Examples",headings:[{depth:1,value:"Google Drive Examples",anchor:"#google-drive-examples"},{depth:2,value:"Move on to practicing tool",anchor:"#move-on-to-practicing-tool"},{depth:2,value:"Scenario",anchor:"#scenario"},{depth:2,value:"Instructions",anchor:"#instructions"},{depth:3,value:"Modeling",anchor:"#modeling"},{depth:3,value:"Run the Project",anchor:"#run-the-project"},{depth:3,value:"Operating Web Application",anchor:"#operating-web-application"}]}},{node:{id:"400ffd49e305dca00e2f42e3be7041c2",path:"/tool/market-place/",title:"Template/Topping Market Place",headings:[{depth:1,value:"Template/Topping Market Place",anchor:"#templatetopping-market-place"},{depth:2,value:"Scheme",anchor:"#scheme"},{depth:2,value:"How-to",anchor:"#how-to"}]}},{node:{id:"f5496baae95145d628ea189af81b1cba",path:"/tool/infrastructure-modeling/",title:"Infrastructure Modeling (Kubernetes)",headings:[{depth:1,value:"Infrastructure Modeling (Kubernetes)",anchor:"#infrastructure-modeling-kubernetes"},{depth:2,value:"Getting started",anchor:"#getting-started"},{depth:2,value:"Quick Tour",anchor:"#quick-tour"},{depth:2,value:"Tutorial",anchor:"#tutorial"},{depth:3,value:"· Pod",anchor:"#·-pod"},{depth:3,value:"·\tService",anchor:"#·-service"},{depth:3,value:"·\tIngress",anchor:"#·-ingress"}]}},{node:{id:"02c7486576dd93a9ef7c84a4fbdbb6ff",path:"/templates-language/python-template/",title:"Python template ",headings:[{depth:1,value:"Python template",anchor:"#python-template"},{depth:2,value:"Python DDD Tutorial",anchor:"#python-ddd-tutorial"},{depth:3,value:"Model",anchor:"#model"},{depth:3,value:"Code",anchor:"#code"},{depth:3,value:"Test",anchor:"#test"},{depth:2,value:"python technology stack",anchor:"#python-technology-stack"},{depth:2,value:"Before creating the Template Code",anchor:"#before-creating-the-template-code"},{depth:2,value:"Python template file structure",anchor:"#python-template-file-structure"},{depth:2,value:"Template description for each model",anchor:"#template-description-for-each-model"},{depth:3,value:"· Entity.py",anchor:"#·-entitypy"},{depth:3,value:"· AbstractEvent.py",anchor:"#·-abstracteventpy"},{depth:3,value:"· Event.py",anchor:"#·-eventpy"},{depth:3,value:"· PolicyHandler.py",anchor:"#·-policyhandlerpy"},{depth:3,value:"· PolicyEvent.py",anchor:"#·-policyeventpy"},{depth:3,value:"· ExternalService.py",anchor:"#·-externalservicepy"},{depth:3,value:"· ExternalEntity.py",anchor:"#·-externalentitypy"},{depth:3,value:"· Repository.py",anchor:"#·-repositorypy"},{depth:3,value:"· Controller.py",anchor:"#·-controllerpy"},{depth:3,value:"· app.py",anchor:"#·-apppy"},{depth:2,value:"Python-specific templates",anchor:"#python-specific-templates"},{depth:3,value:"· DB.py",anchor:"#·-dbpy"},{depth:3,value:"· KafkaProcessor.py",anchor:"#·-kafkaprocessorpy"},{depth:3,value:"· util.py",anchor:"#·-utilpy"},{depth:3,value:"· Hateoas.py",anchor:"#·-hateoaspy"}]}},{node:{id:"f1b6f9c8f80642beb6cf5d87bae5acb2",path:"/tool/cloud-ide-tool/",title:"Cloud IDE",headings:[{depth:1,value:"Cloud IDE",anchor:"#cloud-ide"},{depth:2,value:"Screen composition and menu.",anchor:"#screen-composition-and-menu"},{depth:3,value:"File",anchor:"#file"},{depth:3,value:"Edit",anchor:"#edit"},{depth:3,value:"Selection",anchor:"#selection"},{depth:3,value:"View",anchor:"#view"},{depth:3,value:"Go",anchor:"#go"},{depth:3,value:"Labs",anchor:"#labs"},{depth:2,value:"Icon",anchor:"#icon"},{depth:2,value:"Example of Cloud IDE practice",anchor:"#example-of-cloud-ide-practice"},{depth:3,value:"Event storming.",anchor:"#event-storming"},{depth:3,value:"Use IDE",anchor:"#use-ide"},{depth:3,value:"Service execution.",anchor:"#service-execution"}]}},{node:{id:"8068a5512c320b946065bd53f3059364",path:"/tool/event-storming-tool/",title:"EventStorming",headings:[{depth:1,value:"EventStorming",anchor:"#eventstorming"},{depth:2,value:"Service Access",anchor:"#service-access"},{depth:2,value:"UI Introduce",anchor:"#ui-introduce"},{depth:3,value:"·\tEvent Sticker",anchor:"#·-event-sticker"},{depth:3,value:"·\tPolicy Sticker",anchor:"#·-policy-sticker"},{depth:3,value:"·\tCommand Sticker",anchor:"#·-command-sticker"},{depth:3,value:"·\tAggregate Sticker",anchor:"#·-aggregate-sticker"},{depth:3,value:"·\tBounded Context Sticker",anchor:"#·-bounded-context-sticker"},{depth:3,value:"·\tRelation",anchor:"#·-relation"},{depth:3,value:"·\tCode Preview",anchor:"#·-code-preview"},{depth:3,value:"·\tDownload Archive",anchor:"#·-download-archive"},{depth:2,value:"Build",anchor:"#build"},{depth:3,value:"·\tDownload file structure description",anchor:"#·-download-file-structure-description"},{depth:3,value:"·\tExecution",anchor:"#·-execution"},{depth:3,value:"·\tCloud deployment",anchor:"#·-cloud-deployment"},{depth:3,value:"·\tGit integration",anchor:"#·-git-integration"},{depth:3,value:"·\tCreate GCB Trigger",anchor:"#·-create-gcb-trigger"},{depth:3,value:"·\tDeploy Kubernetes",anchor:"#·-deploy-kubernetes"},{depth:3,value:"·\tCheck your Kubernetes deployment",anchor:"#·-check-your-kubernetes-deployment"},{depth:3,value:"·\tWhat to do when deployment fails",anchor:"#·-what-to-do-when-deployment-fails"}]}},{node:{id:"9302e1a1479643731a23de1ecc9bf0ba",path:"/templates-language/springboot-java-template/",title:"Spring Boot/Java Template",headings:[{depth:1,value:"Spring Boot/Java Template",anchor:"#spring-bootjava-template"},{depth:2,value:"Customization",anchor:"#customization"}]}},{node:{id:"1a4ec173c0caf01d8422998f3bbac041",path:"/templates-language/go-template/",title:"Go Template ",headings:[{depth:1,value:"Go Template",anchor:"#go-template"},{depth:2,value:"Go DDD tutorial",anchor:"#go-ddd-tutorial"},{depth:3,value:"Model",anchor:"#model"},{depth:3,value:"Code",anchor:"#code"},{depth:3,value:"Test",anchor:"#test"},{depth:3,value:"· Event.go",anchor:"#·-eventgo"},{depth:3,value:"· PolicyHandler.go",anchor:"#·-policyhandlergo"},{depth:3,value:"· PolicyEvent.go",anchor:"#·-policyeventgo"},{depth:3,value:"· ExternalService.go",anchor:"#·-externalservicego"},{depth:3,value:"· ExternalEntity.go",anchor:"#·-externalentitygo"},{depth:3,value:"· Repository.go",anchor:"#·-repositorygo"},{depth:3,value:"· Route.go",anchor:"#·-routego"},{depth:3,value:"· main.go",anchor:"#·-maingo"},{depth:2,value:"Go-only Template",anchor:"#go-only-template"},{depth:3,value:"· DB.go",anchor:"#·-dbgo"},{depth:3,value:"· KafkaProcessor.go",anchor:"#·-kafkaprocessorgo"},{depth:3,value:"· Util.go",anchor:"#·-utilgo"}]}},{node:{id:"31d31548677bf56b9f54b54f73129f77",path:"/tool/development-practice/",title:"Lecture development and practice environment",headings:[{depth:1,value:"Lecture development and practice environment",anchor:"#lecture-development-and-practice-environment"},{depth:2,value:"lecture development",anchor:"#lecture-development"},{depth:3,value:"· Create a lecture",anchor:"#·-create-a-lecture"},{depth:3,value:"· Create lab",anchor:"#·-create-lab"},{depth:3,value:"· Move and delete lab positions",anchor:"#·-move-and-delete-lab-positions"},{depth:3,value:"· instruction Editing",anchor:"#·-instruction-editing"},{depth:3,value:"· Store content",anchor:"#·-store-content"},{depth:3,value:"· quiz edit",anchor:"#·-quiz-edit"},{depth:2,value:"lecture progress",anchor:"#lecture-progress"},{depth:3,value:"· group formation",anchor:"#·-group-formation"},{depth:3,value:"· chatting",anchor:"#·-chatting"},{depth:3,value:"· error support",anchor:"#·-error-support"},{depth:3,value:"· Submit results",anchor:"#·-submit-results"},{depth:2,value:"Student Management",anchor:"#student-management"},{depth:3,value:"· compensation",anchor:"#·-compensation"},{depth:3,value:"· Fee inquiry",anchor:"#·-fee-inquiry"},{depth:3,value:"· Coupon issuance, use and inquiry",anchor:"#·-coupon-issuance-use-and-inquiry"}]}},{node:{id:"8ed77ce8968d3d2f8ebafdbbe61499e4",path:"/tool/chat-gpt/",title:"Chat GPT-based Model Generation",headings:[{depth:1,value:"Chat GPT-based Model Generation",anchor:"#chat-gpt-based-model-generation"},{depth:2,value:"Generating business model utilizing OpenAI",anchor:"#generating-business-model-utilizing-openai"},{depth:2,value:"How-to",anchor:"#how-to"},{depth:3,value:"Customer Journey Map",anchor:"#customer-journey-map"},{depth:3,value:"Business Model Canvas",anchor:"#business-model-canvas"},{depth:3,value:"Eventstorming Model",anchor:"#eventstorming-model"}]}},{node:{id:"4a38093d80a8b28fc80a5079bdf2561a",path:"/started/domain-driven/",title:"Domain-Driven Design Learning",headings:[{depth:1,value:"Domain-Driven Design Learning",anchor:"#domain-driven-design-learning"},{depth:2,value:"MSA analysis method – DDD(Domain Driven Design)",anchor:"#msa-analysis-method--ddddomain-driven-design"},{depth:2,value:"DDD outline",anchor:"#ddd-outline"},{depth:3,value:"·\tdomain model",anchor:"#·-domain-model"},{depth:3,value:"·\tBounded Context (limited context)",anchor:"#·-bounded-context-limited-context"},{depth:3,value:"·\tUbiquitous Language (domain language)",anchor:"#·-ubiquitous-language-domain-language"},{depth:2,value:"Event Storming for DDD Implementation",anchor:"#event-storming-for-ddd-implementation"}]}},{node:{id:"c9e874d6515623ddf07f96c922e50aa9",path:"/example-scenario/online-lecture/",title:"Internet lecture system",headings:[{depth:1,value:"Internet lecture system",anchor:"#internet-lecture-system"},{depth:2,value:"service scenario",anchor:"#service-scenario"},{depth:2,value:"checkpoint",anchor:"#checkpoint"},{depth:2,value:"Analysis/Design",anchor:"#analysisdesign"},{depth:3,value:"· Event Storming result",anchor:"#·-event-storming-result"},{depth:3,value:"· Hexagonal Architecture Diagram Derivation",anchor:"#·-hexagonal-architecture-diagram-derivation"},{depth:2,value:"avatar",anchor:"#avatar"},{depth:3,value:"· Application of DDD",anchor:"#·-application-of-ddd"},{depth:3,value:"· Synchronous Invocation and Fallback Handling",anchor:"#·-synchronous-invocation-and-fallback-handling"},{depth:3,value:"· Asynchronous Invocation / Temporal Decoupling / Failure Isolation / Eventual Consistency Test",anchor:"#·-asynchronous-invocation--temporal-decoupling--failure-isolation--eventual-consistency-test"},{depth:2,value:"operation",anchor:"#operation"},{depth:3,value:"· CI/CD settings",anchor:"#·-cicd-settings"},{depth:3,value:"· Synchronous Call / Circuit Breaking / Fault Isolation",anchor:"#·-synchronous-call--circuit-breaking--fault-isolation"},{depth:3,value:"· Uninterrupted redistribution",anchor:"#·-uninterrupted-redistribution"}]}},{node:{id:"b98d41e3f9616d594784c2e059cf0c14",path:"/started/",title:"Introduce",headings:[{depth:1,value:"Introduce",anchor:"#introduce"},{depth:2,value:"main Features",anchor:"#main-features"},{depth:2,value:"Background and purpose of the tool",anchor:"#background-and-purpose-of-the-tool"},{depth:3,value:"·\tEDA(Event Driven Architecture)",anchor:"#·-edaevent-driven-architecture"},{depth:3,value:"·\tTrend of Event Storming Agile Technique",anchor:"#·-trend-of-event-storming-agile-technique"},{depth:3,value:"·\tAuto creation of MSA code",anchor:"#·-auto-creation-of-msa-code"},{depth:3,value:"·\tUser-defined templates for Polyglot MSA",anchor:"#·-user-defined-templates-for-polyglot-msa"},{depth:2,value:"Effectiveness",anchor:"#effectiveness"},{depth:2,value:"Runtime Environment",anchor:"#runtime-environment"}]}},{node:{id:"0b2074ab65d81707b848ac864d536ea6",path:"/started/event-storming-learning/",title:"Event Storming Learning",headings:[{depth:1,value:"Event Storming Learning",anchor:"#event-storming-learning"},{depth:1,value:"Offline Event-Storing based MSA development",anchor:"#offline-event-storing-based-msa-development"},{depth:2,value:"Concept",anchor:"#concept"},{depth:2,value:"How to do it",anchor:"#how-to-do-it"},{depth:2,value:"Sticker type",anchor:"#sticker-type"},{depth:3,value:"· Event (Orange Sticker)",anchor:"#·-event-orange-sticker"},{depth:3,value:"· Policy (Lilac Sticker)",anchor:"#·-policy-lilac-sticker"},{depth:3,value:"· Command (Blue Sticker)",anchor:"#·-command-blue-sticker"},{depth:3,value:"· Actor (Yellow Sticker)",anchor:"#·-actor-yellow-sticker"},{depth:3,value:"· Aggregate (Yellow Sticker)",anchor:"#·-aggregate-yellow-sticker"},{depth:3,value:"· Bounded Context deduction",anchor:"#·-bounded-context-deduction"},{depth:3,value:"· Context Mapping",anchor:"#·-context-mapping"},{depth:2,value:"Orchestration",anchor:"#orchestration"},{depth:2,value:"Choreography",anchor:"#choreography"},{depth:2,value:"Implementing microservices",anchor:"#implementing-microservices"},{depth:3,value:"· Application of implementation technology for each sticky note in event storming",anchor:"#·-application-of-implementation-technology-for-each-sticky-note-in-event-storming"},{depth:3,value:"· Aggregate - Yellow",anchor:"#·-aggregate---yellow"},{depth:3,value:"· Command – Sky Blue",anchor:"#·-command--sky-blue"},{depth:3,value:"· Event - Orange",anchor:"#·-event---orange"},{depth:3,value:"· Policy - Lilac",anchor:"#·-policy---lilac"},{depth:3,value:"· Bounded Context",anchor:"#·-bounded-context"}]}},{node:{id:"41a09d1ae23d2ea4ebdf10487aa6aa3d",path:"/example-scenario/library-system/",title:"library system",headings:[{depth:1,value:"library system",anchor:"#library-system"},{depth:2,value:"Repository",anchor:"#repository"},{depth:2,value:"service scenario",anchor:"#service-scenario"},{depth:3,value:"· Functional requirements",anchor:"#·-functional-requirements"},{depth:3,value:"· Non-functional requirements",anchor:"#·-non-functional-requirements"},{depth:2,value:"checkpoint",anchor:"#checkpoint"},{depth:2,value:"Analysis/Design",anchor:"#analysisdesign"},{depth:2,value:"Implementation",anchor:"#implementation"},{depth:3,value:"· Application of DDD",anchor:"#·-application-of-ddd"},{depth:3,value:"· Synchronous and asynchronous calls",anchor:"#·-synchronous-and-asynchronous-calls"},{depth:2,value:"operation",anchor:"#operation"},{depth:3,value:"· CI/CD settings",anchor:"#·-cicd-settings"},{depth:3,value:"· autoscale out",anchor:"#·-autoscale-out"},{depth:3,value:"· Uninterrupted redistribution",anchor:"#·-uninterrupted-redistribution"}]}},{node:{id:"4b3f20a1b3a5ad2e0072c3ddb841c049",path:"/example-scenario/food-delivery/",title:"food delivery",headings:[{depth:1,value:"food delivery",anchor:"#food-delivery"},{depth:2,value:"service scenario",anchor:"#service-scenario"},{depth:2,value:"checkpoint",anchor:"#checkpoint"},{depth:2,value:"Analysis/Design",anchor:"#analysisdesign"},{depth:2,value:"avatar",anchor:"#avatar"},{depth:3,value:"· Application of DDD",anchor:"#·-application-of-ddd"},{depth:3,value:"· Polyglat Persistence",anchor:"#·-polyglat-persistence"},{depth:3,value:"· polyglot programming",anchor:"#·-polyglot-programming"},{depth:3,value:"· Synchronous Invocation and Fallback Handling",anchor:"#·-synchronous-invocation-and-fallback-handling"},{depth:3,value:"· Asynchronous call / temporal decoupling / fault isolation / eventual consistency test",anchor:"#·-asynchronous-call--temporal-decoupling--fault-isolation--eventual-consistency-test"},{depth:2,value:"operation",anchor:"#operation"},{depth:3,value:"· CI/CD settings",anchor:"#·-cicd-settings"},{depth:3,value:"· Synchronous call / circuit breaking / fault isolation",anchor:"#·-synchronous-call--circuit-breaking--fault-isolation"},{depth:3,value:"· autoscale out",anchor:"#·-autoscale-out"},{depth:3,value:"· Uninterrupted redistribution",anchor:"#·-uninterrupted-redistribution"},{depth:2,value:"Addition of new development organizations",anchor:"#addition-of-new-development-organizations"}]}},{node:{id:"5727002f6d0a904a02dc2fa2794b6efe",path:"/example-scenario/animal-hospital/",title:"Veterinary Practice Management System",headings:[{depth:1,value:"Veterinary Practice Management System",anchor:"#veterinary-practice-management-system"},{depth:2,value:"service scenario",anchor:"#service-scenario"},{depth:2,value:"Analysis/Design",anchor:"#analysisdesign"},{depth:3,value:"· Hexagonal Architecture Diagram Derivation",anchor:"#·-hexagonal-architecture-diagram-derivation"},{depth:2,value:"Implementation",anchor:"#implementation"},{depth:3,value:"· Application of DDD",anchor:"#·-application-of-ddd"},{depth:3,value:"· Synchronous Invocation and Fallback Handling",anchor:"#·-synchronous-invocation-and-fallback-handling"},{depth:3,value:"· Testing REST API after cluster application",anchor:"#·-testing-rest-api-after-cluster-application"},{depth:3,value:"· Asynchronous Invocation and Eventual Consistency",anchor:"#·-asynchronous-invocation-and-eventual-consistency"},{depth:3,value:"· API Gateway",anchor:"#·-api-gateway"},{depth:3,value:"· Application of Oauth authentication",anchor:"#·-application-of-oauth-authentication"},{depth:2,value:"operation",anchor:"#operation"},{depth:3,value:"· CI/CD settings",anchor:"#·-cicd-settings"},{depth:3,value:"· Synchronous Call / Circuit Breaking / Fault Isolation",anchor:"#·-synchronous-call--circuit-breaking--fault-isolation"},{depth:3,value:"· autoscale out",anchor:"#·-autoscale-out"},{depth:3,value:"· Uninterrupted redistribution",anchor:"#·-uninterrupted-redistribution"}]}},{node:{id:"28b3f9810c95d264729fd1b45ad2504e",path:"/custom-template/unit-test/",title:"Unit Test Creation Topping(New)",headings:[{depth:1,value:"Unit Test Creation Topping(New)",anchor:"#unit-test-creation-toppingnew"},{depth:2,value:"Scheme",anchor:"#scheme"},{depth:2,value:"Specification",anchor:"#specification"},{depth:2,value:"Application",anchor:"#application"}]}},{node:{id:"62ca8085ac028d79cee530aa8b3244cd",path:"/example-scenario/accommodation-reservation/",title:"AirBnB",headings:[{depth:1,value:"AirBnB",anchor:"#airbnb"},{depth:2,value:"service scenario",anchor:"#service-scenario"},{depth:2,value:"CheckPoint",anchor:"#checkpoint"},{depth:2,value:"Analysis/Design",anchor:"#analysisdesign"},{depth:2,value:"avatar",anchor:"#avatar"},{depth:3,value:"· CQRS",anchor:"#·-cqrs"},{depth:3,value:"· API Gateway",anchor:"#·-api-gateway"},{depth:2,value:"Correlation",anchor:"#correlation"},{depth:3,value:"· Synchronous call (Sync) and Fallback handling",anchor:"#·-synchronous-call-sync-and-fallback-handling"},{depth:3,value:"· Asynchronous Invocation / Temporal Decoupling / Failure Isolation / Eventual Consistency Test",anchor:"#·-asynchronous-invocation--temporal-decoupling--failure-isolation--eventual-consistency-test"},{depth:2,value:"operation",anchor:"#operation"},{depth:3,value:"· CI/CD settings",anchor:"#·-cicd-settings"},{depth:3,value:"· Synchronous Call / Circuit Breaking / Fault Isolation",anchor:"#·-synchronous-call--circuit-breaking--fault-isolation"},{depth:3,value:"· Uninterrupted redistribution",anchor:"#·-uninterrupted-redistribution"},{depth:2,value:"Self-healing (Liveness Probe)",anchor:"#self-healing-liveness-probe"},{depth:2,value:"Config Map/ Persistence Volume",anchor:"#config-map-persistence-volume"}]}},{node:{id:"c2576d9ac97ca5f1f5a0aa7467b98d61",path:"/custom-template/tutorial/",title:"Concept of Custom Template",headings:[{depth:1,value:"Concept of Custom Template",anchor:"#concept-of-custom-template"},{depth:2,value:"Custom Template",anchor:"#custom-template"},{depth:3,value:"How to Change Template",anchor:"#how-to-change-template"}]}},{node:{id:"d428c7e3b949b5d692b6396e1cf30d7e",path:"/custom-template/mock-server/",title:"Open API 3.0-based Mock Server Generation Topping(New)",headings:[{depth:1,value:"Open API 3.0-based Mock Server Generation Topping(New)",anchor:"#open-api-30-based-mock-server-generation-toppingnew"},{depth:2,value:"Scheme",anchor:"#scheme"},{depth:2,value:"Specification",anchor:"#specification"},{depth:2,value:"Application",anchor:"#application"}]}},{node:{id:"bf0a733516ef0a8e7fe6d72a303b397c",path:"/custom-template/custom-template/",title:"Custom Template Objects",headings:[{depth:1,value:"Custom Template Objects",anchor:"#custom-template-objects"},{depth:2,value:"Template creation variables",anchor:"#template-creation-variables"},{depth:3,value:"· Common Variables (except BoundedContext)",anchor:"#·-common-variables-except-boundedcontext"},{depth:3,value:"· BoundedContext variable",anchor:"#·-boundedcontext-variable"},{depth:3,value:"· Aggregate variable",anchor:"#·-aggregate-variable"},{depth:3,value:"· Event variable",anchor:"#·-event-variable"},{depth:3,value:"· Command variable",anchor:"#·-command-variable"},{depth:3,value:"· Policy variable",anchor:"#·-policy-variable"},{depth:3,value:"· View variable",anchor:"#·-view-variable"},{depth:3,value:"· fieldDescriptors",anchor:"#·-fielddescriptors"},{depth:3,value:"· viewFieldDescriptors",anchor:"#·-viewfielddescriptors"}]}},{node:{id:"a2ecb4086487144f927f0556c45d160e",path:"/contact/question/",title:"CONTACT",headings:[{depth:1,value:"CONTACT",anchor:"#contact"}]}},{node:{id:"15bf504980d5446888b114aa54017ac0",path:"/custom-template/designing-template/",title:"Designing Custom Template",headings:[{depth:1,value:"Designing Custom Template",anchor:"#designing-custom-template"},{depth:2,value:"Creating Template File",anchor:"#creating-template-file"},{depth:3,value:"Publishing & Applying Template File",anchor:"#publishing--applying-template-file"}]}}]}},s=function(e){var t=e.options;t.__staticData?t.__staticData.data=h:(t.__staticData=c.a.observable({data:h}),t.computed=d({$static:function(){return t.__staticData.data}},t.computed))},u=Object(l.a)(i,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"relative",on:{keydown:[function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"down",40,t.key,["Down","ArrowDown"])?null:e.increment(t)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"up",38,t.key,["Up","ArrowUp"])?null:e.decrement(t)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.go(t)}]}},[a("label",{staticClass:"relative block"},[a("span",{staticClass:"sr-only"},[e._v("Search Documentation")]),a("div",{staticClass:"absolute inset-y-0 left-0 flex items-center justify-center px-3 py-2 opacity-50"},[a("SearchIcon",{staticClass:"text-ui-typo",attrs:{size:"1.25x"}})],1),a("input",{ref:"input",staticClass:"block w-full py-2 pl-10 pr-4 border-2 rounded-lg bg-ui-sidebar border-ui-sidebar focus:bg-ui-background",class:{"rounded-b-none":e.showResult},attrs:{type:"search",placeholder:"Search Documentation..."},domProps:{value:e.query},on:{focus:function(t){e.focused=!0},blur:function(t){e.focused=!1},input:function(t){e.focusIndex=-1,e.query=t.target.value},change:function(t){e.query=t.target.value}}})]),e.showResult?a("div",{staticClass:"fixed inset-x-0 z-50 overflow-y-auto border-2 border-t-0 rounded-lg rounded-t-none shadow-lg results bg-ui-background bottom:0 sm:bottom-auto sm:absolute border-ui-sidebar",staticStyle:{"max-height":"calc(100vh - 120px)"}},[a("ul",{staticClass:"px-4 py-2 m-0"},[0===e.results.length?a("li",{staticClass:"px-2"},[e._v("\n        No results for "),a("span",{staticClass:"font-bold"},[e._v(e._s(e.query))]),e._v(".\n      ")]):e._l(e.results,(function(t,n){return a("li",{key:t.path+t.anchor,staticClass:"border-ui-sidebar",class:{"border-b":n+1!==e.results.length},on:{mouseenter:function(t){e.focusIndex=n},mousedown:e.go}},[a("g-link",{staticClass:"block p-2 -mx-2 text-base font-bold rounded-lg",class:{"bg-ui-sidebar text-ui-primary":e.focusIndex===n},attrs:{to:t.path+t.anchor}},[t.value===t.title?a("span",[e._v("\n            "+e._s(t.value)+"\n          ")]):a("span",{staticClass:"flex items-center"},[e._v("\n            "+e._s(t.title)+"\n            "),a("ChevronRightIcon",{staticClass:"mx-1",attrs:{size:"1x"}}),a("span",{staticClass:"font-normal opacity-75"},[e._v(e._s(t.value))])],1)])],1)}))],2)]):e._e()])}),[],!1,null,null,null);"function"==typeof s&&s(u);t.default=u.exports}}]);
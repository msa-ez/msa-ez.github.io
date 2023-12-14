---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Kafka Retry & Dead Letter Queue 

### Retry & DLQ

#### Kafka Retry 

- If error occurs when the Consumer is handling the message, it should be polled again.
- This process is Retry, and it could be working by a simple Kafka setting.

- Release the annotation of cloud.stream.bindings.event-in from application.yml of Inventory microservice and save it.
```sh
bindings:
  event-in:
    group: product
    destination: kafkatest
    contentType: application/json
    consumer:
      max-attempts: 3
      back-off-initial-interval: 1000
      back-off-max-interval: 1000
      back-off-multiplier: 1.0
      defaultRetryable: false  
```

- Perform 3 retries: the initial Back-off period is 1 second, and run retry in max-period of 1 second.
- Put in the error occurring code below at PolicyHandler.java of Inventory service:

```java
@StreamListener(KafkaProcessor.INPUT)
    public void wheneverOrderPlaced_DecreaseStock(@Payload OrderPlaced orderPlaced) {

			...
				
        throw new RuntimeException(); //always fail

    }
```

- Run Order and Product microservices.
```bash
cd order
mvn spring-boot:run
```
```bash
cd inventory
mvn spring-boot:run
```

- Register an order
```
http :8082/inventories id=1 stock=1000
```
- Publish Kafka Event by posting at Order service.
```
http :8081/orders productId=1 qty=3
```

- Subscribe the Message at Inventory and pull out the content.
- Check if Kafka retry performs by throw new Runtime Texception by the log of Console.

- But, 
- The message cannot be handled, so the partition Lag always remains.
```sh
./kafka-consumer-groups --bootstrap-server localhost:9092 --group inventory --describe
```
- This is an object that must be saved at separate Topic and handled by back office.

#### Kafka Dead Letter Queue(DLQ)

- The message cannot be handled by Kafka retry is called Poison pill.
- In Kafka, Poison pil is being sent to DLQ, the separate message storage.
- DLQ is another topic, and the messages those couldn't be handled normally from consumers are stacked in there.
- To set DLQ, modify application.yml of Inventory as below.
- Remove the annotation of the setting below under cloud.stream.kafka:
```yaml
bindings:
  event-in:
    consumer:
      enableDlq: true
      dlqName: dlq-kafkatest
      dlqPartitions: 1
```

- Save it and re-run Inventory microservice.

> Retry repeats as the service is running, and we can check on Console that the unhandled messages are being sent to DLQ.
> Sent to DLQ  a message with key='null' and payload='{123, 34, 101, 118, 101, 110, 116, 84, 121, 112, 1...' received from 0

- Check if the DLQ topic specified in settings has been created.
```sh
cd kafka
docker-compose exec -it kafka /bin/bash
cd /bin
./kafka-topics --bootstrap-server http://localhost:9092  --list
```

#### Kafka DLQ Test

- Publish additional Kafka Event by posting to Order service.
```
http POST :8081/orders productId=1 qty=1
```
- Try 3 retries at Product and automatically send it to DLQ.
- Check if the message has been stacked at DLQ by the command below.
```sh
./kafka-console-consumer --bootstrap-server http://localhost:9092 --topic dlq-kafkatest --from-beginning
```
- Send unhandled message to DLQ when commit mode is automatic, then increase Offset automatically so the Lag won't stack up.
```sh
./kafka-consumer-groups --bootstrap-server localhost:9092 --group inventory --describe
```
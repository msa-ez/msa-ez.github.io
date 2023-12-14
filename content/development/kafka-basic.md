---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Kafka Basic Commands

## Understanding Basic Commands for Kafka

- Get access to gitpod IDE by selecting CODE > Project IDE.
- Run kafka by docker:
```
cd kafka
docker-compose up
```
> kafka runs by two process with zookeeper server.
> docker-compose file is used for managing more than one docker service.

- Enter to shell by docker to get access to the place where kafka utilities are involved:
```
docker-compose exec -it kafka /bin/bash
cd /bin
```

- Create a Topic
```bash
./kafka-topics --bootstrap-server http://localhost:9092 --topic example --create --partitions 1 --replication-factor 1
```

- Inquire Topic List
```bash
./kafka-topics --bootstrap-server http://localhost:9092 --list    
```

- Connect to kafka producer on new terminal and publish a message.

```bash
./kafka-console-producer --broker-list http://localhost:9092 --topic example
```

- Connect to kafka consumer on new terminal and subscribe a message.
```bash
./kafka-console-consumer --bootstrap-server http://localhost:9092 --topic example --from-beginning
```
- Publish a message 'hello world'

### Kafka Consumer Group & Offsets

- consumer group list
```bash
./kafka-consumer-groups --bootstrap-server http://localhost:9092 --list
```
- Check the offset of consumer group
```bash
./kafka-consumer-groups --bootstrap-server http://localhost:9092 --group <group_id> --describe
```
- Reset the offset of consumer group
```bash
./kafka-consumer-groups --bootstrap-server http://localhost:9092 --group <group_id> --topic example --reset-offsets --to-earliest --execute
```



> There are many other resetting options, run kafka-consumer-groups for details:

```bash
 --shift-by <positive_or_negative_integer>
 --to-current
 --to-latest
 --to-offset <offset_integer>
 --to-datetime <datetime_string>
 --by-duration <duration_string>
```


## Download Kafka on Local Environment

- Kafka Download
```
wget https://dlcdn.apache.org/kafka/3.1.0/kafka_2.13-3.1.0.tgz
tar -xf kafka_2.13-3.1.0.tgz
```

- Run Kafka
```
cd kafka_2.13-3.1.0/
bin/zookeeper-server-start.sh config/zookeeper.properties &
bin/kafka-server-start.sh config/server.properties &
```

- Consuming Kafka Event (new terminal)
```
cd kafka_2.13-3.1.0/
bin/kafka-console-consumer.sh --bootstrap-server 127.0.0.1:9092 --topic petstore
```
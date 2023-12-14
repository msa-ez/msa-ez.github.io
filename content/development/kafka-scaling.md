---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# Kafka Scaling 


### Kafka Scaling 

#### Kafka Partition vs. Consumers

- When you create Kafka Topic, only one default partition is created.
- In kafka, One Partition must be matched with one Consumer and spends the message.
- If there are more Consumers having same Group id than Partition, some of the Consumers cannot be binded to the partition and cannot poll the message.
- Follow the instruction below and check the situation of the consumers who cannot poll the message.

- Run Order Service
```bash
cd order
mvn spring-boot:run
```
- Run inventory1 Service (port=8082)
```bash
cd inventory
mvn spring-boot:run
```
- Run inventory2 Service (port=8083)
```bash
cd inventory
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8083
```
> Not like inventory1, the console of inventory2 microservice shows that the partition assignment didn't happen.
> partitions assigned: []

- Check the Group information of Consumer.
```
cd kafka
docker-compose exec -it kafka /bin/bash
cd /bin

./kafka-topics --bootstrap-server 127.0.0.1:9092 --topic labshoppubsub --describe

./kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group inventory
```
> There are two Consumers(Microservice Replica) of Inventory Group but there is only one partition, so there is one matching consumer.

- For experiment, register 10 amount of stock each to the inventory of port 8082 & 8083.
```
http :8082/inventories id=1 stock=10
http :8083/inventories id=1 stock=10
```
- Register four orders:
```
http :8081/orders productId=1 qty=1
http :8081/orders productId=1 qty=1
http :8081/orders productId=1 qty=1
http :8081/orders productId=1 qty=1
```
- Check if the stock decrease for the order was occurred at only 8082 or 8083:
```
http :8082/inventories/1
http :8083/inventories/1
```

#### Kafka Partition Scale out 

- Extend Kafka Partition. 

```sh 
./kafka-topics --bootstrap-server 127.0.0.1:9092 --alter --topic labshoppubsub -partitions 2
```

- Restart Inventory2 microservice or wait for 2~3 minutes >> Partition Rebalancing occurs and Inventory2 service turns into partition assigned(a status that can poll the message).

- Check the informations of Topic & Consumer Group again.

> Consumer has been mapped to Partition 0 and 1.



- When you publish a message by POST at Order service, Inventory1 and Inventory2 recieves the message in order: the stock of 8082 and 8083 decreases by 1.

```
http :8081/orders productId=1 qty=1
http :8082/inventories
http :8083/inventories

http :8081/orders productId=1 qty=1
http :8082/inventories
http :8083/inventories

http :8081/orders productId=1 qty=1
http :8082/inventories
http :8083/inventories

```
> When the real inventory is on production, it would be produced to use same database: there would be no difference on their stock.
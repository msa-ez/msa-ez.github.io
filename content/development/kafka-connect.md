---
description: ''
sidebar: 'started'
prev: ''
next: ''
---

# CDC(Change Data Capture) with Kafka

### Kafka Connect에 의한 데이터 동기화

- Kafka Connect를 이용한 CDC(Change Data Capture)를 통해 주문팀에서 생성된 데이터가 추천상품을 위해, 패턴 분석이 필요한 마케팅팀에 동기화 되는지를 실습한다. 
- Connect는 Connector를 실행시켜주는 서버로 DB동기화시, 벤더사가 만든 Connector, 또는 OSS(Debezium, Confluent) 계열의 Connector를 사용한다. 
- Lab에서는 MySQL DB를 설치하여 CDC 테스트를 적용한다. MySQL DB는 시작과 동시에 실행된다. (3306 Open)

### Kafka 서버 실행

#### Connector 다운로드 
- Kafka Connect를 위한 JDBC 드라이브를 다운로드한다.

```sh
git clone https://github.com/acmexii/kafka-connect.git
cd kafka-connect
```

#### Kafka 수동 실행
kafka를 수동설치 후, zookeeper를 실행한다.
```sh
curl "https://archive.apache.org/dist/kafka/2.7.1/kafka_2.13-2.7.1.tgz" -o ./kafka-2.7.1.tgz
tar xvfz kafka-2.7.1.tgz
```
```
cd kafka_2.13-2.7.1/
bin/zookeeper-server-start.sh config/zookeeper.properties &
```
- 2181 포트로 zookeeper가 실행된다.
 
- 새로운 터미널에서 kafka 데몬을 실행한다.
```sh
cd kafka-connect
cd kafka_2.13-2.7.1/
bin/kafka-server-start.sh config/server.properties &
```

### Kafka Connect 서버 실행

#### JDBC Connector 설치

- Connect 서버 실행전, 동기화 대상 데이터베이스의 JDBC 드라이버를 설치한다.
- Connector를 설치할 폴더를 생성한다.

```sh
cd kafka-connect/kafka_2.13-2.7.1/
export kafka_home=$PWD
echo "export kafka_home=/workspace/kafka-cdc/kafka-connect/kafka_2.13-2.7.1/" >> ~/.bashrc
mkdir connectors
cd connectors
```
- 다운받은 confluentinc-kafka-connect-jdbc-10.2.5.zip을 복사 후 unzip 한다. 

```sh
cp ../../confluentinc-kafka-connect-jdbc-10.2.5.zip ./
unzip confluentinc-kafka-connect-jdbc-10.2.5.zip
```

- $kafka_home/config 폴더로 이동 후 connect-distributed.properties에 unzip한 폴더를 등록해 준다.
```sh
cd $kafka_home/config 
vi connect-distributed.properties
```
- 마지막 행으로 이동하여 주석을 제거한다.
```
plugin.path=/workspace/kafka-cdc/kafka-connect/kafka_2.13-2.7.1/connectors
```
- 위와 같이 편집하고 저장종료한다. 

#### Kafka Connect 서버 실행 

- Connect CDC Server를 실행한다. 
```sh
cd $kafka_home
bin/connect-distributed.sh config/connect-distributed.properties 
```
- Kafka Connect는 default 8083 포트로 실행이 된다. 


- Connect 서버 실행 후, Kafka Server의 Topic을 확인해 본다.
```sh
$kafka_home/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
````
- Connect를 위한 토픽이 추가되었다.
> connect-configs, connect-offsets, connect-status

### Connector 설치 

#### Source Connector 설치 

- Kafka connect의 REST API를 통해 Source 및 Sink connector를 등록한다. 

```curl 
curl -i -X POST -H "Accept:application/json" \
    -H  "Content-Type:application/json" http://localhost:8083/connectors/ \
    -d '{
    "name": "mysql-source-connector",
    "config": {
        "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
        "connection.url": "jdbc:mysql://localhost:3306/my-database?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8",
        "connection.user":"root",
        "connection.password":"1234",
        "mode":"incrementing",
        "useSSL":"false",
        "incrementing.column.name" : "id",
        "table.whitelist" : "ORDER_TABLE",
        "topic.prefix" : "SYNC_",
        "tasks.max" : "1"
    }
}'
```
> Connector 등록시, 'No suitable driver' 오류가 발생할 경우, Classpath에 mysql driver를 설정해 준다.

- 등록한 Connector를 확인한다.
```sh
http localhost:8083/connectors
```

#### Order 마이크로서비스 설정
- 주문 서비스가 로컬에 실행된 MySQL DB를 사용한다.
- Order의 application.yml을 열어 default profile의 datasource를 확인한다.
```yaml
  datasource:
    url: jdbc:mysql://${_DATASOURCE_ADDRESS:localhost:3306}/${_DATASOURCE_TABLESPACE:my-database}?serverTimezone=UTC&characterEncoding=UTF-8
    username: ${_DATASOURCE_USERNAME:root}
    password: ${_DATASOURCE_PASSWORD:1234}
    driverClassName: com.mysql.cj.jdbc.Driver 
```


#### 소스 테이블에 Data 입력 
- order 마이크로서비스를 기동하고 소스 테이블에 샘플데이터를 생성(주문발행)한다.

```bash
cd order
mvn spring-boot:run
```
```
http POST :8081/orders productId=1 qty=10 customerId=1000 price=10000
http POST :8081/orders productId=2 qty=20 customerId=2000 price=20000
```

- Kafka topic을 확인해 본다.
```sh
$kafka_home/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
````
- 'SYNC_ORDER_TABLE' 토픽이 추가되어 목록에 나타난다.
> Kafka Connect는 테이블 단위로 토픽이 생성되어 Provider와 Consumer간 데이터를 Sync합니다. 
```
$kafka_home/bin/kafka-console-consumer.sh --bootstrap-server 127.0.0.1:9092 --topic SYNC_ORDER_TABLE --from-beginning
```

#### Sink Connector 설치 

```curl 
curl -i -X POST -H "Accept:application/json" \
    -H  "Content-Type:application/json" http://localhost:8083/connectors/ \
    -d '{
    "name": "mysql-sink-connector",
    "config": {
        "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
        "connection.url": "jdbc:mysql://localhost:3306/my-database?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8",
        "connection.user":"root",
        "connection.password":"1234",
        "useSSL":"false",        
        "auto.create":"true",       
        "auto.evolve":"true",       
        "delete.enabled":"false",
        "tasks.max":"1",
        "topics":"SYNC_ORDER_TABLE"
    }
}'
```

#### mysql client로 복제된 테이블 확인하기 

- 새 터미널을 열고 아래 커맨드로 Mysql Client를 실행한다.
```
cd mysql
docker-compose exec -it master-server bash
mysql --user=root --password=1234
use my-database;
show tables;
```
- Kafka Connect 서버가 복제한 SYNC_ORDER_TABLE 이 존재한다.

#### SYNC_ORDER_TABLE을 사용하는 Marketing 서비스 실행

- marketing 서비스가 로컬에 실행된 MySQL DB를 사용한다.
- marketing 서비스의 application.yml을 열어 default profile의 datasource를 확인한다.

```yaml
  datasource:
    url: jdbc:mysql://${_DATASOURCE_ADDRESS:localhost:3306}/${_DATASOURCE_TABLESPACE:my-database}?serverTimezone=UTC&characterEncoding=UTF-8
    username: ${_DATASOURCE_USERNAME:root}
    password: ${_DATASOURCE_PASSWORD:1234}
    driverClassName: com.mysql.cj.jdbc.Driver 
```

- 새 터미널에서 marketing 서비스를 실행하고, 분석을 위해 동기화된 데이터를 조회한다.
```
http GET :8082/syncOrders
```
- Sink Connector를 통해 주문서비스에서 입력한 데이터가 CDC를 통해 마케팅 테이블(SYNC_ORDER_TABLE)에 복제된 데이터가 조회된다.


- 다시한번 Orders 테이블에 데이터를 입력하고 마케팅팀에 주문 데이터 동기화가 되는지 확인해 본다.

```bash
http POST :8081/orders productId=1 qty=10 customerId=1000 price=10000
http GET :8082/syncOrders
```


### Source Connector Mode 

- Lab에서 사용한 jdbc Source Connector의 incrementing 모드에서는 기존 row의 수정이나 삭제는 감지하지 못한다. 

- Mode 옵션
```
1) bulk : 데이터를 폴링할 때 마다 전체 테이블을 복사

2) incrementing : 특정 컬럼의 중가분만 감지되며, 기존 행의 수정과 삭제는 감지되지 않음
incrementing.column.name : incrementing 모드에서 새 행을 감지하는데 사용할 컬럼명

3) timestamp : timestamp형 컬럼일 경우, 새 행과 수정된 행을 감지함
timestamp.column.name : timestamp 모드에서 대상 행을 감지하는데 사용할 컬럼명

4) timestamp+incrementing : 위의 두 컬럼을 모두 사용하는 옵션
```

참고 URL: https://presentlee.tistory.com/7

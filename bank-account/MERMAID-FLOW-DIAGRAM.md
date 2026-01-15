# Bank Account CQRS System - Mermaid Flow Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph UI["🖥️ Frontend Layer"]
        React["React UI<br/>Port: 3000"]
        NavList["Navigation<br/>Components"]
        AccountList["Account List"]
        AddAccount["Add Account<br/>Form"]
    end

    subgraph Proxy["🔀 API Gateway"]
        Nginx["Nginx<br/>Port: 80"]
    end

    subgraph Commands["📝 Command Service<br/>Port: 5002"]
        CmdController["Command<br/>Controller"]
        CmdService["Command<br/>Service"]
        CmdAggregate["Aggregate<br/>Repository"]
    end

    subgraph Queries["📖 Query Service<br/>Port: 5001"]
        QueryController["Query<br/>Controller"]
        QueryService["Query<br/>Service"]
        QueryRepo["Query<br/>Repository"]
    end

    subgraph Events["📡 Event Infrastructure"]
        Kafka["Kafka Broker<br/>Port: 9092"]
        Zookeeper["Zookeeper<br/>Port: 2181"]
    end

    subgraph Storage["💾 Data Storage"]
        MongoDB["MongoDB<br/>Event Store<br/>Port: 27017"]
        MySQL["MySQL<br/>Projection DB<br/>Port: 3306"]
    end

    %% Frontend Connections
    React --> NavList
    React --> AccountList
    React --> AddAccount
    NavList --> Nginx
    AccountList --> Nginx
    AddAccount --> Nginx

    %% UI to API Gateway
    Nginx -->|Read Requests| QueryController
    Nginx -->|Write Requests| CmdController

    %% Command Flow
    CmdController --> CmdService
    CmdService --> CmdAggregate
    CmdAggregate -->|Save Event| MongoDB

    %% Event Publishing
    CmdAggregate -->|Publish Event| Kafka
    Zookeeper -->|Coordinate| Kafka

    %% Query Service Event Consumption
    Kafka -->|Consume Events| QueryService
    QueryService --> QueryRepo
    QueryRepo -->|Update Projection| MySQL

    %% Query Results
    QueryRepo -->|Fetch Data| QueryController
    QueryController -->|JSON Response| Nginx
    Nginx -->|Results| React

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef gateway fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef service fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef event fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef storage fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class React,NavList,AccountList,AddAccount frontend
    class Nginx gateway
    class CmdController,CmdService,CmdAggregate,QueryController,QueryService,QueryRepo service
    class Kafka,Zookeeper event
    class MongoDB,MySQL storage
```

---

## Detailed Write Flow (Create/Deposit/Withdraw)

```mermaid
graph LR
    A["User Action<br/>Create/Deposit/Withdraw"] -->|1. HTTP POST| B["React UI<br/>AccountList/AddAccount"]
    B -->|2. axios.post| C["Nginx Reverse Proxy<br/>Port 80"]
    C -->|3. Forward| D["Command Service<br/>Port 5002<br/>@RestController"]
    D -->|4. Create Command| E["CommandHandler"]
    E -->|5. Apply Event| F["Aggregate<br/>AccountAggregate"]
    F -->|6. Persist| G["MongoDB Event Store<br/>Event Document"]
    F -->|7. Publish Event| H["Spring Kafka<br/>Topic: account-events"]
    H -->|8. Async Process| I["Query Service<br/>Event Consumer"]
    I -->|9. Create Projection| J["JPA Repository"]
    J -->|10. Insert/Update| K["MySQL Read Model<br/>Projections Table"]
    K -->|11. Done| L["User Sees Update<br/>via Next Query"]

    style A fill:#ffcccc
    style B fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#f3e5f5
    style G fill:#fce4ec
    style H fill:#e8f5e9
    style I fill:#f3e5f5
    style J fill:#f3e5f5
    style K fill:#fce4ec
    style L fill:#c8e6c9
```

---

## Detailed Read Flow (Fetch Accounts)

```mermaid
graph LR
    A["User Clicks<br/>View Accounts"] -->|1. GET Request| B["React Component<br/>useEffect Hook"]
    B -->|2. axios.get| C["Nginx Reverse Proxy"]
    C -->|3. Forward| D["Query Service<br/>Port 5001<br/>@RestController"]
    D -->|4. Call Method| E["QueryService"]
    E -->|5. Query Data| F["JPA Repository<br/>findAll/findById"]
    F -->|6. Execute SQL| G["MySQL Database<br/>Projections Table"]
    G -->|7. ResultSet| F
    F -->|8. Entity Objects| E
    E -->|9. DTO List| D
    D -->|10. JSON Response| C
    C -->|11. HTTP 200| B
    B -->|12. setState| H["Update React State"]
    H -->|13. Render| I["Display Accounts<br/>Table/List"]

    style A fill:#ffcccc
    style B fill:#e1f5fe
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#f3e5f5
    style G fill:#fce4ec
    style H fill:#e1f5fe
    style I fill:#c8e6c9
```

---

## Event-Driven Architecture Flow

```mermaid
graph TB
    subgraph WriteModel["Write Model<br/>Command Side"]
        CmdRecv["Receive Command"]
        ValidateCmd["Validate Command"]
        CreateEvent["Create Event<br/>from Command"]
        StoreEvent["Store in MongoDB<br/>Event Store"]
    end

    subgraph EventBus["Event Bus<br/>Apache Kafka"]
        Topic["Topic: account-events"]
        Partition["Partitions<br/>for Concurrency"]
    end

    subgraph ReadModel["Read Model<br/>Query Side"]
        ConsumerGroup["Consumer Group:<br/>bankaccConsumer"]
        EventHandler["Event Handler<br/>@KafkaListener"]
        CreateProjection["Create/Update<br/>Projection"]
        StoreProjection["Store in MySQL<br/>Optimized View"]
    end

    subgraph EventTypes["Event Types"]
        AccountCreated["AccountCreatedEvent"]
        MoneyDeposited["MoneyDepositedEvent"]
        MoneyWithdrawn["MoneyWithdrawnEvent"]
    end

    CmdRecv --> ValidateCmd
    ValidateCmd --> CreateEvent
    CreateEvent --> StoreEvent
    StoreEvent --> Topic
    CreateEvent --> EventTypes

    Topic --> Partition
    Partition --> ConsumerGroup
    ConsumerGroup --> EventHandler
    EventHandler --> CreateProjection
    CreateProjection --> StoreProjection

    style WriteModel fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style EventBus fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style ReadModel fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style EventTypes fill:#fff3e0,stroke:#e65100,stroke-width:2px
```

---

## Database Schema Overview

```mermaid
graph TB
    subgraph MongoDB["MongoDB - Event Store<br/>Immutable Events"]
        Events["events collection<br/>---<br/>_id: ObjectId<br/>aggregateId: UUID<br/>eventType: String<br/>eventData: JSON<br/>timestamp: Date<br/>version: Int"]
    end

    subgraph MySQL["MySQL - Read Projections<br/>Optimized for Queries"]
        Accounts["accounts table<br/>---<br/>account_id: VARCHAR<br/>account_holder: VARCHAR<br/>balance: DECIMAL<br/>status: VARCHAR<br/>created_at: TIMESTAMP<br/>updated_at: TIMESTAMP"]
    end

    Events -->|Consumed by Query Service| Accounts

    style MongoDB fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style MySQL fill:#fce4ec,stroke:#880e4f,stroke-width:2px
```

---

## Technology Stack Mapping

```mermaid
graph TB
    subgraph Client["Client Layer"]
        ReactJS["React 18<br/>JavaScript/JSX"]
        Router["React Router<br/>Client-side Navigation"]
        Axios["Axios<br/>HTTP Client"]
    end

    subgraph Server["Backend Services"]
        SpringBoot["Spring Boot 3.3.6"]
        CmdMS["Command Microservice<br/>Java 17<br/>MongoDB Driver"]
        QueryMS["Query Microservice<br/>Java 17<br/>Spring Data JPA"]
    end

    subgraph Integration["Integration Layer"]
        Kafka["Apache Kafka<br/>Event Streaming"]
        SpringKafka["Spring Kafka<br/>Producer/Consumer"]
    end

    subgraph DataLayer["Data Layer"]
        MongoDB["MongoDB<br/>NoSQL Event Store"]
        MySQL["MySQL 8<br/>RDBMS Read Model"]
    end

    subgraph Orchestration["Orchestration"]
        Docker["Docker<br/>Containerization"]
        DockerCompose["Docker Compose<br/>Service Orchestration"]
        Nginx["Nginx<br/>Reverse Proxy/Load Balancer"]
    end

    ReactJS --> Router
    Router --> Axios
    Axios --> Nginx
    Nginx --> CmdMS
    Nginx --> QueryMS

    CmdMS --> SpringBoot
    QueryMS --> SpringBoot

    CmdMS --> SpringKafka
    QueryMS --> SpringKafka
    SpringKafka --> Kafka

    CmdMS --> MongoDB
    QueryMS --> MySQL

    Docker --> DockerCompose
    DockerCompose --> Nginx
    DockerCompose --> CmdMS
    DockerCompose --> QueryMS
    DockerCompose --> MongoDB
    DockerCompose --> MySQL
    DockerCompose --> Kafka

    style Client fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style Server fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style Integration fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style DataLayer fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style Orchestration fill:#fff3e0,stroke:#e65100,stroke-width:2px
```

---

## Request/Response Cycle Summary

| Phase | Component | Technology | Action |
|-------|-----------|-----------|--------|
| **1. User Interface** | React UI | JavaScript/React | User interacts with UI |
| **2. Client Request** | Browser | Axios HTTP Client | Makes API call |
| **3. Routing** | Nginx | Reverse Proxy | Routes to appropriate service |
| **4. Command Processing** | account.cmd | Spring Boot | Validates and processes command |
| **5. Event Storage** | MongoDB | Document Database | Persists event to event store |
| **6. Event Publishing** | Kafka Producer | Message Broker | Publishes event to topic |
| **7. Event Consumption** | Kafka Consumer | Message Broker | Query service receives event |
| **8. Projection Update** | account.query | Spring Data JPA | Updates read model |
| **9. Data Persistence** | MySQL | RDBMS | Stores optimized projection |
| **10. Query Execution** | account.query | JPA Repository | Fetches data from projections |
| **11. Response** | API Response | JSON | Returns data to frontend |
| **12. UI Update** | React State | setState/Hooks | Updates and renders UI |

---

## Port Reference Guide

```
┌─────────────────────────────────────────┐
│         SERVICE PORTS MAPPING           │
├─────────────────────────────────────────┤
│ React UI (Nginx)        │ 3000 / 80     │
│ Command Service         │ 5002          │
│ Query Service           │ 5001          │
│ MySQL Database          │ 3306          │
│ MongoDB                 │ 27017         │
│ Kafka Broker            │ 9092          │
│ Zookeeper               │ 2181          │
└─────────────────────────────────────────┘
```

---

## Key Features & CQRS Principles

### ✅ Command Side (Write Model)
- Receives commands from UI
- Creates and stores events in MongoDB
- Publishes events to Kafka
- Ensures business rule validation
- Uses MongoDB for event sourcing

### ✅ Query Side (Read Model)
- Listens to events from Kafka
- Updates optimized projections in MySQL
- Handles all read requests
- Fast query performance
- Eventually consistent with write side

### ✅ Event-Driven Communication
- Asynchronous update propagation
- Eventual consistency
- Decoupled services
- Scalable architecture
- Event audit trail

### ✅ Technology Benefits
- **Separation of Concerns**: Commands ≠ Queries
- **Scalability**: Independent scaling of read/write
- **Performance**: Optimized read models in MySQL
- **Auditability**: Complete event history
- **Resilience**: Decoupled services via events

# Bank Account CQRS E2E Flow Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Bank Account CQRS System                          │
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   React UI  │────│   Nginx     │────│ CQRS Layer  │────│ Databases   │   │
│  │ (Port 3000) │    │  Proxy      │    │             │    │             │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Detailed E2E Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              END-TO-END FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Browser   │
│  User UI    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐     ┌─────────────────────────────────────────────────────┐
│ account-ui  │────▶│                    Nginx Proxy                      │
│ (Port 3000) │     │  ┌─────────────────────────────────────────────────┐ │
└─────────────┘     │  │ Route Rules:                                   │ │
                    │  │ • /api/v1/bankAccountLookup/* ──▶ account-query │ │
                    │  │ • /api/v1/openBankAccount ──────▶ account-cmd   │ │
                    │  │ • /api/v1/depositFunds/* ───────▶ account-cmd   │ │
                    │  │ • /api/v1/withdrawFunds/* ──────▶ account-cmd   │ │
                    │  └─────────────────────────────────────────────────┘ │
                    └─────────────────────────────────────────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────────────────────┐
                    │                 CQRS LAYER                          │
                    │  ┌─────────────────┐    ┌─────────────────┐         │
                    │  │   Command Side  │    │   Query Side    │         │
                    │  │  (Write Model)  │    │ (Read Model)    │         │
                    │  │                 │    │                 │         │
                    │  │ account-cmd     │    │ account-query   │         │
                    │  │ (Port 5002)     │    │ (Port 5001)     │         │
                    │  └─────────────────┘    └─────────────────┘         │
                    └─────────────────────────────────────────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────────────────────┐
                    │              EVENT SOURCING                        │
                    │  ┌─────────────────┐    ┌─────────────────┐         │
                    │  │     Kafka       │    │   Event Bus     │         │
                    │  │   (Port 9092)   │    │                 │         │
                    │  └─────────────────┘    └─────────────────┘         │
                    └─────────────────────────────────────────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────────────────────┐
                    │                 DATABASES                           │
                    │  ┌─────────────────┐    ┌─────────────────┐         │
                    │  │    MongoDB      │    │     MySQL       │         │
                    │  │ (Command Store) │    │ (Query Store)   │         │
                    │  │  (Port 27017)   │    │  (Port 3306)    │         │
                    │  └─────────────────┘    └─────────────────┘         │
                    └─────────────────────────────────────────────────────┘
```

## Detailed Flow Scenarios

### 1. CREATE ACCOUNT FLOW

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   React UI  │────▶│   Nginx     │
│  (Browser)  │     │ (Port 3000) │     │   Proxy     │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                     ▲                     ▲
       │                     │                     │
       └───────── Response ──┴───────── Response ──┘
                 (Success/Error)

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│ account-cmd │────▶│  Command   │
│   Proxy     │     │ (Port 5002) │     │ Dispatcher │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ OpenAccount │────▶│  Aggregate  │────▶│   Event    │
│  Command    │     │   (Bank     │     │  Store     │
│             │     │  Account)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Account    │────▶│   Kafka     │────▶│ Event Bus   │
│  Opened     │     │ (Port 9092) │     │             │
│   Event     │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ account-    │────▶│  Event      │────▶│ Projection  │
│ query       │     │  Handler    │     │  Update     │
│ (Port 5001) │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MySQL     │────▶│ BankAccount │────▶│   Table     │
│ (Port 3306) │     │   Record    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2. READ ACCOUNTS FLOW

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   React UI  │────▶│   Nginx     │
│  (Browser)  │     │ (Port 3000) │     │   Proxy     │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                     ▲                     ▲
       │                     │                     │
       └───────── Response ──┴───────── Response ──┘
                 (Account List)

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│ account-    │────▶│  Query      │
│   Proxy     │     │ query       │     │ Dispatcher  │
│             │     │ (Port 5001) │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ FindAll-    │────▶│ Repository  │────▶│   MySQL     │
│ Accounts    │     │             │     │ (Port 3306) │
│   Query     │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ BankAccount │────▶│   Records   │────▶│   Result    │
│   List      │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 3. DEPOSIT FUNDS FLOW

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   React UI  │────▶│   Nginx     │
│  (Browser)  │     │ (Port 3000) │     │   Proxy     │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                     ▲                     ▲
       │                     │                     │
       └───────── Response ──┴───────── Response ──┘
                 (Success/Error)

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│ account-cmd │────▶│  Command   │
│   Proxy     │     │ (Port 5002) │     │ Dispatcher │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Deposit-    │────▶│  Aggregate  │────▶│   Event    │
│ Funds       │     │   (Bank     │     │  Store     │
│ Command     │     │  Account)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Funds       │────▶│   Kafka     │────▶│ Event Bus   │
│ Deposited   │     │ (Port 9092) │     │             │
│   Event     │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ account-    │────▶│  Event      │────▶│ Projection  │
│ query       │     │  Handler    │     │  Update     │
│ (Port 5001) │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                                             │
                                             ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MySQL     │────▶│ Balance     │────▶│   Update    │
│ (Port 3306) │     │   Update    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Component Details

### Frontend Layer
- **React UI**: Single Page Application with routing
- **Nginx Proxy**: API Gateway routing requests to appropriate services
- **Axios**: HTTP client for API communication

### CQRS Layer

#### Command Side (Write Model)
- **account-cmd**: Handles all write operations
- **Command Dispatcher**: Routes commands to appropriate handlers
- **Aggregate**: Business logic and state management
- **Event Store**: Persists events to MongoDB

#### Query Side (Read Model)
- **account-query**: Handles all read operations
- **Query Dispatcher**: Routes queries to appropriate handlers
- **Repository**: Data access layer for MySQL
- **Event Handler**: Updates projections based on events

### Event Sourcing
- **Kafka**: Message broker for event distribution
- **Event Bus**: Asynchronous communication between command and query sides
- **Eventual Consistency**: Query side updated asynchronously

### Data Layer
- **MongoDB**: Document store for event sourcing (command side)
- **MySQL**: Relational store for materialized views (query side)

## Data Flow Summary

1. **User Action** → React UI → Nginx Proxy
2. **API Routing** → Command Service (writes) or Query Service (reads)
3. **Command Processing** → Aggregate → Event Generation → MongoDB Storage
4. **Event Publishing** → Kafka → Event Bus
5. **Event Consumption** → Query Service → Projection Update → MySQL
6. **Response** → Nginx → React UI → User

## Key CQRS Principles Demonstrated

- **Separation of Concerns**: Commands vs Queries
- **Event Sourcing**: State changes as events
- **Eventual Consistency**: Asynchronous updates
- **Materialized Views**: Optimized read models
- **Domain-Driven Design**: Aggregate pattern
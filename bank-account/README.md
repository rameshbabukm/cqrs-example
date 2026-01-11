# Bank Account CQRS System Documentation

## 📋 Overview

This repository contains a complete CQRS (Command Query Responsibility Segregation) implementation for a bank account management system. The system demonstrates modern microservices architecture with event sourcing, asynchronous communication, and eventual consistency.

## 🏗️ Architecture

The system consists of multiple services orchestrated via Docker Compose:

- **Frontend**: React-based UI with routing and API integration
- **CQRS Backend**: Separate command and query services
- **Event Infrastructure**: Kafka for event streaming
- **Databases**: MongoDB (events) and MySQL (projections)

## 📚 Documentation

### 1. E2E Flow Diagram
📄 [`E2E-FLOW-DIAGRAM.md`](E2E-FLOW-DIAGRAM.md)
- Complete end-to-end flow from UI to database
- Detailed component interactions
- Data flow patterns
- CQRS principles explanation

### 2. Architecture Diagram
📄 [`ARCHITECTURE-DIAGRAM.md`](ARCHITECTURE-DIAGRAM.md)
- Visual system architecture
- Service relationships
- Data storage patterns
- Component responsibilities

### 3. Sequence Diagrams
📄 [`SEQUENCE-DIAGRAMS.md`](SEQUENCE-DIAGRAMS.md)
- Detailed interaction flows for:
  - Account creation
  - Fund deposits/withdrawals
  - Account queries
- Timing considerations
- Error handling flows
- Performance characteristics

## 🚀 Quick Start

```bash
# Clone and navigate to project
cd bank-account

# Start all services
docker-compose up --build -d

# Access the application
open http://localhost:3000
```

## 🔧 Services & Ports

| Service | Port | Purpose |
|---------|------|---------|
| account-ui | 3000 | React frontend with Nginx proxy |
| account-cmd | 5002 | Command side (writes) |
| account-query | 5001 | Query side (reads) |
| kafka | 9092 | Event streaming |
| mongodb | 27017 | Event store |
| mysql | 3306 | Read projections |
| zookeeper | 2181 | Kafka coordination |

## 📊 CQRS Flow Summary

### Write Operations (Commands)
1. **UI** → **Nginx** → **account-cmd** → **Aggregate** → **Event Store** (MongoDB)
2. **Event Publishing** → **Kafka** → **account-query** → **Projection Update** (MySQL)

### Read Operations (Queries)
1. **UI** → **Nginx** → **account-query** → **Repository** → **MySQL**

### Key Characteristics
- **Separation of Concerns**: Commands ≠ Queries
- **Event Sourcing**: Immutable event storage
- **Eventual Consistency**: Asynchronous updates
- **Materialized Views**: Optimized read models

## 🎯 User Operations

### Account Management
- ✅ **Create Account**: Open new bank accounts with initial balance
- ✅ **View Accounts**: List all accounts in tabular format
- ✅ **Deposit Funds**: Add money to existing accounts
- ✅ **Withdraw Funds**: Remove money from accounts

### UI Features
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔄 **Real-time Updates**: Automatic refresh after operations
- 🎨 **Modern Interface**: Clean, professional design
- ⚡ **Fast Navigation**: Client-side routing between pages

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern JavaScript framework
- **React Router**: Client-side navigation
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling

### Backend
- **Spring Boot**: Java microservices framework
- **CQRS Pattern**: Command-Query separation
- **Event Sourcing**: State as events
- **Kafka**: Event streaming platform

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Service orchestration
- **Nginx**: API gateway and reverse proxy
- **MongoDB**: Document database for events
- **MySQL**: Relational database for projections

## 🔄 Event Flow Example

```
1. User clicks "Create Account"
2. React UI sends POST to /api/v1/openBankAccount
3. Nginx routes to account-cmd:5002
4. Command processed, AccountOpened event stored in MongoDB
5. Event published to Kafka topic
6. account-query consumes event
7. Projection updated in MySQL
8. UI refreshes to show new account
```

## 📈 Performance & Scalability

- **Horizontal Scaling**: Services can be scaled independently
- **Eventual Consistency**: Read models updated asynchronously
- **CQRS Benefits**: Optimized reads and writes
- **Microservices**: Loose coupling between components

## 🔍 Monitoring & Debugging

```bash
# View service logs
docker-compose logs account-ui
docker-compose logs account-cmd
docker-compose logs account-query

# Check service health
docker-compose ps

# Access databases
docker-compose exec mongodb mongo
docker-compose exec mysql mysql -u root -p
```

## 📝 API Endpoints

### Commands (Write Operations)
- `POST /api/v1/openBankAccount` - Create account
- `PUT /api/v1/depositFunds/{id}` - Deposit money
- `PUT /api/v1/withdrawFunds/{id}` - Withdraw money

### Queries (Read Operations)
- `GET /api/v1/bankAccountLookup/` - List all accounts
- `GET /api/v1/bankAccountLookup/byId/{id}` - Get account by ID
- `GET /api/v1/bankAccountLookup/byHolder/{holder}` - Get by holder
- `GET /api/v1/bankAccountLookup/withBalance/{type}/{balance}` - Filter by balance

## 🎯 Learning Outcomes

This project demonstrates:
- **CQRS Architecture**: Practical implementation
- **Event Sourcing**: State management through events
- **Microservices**: Service decomposition and communication
- **Docker**: Container orchestration
- **React**: Modern frontend development
- **Spring Boot**: Enterprise Java development
- **Kafka**: Event-driven architecture

## 📚 Further Reading

- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Domain-Driven Design](https://dddcommunity.org/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/)

---

**🎉 Happy Learning!** This system serves as a comprehensive example of modern distributed systems architecture.
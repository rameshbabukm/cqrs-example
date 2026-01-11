# Bank Account CQRS Sequence Diagrams

## 1. CREATE ACCOUNT SEQUENCE

```
User Browser          React UI           Nginx Proxy        account-cmd         Aggregate          Event Store         Kafka            account-query       MySQL
    |                    |                   |                   |                   |                   |                   |                   |                   |
    | 1. Click "Add"     |                   |                   |                   |                   |                   |                   |                   |
    |------------------->|                   |                   |                   |                   |                   |                   |                   |
    |                    | 2. Navigate to    |                   |                   |                   |                   |                   |                   |
    |                    |    Add Account    |                   |                   |                   |                   |                   |                   |
    |                    |                   |                   |                   |                   |                   |                   |                   |
    | 3. Fill Form       |                   |                   |                   |                   |                   |                   |                   |
    |------------------->|                   |                   |                   |                   |                   |                   |                   |
    |                    | 4. POST /api/v1/  |                   |                   |                   |                   |                   |                   |
    |                    |    openBankAccount|                   |                   |                   |                   |                   |                   |
    |                    |------------------>|                   |                   |                   |                   |                   |                   |
    |                    |                   | 5. Route to       |                   |                   |                   |                   |                   |
    |                    |                   |    account-cmd    |                   |                   |                   |                   |                   |
    |                    |                   |------------------>|                   |                   |                   |                   |                   |
    |                    |                   |                   | 6. Receive        |                   |                   |                   |                   |
    |                    |                   |                   |    OpenAccount    |                   |                   |                   |                   |
    |                    |                   |                   |    Command        |                   |                   |                   |                   |
    |                    |                   |                   |------------------>|                   |                   |                   |                   |
    |                    |                   |                   |                   | 7. Validate &     |                   |                   |                   |
    |                    |                   |                   |                   |    Process        |                   |                   |                   |
    |                    |                   |                   |                   |    Command        |                   |                   |                   |
    |                    |                   |                   |                   |------------------>|                   |                   |                   |
    |                    |                   |                   |                   |                   | 8. Store Event    |                   |                   |
    |                    |                   |                   |                   |                   |    in MongoDB      |                   |                   |
    |                    |                   |                   |                   |                   |------------------>|                   |                   |
    |                    |                   |                   |                   |                   |                   | 9. Publish Event  |                   |
    |                    |                   |                   |                   |                   |                   |    to Kafka        |                   |
    |                    |                   |                   |                   |                   |                   |------------------>|                   |
    |                    |                   |                   |                   |                   |                   |                   | 10. Consume       |
    |                    |                   |                   |                   |                   |                   |                   |     Event          |
    |                    |                   |                   |                   |                   |                   |                   |------------------>|
    |                    |                   |                   |                   |                   |                   |                   |                   | 11. Update
    |                    |                   |                   |                   |                   |                   |                   |                   |     Projection
    |                    |                   |                   |                   |                   |                   |                   |                   |     in MySQL
    |                    |                   |                   |                   |                   |                   |                   |                   |------------------>|
    |                    |                   |                   | 12. Return        |                   |                   |                   |                   |
    |                    |                   |                   |     Success       |                   |                   |                   |                   |
    |                    |                   |<------------------|                   |                   |                   |                   |                   |
    |                    | 13. Return        |                   |                   |                   |                   |                   |                   |
    |                    |    Success        |                   |                   |                   |                   |                   |                   |
    |                    |<------------------|                   |                   |                   |                   |                   |                   |
    | 14. Show Success   |                   |                   |                   |                   |                   |                   |                   |
    |    & Redirect      |                   |                   |                   |                   |                   |                   |                   |
    |<-------------------|                   |                   |                   |                   |                   |                   |                   |
    |                    | 15. Navigate to   |                   |                   |                   |                   |                   |                   |
    |                    |    Account List   |                   |                   |                   |                   |                   |                   |
    |                    |------------------>|                   |                   |                   |                   |                   |                   |
    |                    | 16. GET /api/v1/  |                   |                   |                   |                   |                   |                   |
    |                    |    bankAccount-   |                   |                   |                   |                   |                   |                   |
    |                    |    Lookup/        |                   |                   |                   |                   |                   |                   |
    |                    |------------------>|                   |                   |                   |                   |                   |                   |
    |                    |                   | 17. Route to      |                   |                   |                   |                   |                   |
    |                    |                   |    account-query  |                   |                   |                   |                   |                   |
    |                    |                   |------------------>|                   |                   |                   |                   |                   |
    |                    |                   |                   |                   |                   |                   |                   | 18. Query MySQL   |
    |                    |                   |                   |                   |                   |                   |                   |------------------>|
    |                    |                   |                   |                   |                   |                   |                   | 19. Return Data   |
    |                    |                   |                   |                   |                   |                   |                   |<------------------|
    |                    |                   | 20. Return        |                   |                   |                   |                   |                   |
    |                    |    Account List   |                   |                   |                   |                   |                   |                   |
    |                    |<------------------|                   |                   |                   |                   |                   |                   |
    | 21. Display        |                   |                   |                   |                   |                   |                   |                   |
    |    Updated List    |                   |                   |                   |                   |                   |                   |                   |
    |<-------------------|                   |                   |                   |                   |                   |                   |                   |
```

## 2. DEPOSIT FUNDS SEQUENCE

```
User Browser          React UI           Nginx Proxy        account-cmd         Aggregate          Event Store         Kafka            account-query       MySQL
    |                    |                   |                   |                   |                   |                   |                   |                   |
    | 1. Enter Amount    |                   |                   |                   |                   |                   |                   |                   |
    | & Click Deposit    |                   |                   |                   |                   |                   |                   |                   |
    |------------------->|                   |                   |                   |                   |                   |                   |                   |
    |                    | 2. PUT /api/v1/   |                   |                   |                   |                   |                   |                   |
    |                    |    depositFunds/  |                   |                   |                   |                   |                   |                   |
    |                    |    {accountId}    |                   |                   |                   |                   |                   |                   |
    |                    |------------------>|                   |                   |                   |                   |                   |                   |
    |                    |                   | 3. Route to       |                   |                   |                   |                   |                   |
    |                    |                   |    account-cmd    |                   |                   |                   |                   |                   |
    |                    |                   |------------------>|                   |                   |                   |                   |                   |
    |                    |                   |                   | 4. Receive        |                   |                   |                   |                   |
    |                    |                   |                   |    DepositFunds   |                   |                   |                   |                   |
    |                    |                   |                   |    Command        |                   |                   |                   |                   |
    |                    |                   |                   |------------------>|                   |                   |                   |                   |
    |                    |                   |                   |                   | 5. Validate &     |                   |                   |                   |
    |                    |                   |                   |                   |    Process        |                   |                   |                   |
    |                    |                   |                   |                   |    Command        |                   |                   |                   |
    |                    |                   |                   |                   |------------------>|                   |                   |                   |
    |                    |                   |                   |                   |                   | 6. Store Event    |                   |                   |
    |                    |                   |                   |                   |                   |    in MongoDB      |                   |                   |
    |                    |                   |                   |                   |                   |------------------>|                   |                   |
    |                    |                   |                   |                   |                   |                   | 7. Publish Event  |                   |
    |                    |                   |                   |                   |                   |                   |    to Kafka        |                   |
    |                    |                   |                   |                   |                   |                   |------------------>|                   |
    |                    |                   |                   |                   |                   |                   |                   | 8. Consume        |
    |                    |                   |                   |                   |                   |                   |                   |    Event           |
    |                    |                   |                   |                   |                   |                   |                   |------------------>|
    |                    |                   |                   |                   |                   |                   |                   |                   | 9. Update Balance
    |                    |                   |                   |                   |                   |                   |                   |                   |    in MySQL
    |                    |                   |                   |                   |                   |                   |                   |                   |------------------>|
    |                    |                   |                   | 10. Return        |                   |                   |                   |                   |
    |                    |                   |                   |     Success       |                   |                   |                   |                   |
    |                    |                   |<------------------|                   |                   |                   |                   |                   |
    |                    | 11. Return        |                   |                   |                   |                   |                   |                   |
    |                    |    Success        |                   |                   |                   |                   |                   |                   |
    |                    |<------------------|                   |                   |                   |                   |                   |                   |
    | 12. Clear Form     |                   |                   |                   |                   |                   |                   |                   |
    | & Show Success     |                   |                   |                   |                   |                   |                   |                   |
    |<-------------------|                   |                   |                   |                   |                   |                   |                   |
    |                    | 13. Auto-refresh  |                   |                   |                   |                   |                   |                   |
    |                    |    after delay    |                   |                   |                   |                   |                   |                   |
    |                    |------------------>|                   |                   |                   |                   |                   |                   |
    |                    | 14. GET /api/v1/  |                   |                   |                   |                   |                   |                   |
    |                    |    bankAccount-   |                   |                   |                   |                   |                   |                   |
    |                    |    Lookup/        |                   |                   |                   |                   |                   |                   |
    |                    |------------------>|                   |                   |                   |                   |                   |                   |
    |                    |                   | 15. Route to      |                   |                   |                   |                   |                   |
    |                    |                   |    account-query  |                   |                   |                   |                   |                   |
    |                    |                   |------------------>|                   |                   |                   |                   |                   |
    |                    |                   |                   |                   |                   |                   |                   | 16. Query MySQL   |
    |                    |                   |                   |                   |                   |                   |                   |------------------>|
    |                    |                   |                   |                   |                   |                   |                   | 17. Return Updated|
    |                    |                   |                   |                   |                   |                   |                   |    Data            |
    |                    |                   |                   |                   |                   |                   |                   |<------------------|
    |                    |                   | 18. Return        |                   |                   |                   |                   |                   |
    |                    |    Updated List   |                   |                   |                   |                   |                   |                   |
    |                    |<------------------|                   |                   |                   |                   |                   |                   |
    | 19. Update UI      |                   |                   |                   |                   |                   |                   |                   |
    |    with New Data   |                   |                   |                   |                   |                   |                   |                   |
    |<-------------------|                   |                   |                   |                   |                   |                   |                   |
```

## 3. READ ACCOUNTS SEQUENCE

```
User Browser          React UI           Nginx Proxy        account-query       Repository          MySQL
    |                    |                   |                   |                   |                   |
    | 1. Load Page or    |                   |                   |                   |                   |
    |    Click Refresh   |                   |                   |                   |                   |
    |------------------->|                   |                   |                   |                   |
    |                    | 2. GET /api/v1/   |                   |                   |                   |
    |                    |    bankAccount-   |                   |                   |                   |
    |                    |    Lookup/        |                   |                   |                   |
    |                    |------------------>|                   |                   |                   |
    |                    |                   | 3. Route to       |                   |                   |
    |                    |                   |    account-query  |                   |                   |
    |                    |                   |------------------>|                   |                   |
    |                    |                   |                   | 4. Receive Query  |                   |
    |                    |                   |                   |------------------>|                   |
    |                    |                   |                   |                   | 5. Execute SQL    |
    |                    |                   |                   |                   |    Query          |
    |                    |                   |                   |                   |------------------>|
    |                    |                   |                   |                   | 6. Return Results |
    |                    |                   |                   |                   |<------------------|
    |                    |                   |                   | 7. Format Response|                   |
    |                    |                   |                   |------------------>|                   |
    |                    |                   | 8. Return JSON    |                   |                   |
    |                    |                   |    Response       |                   |                   |
    |                    |<------------------|                   |                   |                   |
    |                    | 9. Update UI      |                   |                   |                   |
    |                    |    with Data      |                   |                   |                   |
    |<-------------------|                   |                   |                   |                   |
```

## Key Timing Considerations

### Synchronous Operations
- UI → Nginx → Service: Fast (milliseconds)
- Service → Database: Fast (milliseconds)
- Command validation and processing: Fast (milliseconds)

### Asynchronous Operations
- Event publishing to Kafka: Fast (milliseconds)
- Event consumption by query service: Variable (seconds)
- Projection updates: Variable (seconds)

### Eventual Consistency
- Command side updates immediately
- Query side updates asynchronously
- UI shows updated data after delay (1-2 seconds)

## Error Handling Flows

### Command Side Errors
```
User ──▶ UI ──▶ Nginx ──▶ account-cmd ──▶ Validation Error ──▶ Return Error ──▶ UI ──▶ Show Error
```

### Query Side Errors
```
User ──▶ UI ──▶ Nginx ──▶ account-query ──▶ DB Error ──▶ Return Error ──▶ UI ──▶ Show Error
```

### Event Processing Errors
```
account-cmd ──▶ Publish Event ──▶ Kafka ──▶ account-query ──▶ Processing Error ──▶ Retry/Dead Letter
```

## Performance Characteristics

- **Command Operations**: Fast (50-200ms) - synchronous
- **Query Operations**: Fast (20-100ms) - direct DB access
- **Event Propagation**: Variable (100ms-2s) - asynchronous
- **UI Updates**: Near real-time with manual refresh
- **Consistency**: Eventual consistency between command and query sides
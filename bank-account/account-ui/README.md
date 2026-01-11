# Account UI

A React-based frontend application for managing bank accounts using the CQRS pattern.

## Features

- View all bank accounts
- Create new bank accounts
- Deposit funds to accounts
- Withdraw funds from accounts
- Real-time updates through CQRS event sourcing

## Architecture

This UI communicates with two backend services:
- **account-query** (port 5001): Handles read operations (queries)
- **account-cmd** (port 5002): Handles write operations (commands)

## Running the Application

The application is containerized and runs as part of the docker-compose setup in the parent directory.

```bash
# From the bank-account directory
docker-compose up --build
```

The UI will be available at http://localhost:3000

## API Endpoints Used

### Queries (via account-query service)
- `GET /api/v1/bankAccountLookup/` - Get all accounts

### Commands (via account-cmd service)
- `POST /api/v1/openBankAccount` - Create new account
- `PUT /api/v1/depositFunds/{id}` - Deposit funds
- `PUT /api/v1/withdrawFunds/{id}` - Withdraw funds

## Development

To run in development mode:

```bash
npm install
npm start
```

Make sure the backend services are running and accessible.
# Junior Backend Developer Code Challenge

This project is a mini backend application developed as part of the Junior Backend Developer - 1 Week Code Challenge for MATA Technologies. The goal of this project is to demonstrate my understand of backend development fundamentals, clean architecture, API design, and best practices.

### Features

- RESTFful API built with KOA
- CRUD operations for main resources
- Input validation and structured error handling
- Modular and scalable project architecture
- Environment-based configuration

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```

Install Dependencies:

```
pnpm install
```

### Environment Variables:

Create a .env file in the root directory and configure the following:

```
DATABASE_URL=your-database-connect-string-url
JWT_SECRET=your-jwt-secret
```

    Make sure the DATABSE URL points to your local or remote database

Run Prisma migrations:

```
npx prisma migrate dev --name init
```
```
npx prisma generate
```
### Running Application

```
pnpm run dev
```

### API ENDPOINTS

| Method              | Endpoint             | Description                         |
| ------------------- | -------------------- | ----------------------------------- |
| GET                 | /customers/          | Retrieve all customer data          |
| GET                 | /customers/:id       | Retrieve customer by id             |
| POST                | /customer            | Create a new customer               |
| PUT                 | /customer/:id        | Update a customer by id             |
| PATCH (SOFT DELETE) | /customer/:id        | Delete a product by id              |
| GET                 | /product             | Retrieve all prodcut                |
| GET                 | /product/:id         | Retrieve product by id              |
| PUT                 | /product/:id         | Update a product by id              |
| POST                | /product             | Create a new product                |
| GET                 | /sales?month=YYYY-MM | Retrieve sales for a specific month |
| PATCH (SOFT DELETE) | /product/:id         | Delete a product by id              |
| POST                | /auth/login          | Authenticate user/login             |

### Notes

- The project was completed within 1-week challenge timeframe
- Emphasis was placed on the clean code, modular architecture, and proper database management

### Author

Joshua R. Rembulat
Junior Backend Developer Applicant
Mata Technologies

# Techinnover: Backend Take-Home Assessment: Basic E-Commerce System

This project is a simple e-commerce backend API built using [NestJS](https://nestjs.com/). It provides functionality for user management, product management, and role-based access control, allowing both authenticated and unauthenticated users to interact with the system.

## Project Overview

The goal of this project is to demonstrate the design and development of a scalable and maintainable backend API using NestJS. The API supports user authentication, role-based access control, and basic CRUD operations for products, with specific access for admin users to manage the approval and visibility of products.

## Features

- **User Management**

  - User registration and authentication (JWT-based).
  - Role-based access control (User, Admin).
  - Admin functionality to view, ban, and unban users.
  - Banned users are restricted from interacting with the system.

- **Product Management**
  - Authenticated users can create, update, and delete their own products.
  - Admins can approve or disapprove products.
  - Public users can view only approved products.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development environment:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (if using PostgreSQL)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/davydocsurg/techinnover-ecommerce-api.git
   ```

   ```bash
   cd techinnover-ecommerce-api
   ```

2. **Install dependencies**:

```bash
npm install
```

or

```bash
yarn install
```

3. **Set up environment variables**:

- Create a `.env` file in the root of the project.
- Copy the contents of `.env.example` and update the values according to your local setup. You can simply do this by running the following command:

```bash
cp .env.example .env
```

4. **Run database migrations**:

```bash
npx prisma migrate dev
```

4. **Seed the database**:

```bash
npm run seed
```

OR

```bash
yarn seed
```

### Running the Application

To start the application in development mode, use the following command:

```bash
npm run start:dev
```

or

```bash
yarn start:dev
```

The API will be available at http://localhost:3000.

### API Documentation

This project uses Swagger for API documentation. Once the application is running, you can view the API documentation at:
http://localhost:3000/api/docs

### Environment Variables

This project requires several environment variables to function correctly. An example `.env` file has been provided as `.env.example`. Ensure you create a `.env` file in the root of your project and update it with your local configuration.

### Guards and Middleware

- JwtAuthGuard: Ensures that only authenticated users can access certain endpoints.
- RolesGuard: Provides role-based access control for different endpoints.

### DTOs and Validation

All DTOs (Data Transfer Objects) are decorated with `@ApiProperty` to ensure proper Swagger documentation. Validation is handled using `class-validator` decorators.

### Prisma

Prisma is used as the ORM for this project. The Prisma schema is defined in `prisma/schema.prisma`. Migrations and seeding are managed using Prisma CLI commands.

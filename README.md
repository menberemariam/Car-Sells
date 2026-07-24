<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
# 🚗 Car Sells API

A modern backend REST API built with **NestJS**, **TypeORM**, and **SQLite** for managing vehicle sale reports and estimating car market prices.

The project demonstrates how a real-world car marketplace backend can authenticate users, manage vehicle reports, and generate market value estimates using historical vehicle data.

> This project is designed as the foundation for a production-ready online car marketplace similar to AutoTrader, CarGurus, Cars.com, or Jiji Motors.

---

## ✨ Features

### Authentication

- User registration
- User login/logout
- Password hashing
- Session-based authentication
- Current authenticated user endpoint
- Route protection using Guards

### Authorization

- Role-based authorization
- Admin-only endpoints
- Report approval workflow

### Vehicle Reports

Users can create vehicle reports including:

- Make
- Model
- Year
- Mileage
- Price
- Longitude
- Latitude

### Price Estimation

Estimate a vehicle's market value based on:

- Vehicle make
- Model
- Manufacturing year
- Mileage
- Geographic location

Only approved reports are used when generating price estimates.

### Validation

Input validation using DTOs and `class-validator`.

### Testing

- Unit tests
- End-to-end tests
- Jest testing configuration

---

# Tech Stack

| Technology | Description |
|------------|-------------|
| NestJS | Backend framework |
| TypeScript | Main programming language |
| TypeORM | ORM |
| SQLite | Database |
| class-validator | Request validation |
| cookie-session | Session authentication |
| Jest | Testing |

---

# Project Structure

```
src
│
├── users
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── user.entity.ts
│   ├── dtos
│   ├── decorators
│   └── interceptors
│
├── reports
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   ├── reports.entity.ts
│   └── dto
│
├── guards
│   ├── auth.guard.ts
│   └── admin.guard.ts
│
├── app.module.ts
└── main.ts
```

---

# How It Works

## Authentication Flow

```
User
   │
   ▼
Sign Up / Login
   │
Password Hashing
   │
Session Created
   │
cookie-session
   │
Protected Routes
```

---

## Car Price Estimation Flow

```
User
   │
Create Report
   │
Admin Approval
   │
Approved Reports
   │
Price Estimation Engine
   │
Estimated Market Price
```

---

# API Modules

## Users

Responsible for:

- Register users
- Login
- Logout
- Retrieve current user
- Update user

---

## Reports

Responsible for:

- Create reports
- Generate estimates
- Approve reports
- Retrieve report data

---

## Guards

### Auth Guard

Ensures only authenticated users can access protected endpoints.

### Admin Guard

Restricts administrative actions such as report approval.

---

# Installation

Clone the repository

```bash
git clone https://github.com/menberemariam/Car-Sells.git
```

Navigate into the project

```bash
cd Car-Sells
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run start:dev
```

The server runs on

```
http://localhost:4100
```

---

# Running Tests

Unit Tests

```bash
npm run test
```

Watch Mode

```bash
npm run test:watch
```

Coverage

```bash
npm run test:cov
```

End-to-End Tests

```bash
npm run test:e2e
```

---

# Environment Variables

Create:

```
.env.development
```

Example

```env
DB_NAME=db.sqlite
PORT=4100
COOKIE_KEY=your-secret-key
```

---

# Future Improvements

This project is currently a learning-focused backend and will evolve into a complete production-ready vehicle marketplace.

Planned features include:

- PostgreSQL support
- JWT Authentication
- Refresh Tokens
- Email Verification
- Vehicle Images
- Cloudinary Integration
- Advanced Search & Filtering
- Vehicle Listings
- Buyer/Seller Messaging
- Favorites
- Reviews & Ratings
- Dealer Accounts
- Payment Integration
- Redis Caching
- Docker Support
- CI/CD
- Swagger Documentation
- Recommendation Engine
- AI-powered Price Prediction

---

# Learning Objectives

This project demonstrates practical backend development concepts including:

- NestJS Architecture
- Dependency Injection
- Authentication & Authorization
- Session Management
- TypeORM
- Entity Relationships
- DTO Validation
- Guards
- Interceptors
- RESTful API Design
- Repository Pattern
- Unit Testing
- End-to-End Testing

---

# Roadmap

- [x] User Authentication
- [x] Session Management
- [x] Report Creation
- [x] Admin Approval
- [x] Price Estimation
- [x] Validation
- [x] Testing
- [ ] Vehicle Listings
- [ ] Image Uploads
- [ ] PostgreSQL Migration
- [ ] JWT Authentication
- [ ] Messaging
- [ ] Favorites
- [ ] Reviews
- [ ] Notifications
- [ ] Payments
- [ ] Admin Dashboard
- [ ] AI Price Prediction

---

# License

This project is open source and available under the MIT License.

---

## Author

**Menberemariam**

Backend Developer | NestJS | TypeScript | Node.js

If you found this project helpful, consider giving it a ⭐ on GitHub.

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

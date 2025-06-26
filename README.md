# Fundis & Freelancers Booking API

A RESTful API for managing service provider bookings with M-Pesa integration, built with Express.js.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm/yarn
- PostgreSQL (for production)
- M-Pesa Daraja API credentials (for payments)

### Installation
#### 1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fundis-booking-api.git
   cd fundis-booking-api
   ```
#### 2. Install dependencies:
 ```bash
   npm install
```
#### 3. Create .env file:
 ```bash
   Create .env file:
```
Edit the .env file with your configuration
#### 4. Run the server:
```bash
    npm start
```
#### For development with hot-reload:
```bash
    npm run dev
```
## 🌐 API Documentation
### Base URL
```
http://localhost:3000/api
```
### Authentication
Include API key in headers:
```
x-api-key: your-api-key-from-env
```
## 📌 Endpoints
### 1. Service Providers
Get All Providers
```
GET /providers
```
Query Parameters:

- category - Filter by service category (e.g., plumbing, cleaning)

- location - Filter by location

- page - Pagination page number

- limit - Items per page (default: 10)
Example Response:
```
{
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "service": "Plumbing",
      "rating": 4.8,
      "hourlyRate": 800,
      "available": true
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10
  }
}
```
### 2. Bookings
Create Booking
```
POST /bookings
```

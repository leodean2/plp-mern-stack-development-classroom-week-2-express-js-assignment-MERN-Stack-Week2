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
Request Body:
```
{
  "providerId": "1",
  "customerId": "cus_123",
  "service": "Pipe Repair",
  "date": "2024-03-15",
  "time": "14:00",
  "location": "Nairobi, Westlands"
}
```
Success Response (201 Created):
```
{
  "id": "book_123",
  "status": "pending",
  "paymentRequired": true,
  "mpesaCheckoutUrl": "/payments/checkout/book_123"
}
```
### 3. Payments
Initiate M-Pesa Payment
```
POST /payments/mpesa
```
Request Body:
```
{
  "bookingId": "book_123",
  "phoneNumber": "254712345678",
  "amount": 1500
}
```
Success Response (202 Accepted):
```
{
  "status": "initiated",
  "transactionId": "MPE12345",
  "message": "Payment request sent to 254712345678"
}
```
## 🛠️ Testing the API
### 1.Using cURL:
```bash
# Get all electricians in Nairobi
curl -H "x-api-key: your-key" \
"http://localhost:3000/api/providers?category=electrical&location=Nairobi"
```
### 2.Using Postman:
- Import Postman Collection

- Set environment variables in Postman
## 📦 Production Deployment
Docker Setup
```
docker build -t fundis-api .
docker run -p 3000:3000 --env-file .env fundis-api
```
Environment Variables
See .env.example for all required configuration
## 📜 License
MIT
## 📞 Support
For issues, contact [support@fundis.com](https://www.fundis-equestrian.com/)
```
Key features included:
1. Clear installation instructions
2. Detailed endpoint documentation
3. Request/response examples
4. Authentication requirements
5. Testing examples
6. Deployment options
7. Support information

Would you like me to:
1. Add more endpoint examples?
2. Include error response documentation?
3. Add rate limiting details?
4. Include sample Postman collection?
```

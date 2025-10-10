# Sung Drip Woo - Custom Tailoring E-Commerce Platform

A modern e-commerce platform connecting customers with tailors for custom clothing orders, featuring geolocation-based tailor discovery, digital and in-person measurements, material selection, secure payment processing with escrow, and delivery tracking.

## Features

- **User Authentication**: Secure login/registration system with JWT
- **Tailor Discovery**: Find tailors near you with geolocation filtering
- **Measurement System**: Digital measurement forms and in-person appointment scheduling
- **Material Selection**: Browse and select materials from tailors or provide your own
- **Order Management**: Track orders from creation to delivery
- **Payment Processing**: Secure payments with escrow functionality via Stripe
- **Delivery Tracking**: Real-time tracking of order deliveries

## Tech Stack

- **Frontend**: React, Material-UI, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Maps & Geolocation**: Leaflet, MongoDB geospatial queries
- **Payments**: Stripe API
- **Notifications**: Email and in-app notifications

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Stripe account for payment processing

### Installation

1. Clone the repository
2. Install server dependencies:
   ```
   npm install
   ```
3. Install client dependencies:
   ```
   cd client
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

### Running the Application

1. Start the server:
   ```
   npm run server
   ```
2. Start the client:
   ```
   npm run client
   ```
3. Run both concurrently:
   ```
   npm run dev
   ```

## API Endpoints

The API is organized around the following resources:

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/tailors` - Tailor discovery and management
- `/api/measurements` - Measurement management
- `/api/materials` - Material selection and inventory
- `/api/orders` - Order processing
- `/api/payments` - Payment processing with escrow
- `/api/delivery` - Delivery tracking

## License

This project is licensed under the MIT License.
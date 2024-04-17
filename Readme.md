# Customer Relationship Management (CRM) Backend

Welcome to the backend of our Customer Relationship Management (CRM) application! This README file provides an overview of the backend code structure and functionality.

## Introduction

Our CRM backend is responsible for handling various operations related to managing customer data, orders, requests, user authentication, and more. It consists of controllers, middleware, routes, models, and configuration files to support the functionalities of the CRM application.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
  
- **Express.js**: Web application framework for Node.js.
  
- **MongoDB**: NoSQL database for storing application data.
  
- **Mongoose**: MongoDB object modeling tool.
  
- **JSON Web Tokens (JWT)**: For authentication and authorization.
  
- **bcrypt**: Library for hashing passwords.

## Directory Structure

```bash
CRM-Backend/
│
├── Config/                 # Configuration files (e.g., user roles)
├── Controllers/            # Request handlers for each route
├── Middleware/             # Middleware functions (e.g., authentication)
├── Models/                 # Database models (e.g., User, Order)
├── Routers/                 # Route definitions
├── Utils/                  # Utility functions
├── .env                    # Environment variable configuration file
├── .gitignore              # Git ignore file
├── db.js                   # Database connection setup file
├── generatesecret.cjs      # Script for generating secrets
└── index.js                # Entry point of the application

```

## Getting Started

To run the backend server locally, follow these steps:

### 1. Clone the repository:

```bash
git clone <repository-url>
```
### 2. Install the dependencies:

```bash
cd backend
npm install

```

### 3. Set up environment variables:

Create a .env file in the root directory of your project and define the following variables:


- **PORT:** The port on which the server will run. Default is 3000.
  - Example: `PORT=4000`
  
- **MONGO_URL:** The MongoDB connection URI.
  - Example: `MONGO_URL=mongodb+srv://<username>:<password>@<cluster>/<database>`

- **ACC_VALIDATION_TOKEN_SECRET:** Secret key for generating account activation tokens.
  - Example: `ACC_VALIDATION_TOKEN_SECRET=<your-acc-validation-token-secret>`

- **USER_ACCESS_TOKEN_SECRET:** Secret key for generating user access tokens.
  - Example: `USER_ACCESS_TOKEN_SECRET=<your-user-access-token-secret>`

- **RESET_PWD_TOKEN_SECRET:** Secret key for generating reset password tokens.
  - Example: `RESET_PWD_TOKEN_SECRET=<your-reset-pwd-token-secret>`

- **CLOUD_NAME:** Name of the cloud storage service.
  - Example: `CLOUD_NAME=<your-cloud-name>`

- **API_KEY:** API key for cloud storage.
  - Example: `API_KEY=<your-api-key>`

- **API_SECRET:** API secret for cloud storage.
  - Example: `API_SECRET=<your-api-secret>`

- **MAIL_SERVICE:** Email service provider (e.g., gmail).
  - Example: `MAIL_SERVICE=gmail`

- **CLIENT_URL:** URL of the client application.
  - Example: `CLIENT_URL=http://localhost:4000`

- **MAIL_ID:** Email address used for sending emails.
  - Example: `MAIL_ID=<your-email-address>`

- **MAIL_PWD:** Password for the email address.
  - Example: `MAIL_PWD=<your-email-password>`

- Make sure to replace <placeholders> with your actual values.

### 4. Start the server:

```bash
npm start
```

## Features

**1. User Management:**

  - Registration
  
  - Login
  
  - Account Activation
  
  - Resending Activation Email
  
  - Password Management (Forgot Password, Reset Password)
  
  - Profile Picture Management
  
  - Phone Number Update
  
 **2. Order Management:**

  - Creation of Orders
  
  - Order Cancellation
  
  - Update Order Status
  
  - Retrieve Orders
  
  - Monthly Order Reports

**3. Product Management:**

  - Retrieve Available Products
  
  - Retrieve Product Sales Data
  
  - Retrieve Revenue Data
  
  **4. Request Management:**

  - Creation of Service Requests
  
  - Retrieval of Service Requests
  
  - Update Request Status
  
  - Update Request Summary

## API Endpoints

- ### User Management
  
  - **POST /api/user/register:** Register a new user.
  
  - **POST /api/user/login:** User login.
  
  - **POST /api/user/activate/:id/:token:** Activate user account.
  
  - **POST /api/user/activate-mail:** Resend activation email.
  
  - **POST /api/user/forgotpwd:** Initiate password reset process.
  
  - **POST /api/user/forgotpwd/authorize/:id/:token:** Authorize password reset.
  
  - **POST /api/user/reset-pwd/:id/:token:** Reset user password.
  
  - **PUT /api/user/update-pic:** Update user profile picture.
  
  - **PUT /api/user/update-phone:** Update user phone number.
  
  - **DELETE /api/user/delete-pic:** Delete user profile picture.
  
- ### Product Management
  
  - **POST /api/products/get-orders:** Get orders.
  
  - **POST /api/products/create-order:** Create a new order.
  
  - **POST /api/products/cancel-order:** Cancel an order.
  
  - **POST /api/products/update-order:** Update order status.
  
  - **POST /api/products/monthly-orders:** Get monthly orders.
  
  - **POST /api/products/get-revenue:** Get revenue data.
  
  - **POST /api/products/get-products-data:** Get product sales data.
  
- ### Service Request Management.

  - **POST /api/request/get-requests:** Get service requests.
  
  - **POST /api/request/get-all-requests:** Get all service requests.
  
  - **POST /api/request/create-request:** Create a new service request.
  
  - **POST /api/request/update-status:** Update service request status.
  
  - **POST /api/request/update-summary:** Update service request summary.
  
- ## Authentication and Authorization
  
  - JWT is used for authentication. Users must include a valid JWT token in the Authorization header to access protected endpoints.
  
  - Different user roles (Customer, Sales, Marketing, Engineer, Admin) have different levels of access to the endpoints. Role-based access control is implemented using middleware.
  
## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Support

- For any issues or inquiries, please contact [Your Contact Information].

- Thank you for using our CRM backend! We hope it meets your requirements and enhances your customer management experience.





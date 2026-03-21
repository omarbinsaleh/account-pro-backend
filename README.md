# AccountPro ( Backend )

AccountPro Backend is a robust, scalable, and secure RESTful API designed to power the AccountPro, a modern ERP systems. Built with Node.js and Express.js, it serves as the core engine for financial management, user administration, and resource planning.

The system is engineered with a modular architecture to handle complex business logic—ranging from multi-tenant user authentication to intricate accounting workflows. With a focus on data integrity and high performance, AccountPro Backend provides a seamless integration layer for AccountPro frontend to manage users, ledgers, and financial reporting in real-time.

---

# Project Structure

```
account-pro-backend/
├── src/
│   ├── db/                      # Database & configurations
│   |   └── db.js
│   ├── controllers/             # Route handlers (parse requests/send responses)
│   │   ├── accountController.js
│   │   └── userController.js
│   ├── middlewares/             # Auth, validation, and error handling
│   │   └── authMiddleware.js
│   ├── models/                  # Database schemas (Mongoose)
│   │   ├── User.js
│   │   └── Account.js
│   ├── routes/                  # API route definitions
│   │   ├── accountRoutes.js
│   │   └── userRoutes.js
│   ├── utilities/               # Helper functions
│   │   ├── index.js
|   |   └── setCookie.js
│   └── app.js                   # Express app initialization
├── tests/                       # Unit and integration tests
├── .env                         # Environment variables (Secret keys, DB URL)
├── .gitignore                   # Files to exclude from Git
├── server.js                    # Express server ( entry point )
├── package.json                 # Project dependencies and scripts
└── README.md                    # Project documentation
```

---

# User Management API

This API provides endpoints for user registration, authentication, and session management.

## Base URL

```
http://localhost:3000

```

---

## Endpoints

### **1. Register User**

Create a new user account. Upon successful registration, an authentication token is generated and set in an HTTP-only cookie.

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Access:** Public

- **Request Body:**

| Field    | Type   | Required | Description                           |
| -------- | ------ | -------- | ------------------------------------- |
| username | String | Yes      | Unique name for the user.             |
| email    | String | Yes      | Valid email address (must be unique). |
| password | String | Yes      | Minimum 6 characters.                 |
| role     | String | No       | User role (e.g., "user", "admin").    |

- **Success Response:**
  - Code: 201 Created
  - Response Schema:

  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "username": "user_test_4",
      "email": "user4test@gmail.com",
      "password": null,
      "role": "user",
      "_id": "69bee0656a0c2d52562ef324",
      "createdAt": "2026-03-21T18:16:05.304Z",
      "updatedAt": "2026-03-21T18:16:05.304Z",
      "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmVlMDY1NmEwYzJkNTI1NjJlZjMyNCIsInVzZXJuYW1lIjoidXNlcl90ZXN0XzQiLCJlbWFpbCI6InVzZXI0dGVzdEBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3NDExNjk2NSwiZXhwIjoxNzc0MTUyOTY1fQ.hTtH3VTWBh3DoRRExapflKiG5T42XOv08WL5dzI5Bkg"
  }
  ```

- **Error Response ( Invalid username field )**
  - Status Code: 400
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "Username is required and must be a non-empty string",
    "data": null
  }
  ```

- **Error Response ( Invalid email field )**
  - Status Code: 400
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "Email is required and must be a valid email address",
    "data": null
  }
  ```

- **Error Response ( Invalid password field )**
  - Status Code: 400
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "Password is required and must be at least 6 characters long",
    "data": null
  }
  ```

- **Error Response ( Other Error )**
  - Status Code: 500
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "[error message...]",
    "data": null
  }
  ```

---

### **2. Login User**

Authenticate a user with their email and password. Returns a JWT and sets it in an HTTP-only cookie.

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Access:** Public

- **Request Body:**

| Field    | Type   | Required | Description               |
| -------- | ------ | -------- | ------------------------- |
| email    | String | Yes      | Registered email address. |
| password | String | Yes      | User's password.          |

- **Success Response:**
  - Code: 200 OK
  - Response Schema:

  ```json
  {
    "success": true,
    "message": "User login successful",
    "data": {
      "_id": "69b41209e96859dd673a366f",
      "username": "user_test_2",
      "email": "user2test@gmail.com",
      "password": null,
      "role": "admin",
      "createdAt": "2026-03-13T13:32:57.077Z",
      "updatedAt": "2026-03-13T13:32:57.077Z",
      "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YjQxMjA5ZTk2ODU5ZGQ2NzNhMzY2ZiIsInVzZXJuYW1lIjoidXNlcl90ZXN0XzIiLCJlbWFpbCI6InVzZXIydGVzdEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzQxMTY4NzIsImV4cCI6MTc3NDE1Mjg3Mn0.Ti9BsS1RVhbmHgZtxnfRvMlppK4X2qZgWKqviJjzv_s"
  }
  ```

- **Error Response ( Invalid Email Error ):**
  - Code: 400
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "Email is required and must be a valid email address",
    "data": null
  }
  ```

- **Error Response ( Invalid Password Error ):**
  - Code: 400
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "Password is required and must be at least 6 characters long",
    "data": null
  }
  ```

- **Error Response ( If there is no user associated with the email provided ):**
  - Code: 404
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "data": null
  }
  ```

- **Error Response ( If the password provided does not match with user's password ):**
  - Code: 404
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "data": null
  }
  ```

- **Error Response ( Other Error ):**
  - Code: 500
  - Response Schema:

  ```json
  {
    "success": false,
    "message": "[Error message...]",
    "data": null
  }
  ```

---

### **3. Logout User**

Clears the user's authentication cookie and terminates the session.

- URL: /api/userslogout
- Method: POST
- Access: Private (Requires valid Token)
- Parameters:
- Identity (Query/Body): userId or id (must match the authenticated user).
  - Auth (Header/Cookie): Bearer Token or token cookie.
  - Validation: User ID must be a valid MongoDB ObjectId.

- **Success Response:**
- Code: 200 OK
  - Content:

{
"success": true,
"message": "User logout successful",
"data": { "\_id": "...", "username": "...", "email": "...", "password": null, "role": "..." }
}

---

Error Handling
Common error responses returned by the API:

- 400 Bad Request: Missing or invalid fields (e.g., invalid email format, short password).
- 401 Unauthorized: Missing, invalid, or expired authentication token.
- 403 Forbidden: Attempting to logout or modify a different user's session.
- 404 Not Found: User ID does not exist in the database.
- 500 Internal Server Error: Unexpected server-side issues.

---

Would you like me to add a section on how to test these endpoints using a tool like Postman or cURL?

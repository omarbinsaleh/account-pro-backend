# User Controller

This controller handles all user-related operations in the application.

## Routes

| Route           | Method | Access                           | Description                               |
| --------------- | ------ | -------------------------------- | ----------------------------------------- |
| `/users`        | POST   | Public                           | Create a new user.                        |
| `/users/login`  | POST   | Public                           | Authenticate a user and generate a token. |
| `/users/logout` | POST   | Private (JWT required)           | Log out the current user.                 |
| `/users`        | GET    | Private (Admin or Account Owner) | Retrieve all users.                       |
| `/users/:id`    | GET    | Private (Admin or Account Owner) | Retrieve a specific user by ID.           |
| `/users/:id`    | PUT    | Private (Admin or Account Owner) | Update a specific user by ID.             |
| `/users/:id`    | DELETE | Private (Admin or Account Owner) | Delete a specific user by ID.             |

## Functions

### `createUser(req, res)`

Creates a new user in the database.

- **Parameters:**
  - `req` (Request): The request object containing the user data in the body.
  - `res` (Response): The response object used to send the response back to the client.
- **Returns:**
  - On success, returns a JSON response with a success message and the created user data.

  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "_id": "user id",
      "username": "username",
      "email": "email",
      "password": "password",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "token": "authentication token"
    }
  }
  ```

- On error, returns a JSON response with an error message.

```json
{
  "success": false,
  "message": "Error creating user",
  "data": null
}
```

### `loginUser(req, res)`

Authenticates a user by email/password and generates a JWT.

- **Parameters:**
  - `req` (Request): The request object containing the login credentials in the body.
  - `res` (Response): The response object used to send the response back to the client.
- **Returns:**
  - On success, returns a JSON response with a success message and the generated token.

  ```json
  {
    "success": true,
    "message": "User logged in successfully",
    "data": {
      "_id": "user id",
      "username": "username",
      "email": "email",
      "password": "password",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "authentication token"
  }
  ```

  - On error, returns a JSON response with an error message.

  ```json
  {
    "success": false,
    "message": "Error logging in user",
    "data": null
  }
  ```

### `logoutUser(req, res)`

Logs out the current user by clearing the authentication cookie.

- **Parameters:**
  - `req` (Request): The request object.
  - `res` (Response): The response object used to send the response back to the client.
- **Returns:**
  - On success, returns a JSON response with a success message.

  ```json
  {
    "success": true,
    "message": "User logged out successfully"
  }
  ```

  - On error, returns a JSON response with an error message.

  ```json
  {
    "success": false,
    "message": "Error logging out user"
  }
  ```

### `getAllUsers(req, res)`

Retrieves all users from the database.

- **Parameters:**
  - `req` (Request): The request object.
  - `res` (Response): The response object used to send the response back to the client.
- **Returns:**
  - On success, returns a JSON response with a success message and the retrieved user data.

  ```json
  {
    "success": true,
    "message": "Users retrieved successfully",
    "data": [
      {
        "_id": "user id",
        "username": "username",
        "email": "email",
        "password": "password",
        "role": "user",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      ...
    ]
  }
  ```

  - On error, returns a JSON response with an error message.

  ```json
  {
    "success": false,
    "message": "Error retrieving users",
    "data": []
  }
  ```

### `getUserById(req, res)`

Retrieves a specific user by ID.

- **Parameters:**
  - `req` (Request): The request object containing the user ID in the parameters.
  - `res` (Response): The response object used to send the response back to the client.
- **Returns:**
  - On success, returns a JSON response with a success message and the retrieved user data.

  ```json
  {
    "success": true,
    "message": "User retrieved successfully",
    "data": {
      "_id": "user id",
      "username": "username",
      "email": "email",
      "password": "password",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

  - On error, returns a JSON response with an error message.

  ```json
  {
    "success": false,
    "message": "Error retrieving user",
    "data": null
  }
  ```

### `updateUserById(req, res)`

Updates a specific user by ID.

- **Parameters:**
  - `req` (Request): The request object containing the user data in the body and the user ID in the parameters.
  - `res` (Response): The response object used to send the response back to the client.
- **Returns:**
  - On success, returns a JSON response with a success message and the updated user data.

  ```json
  {
    "success": true,
    "message": "User updated successfully",
    "data": {
      "_id": "user id",
      "username": "username",
      "email": "email",
      "password": "password",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

  - On error, returns a JSON response with an error message.

  ```json
  {
    "success": false,
    "message": "Error updating user",
    "data": null
  }
  ```

### `deleteUserById(req, res)`

Deletes a specific user by ID.

- **Parameters:**
  - `req` (Request): The request object containing the user ID in the parameters.
  - `res` (Response): The response object used to send the response back to the client.
- **Returns:**
  - On success, returns a JSON response with a success message and the deleted user data.

  ```json
  {
    "success": true, 
    "message": "User deleted successfully",
    "data": {
      "_id": "user id",
      "username": "username",
      "email": "email",
      "password": "password",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

  - On error, returns a JSON response with an error message.

  ```json
  {
    "success": false,
    "message": "Error deleting user",
    "data": null
  }
  ```
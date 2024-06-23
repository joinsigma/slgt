<h1 align='center'>__SUPABASE_PROJECT_NAME__ Core Server</h1>

## Running Locally

**Note 1**: This guide assumes you are using a Mac or Linux machine, if you are using Windows, you can use the Windows Subsystem for Linux (WSL) to run the following commands.  
**Note 2**: Please make sure you have Docker installed on your machine. If you don't have Docker installed, you can install it from [here](https://docs.docker.com/get-docker/).  
**Note 3**: You only need to run `chmod` commands one time. After that, you can skip them.

1. **Install Dependencies and Make the Scripts Executable**

   ```bash
   npm install
   chmod +x runner-*.sh
   ```

2. **Setup Environment Variables:**

   - Create a `.env` file by copying the `.env.example` file.

   ```bash
   cp .env.example .env
   ```

   - Edit the values in the `.env` file with the appropriate values. **Ask your team lead for the actual values of the environment variables.**

3. **Start the Server:**

   ```bash
   ./runner-start.sh
   ```

   Make sure you have the appropriate `.env` file in place before running this command.

   This will start the Core server. You can access the Core server at: http://localhost:${PORT}

4. **Stop the Server:**

   ```bash
   ./runner-destroy.sh
   ```

## API Documentation

### API Endpoints:

URL: https://__SUPABASE_PROJECT_NAME__-core-krljeif4ga-as.a.run.app

### Overview

**Note 1**: For testing and interacting with the API, there's an `Insomnia_[date].json` file which you can import into Insomnia.

1. **GET `/health`**: Health check endpoint.
2. **POST `/auth/login`**: Login user. Returns user information and access token.
3. **POST `/auth/register`**: Register user. Returns user information and access token.

#### 1. **GET `/health`**

- **Purpose**: Health check endpoint.

  **Request**:

  ```json
  {
    // Empty
  }
  ```

  **Response**:

  ```json
  {
    "timestamp": "2023-10-25T03:21:54.409Z"
  }
  ```

#### 2. **POST `/auth/login`**

- **Purpose**: Login user. Returns user information and access token.

  **Things to Note**:

  - The user needs to confirm their email before they can log in. If you don't, it will return an error with the message `Email not confirmed`.
  - This is supabase default behavior. If you want to disable this constraint, you can do the following:
    - Go to the Supabase dashboard and choose your project.
    - Click on Authentication.
    - Click on Providers.
    - Click on Email.
    - Disable the toggle "Confirm email".
    - This will allow users to log in without confirming their email. But it is not recommended for production environments.

  **Request**:

  ```json
  {
    "email": "johndoe@jdoe.co",
    "password": "testJohnDoe123*"
  }
  ```

  **Response**:

  ```json
  {
    "status": 200,
    "message": "OK",
    "data": {
      "user": {
        ...
      },
      "session": {
        ...
      }
    },
    "errors": null
  }
  ```

#### 3. **POST `/auth/register`**

- **Purpose**: Register user. Returns user information.

  **Request**:

  ```json
  {
    "name": "John Doe",
    "email": "johndoe@jdoe.co",
    "password": "testJohnDoe123*",
    "role": "USER",
    "remarks": "..."
  }
  ```

  **Response**:

  ```json
  {
    "status": 200,
    "message": "OK",
    "data": {
      "user": {
        ...
      },
      "session": {
        ...
      }
    },
    "errors": null
  }
  ```

### Handling Errors

If an error arises during a request:

- Typical error format:
  ```json
  {
    "status": 400,
    "message": "BAD_REQUEST",
    "data": null,
    "errors": {
      "message": "Error description"
    }
  }
  ```
- For Axios-related issues:
  ```json
  {
    "status": 400,
    "message": "AXIOS_ERROR",
    ...
  }
  ```

---


# Task Tracker CLI

## Overview
Task Tracker CLI is an advanced command-line application meticulously designed for comprehensive task and user management with enterprise-grade security. Constructed with Node.js, this project exemplifies the principles of backend development, encompassing file-based data persistence, asynchronous programming methodologies, modular code architecture, JWT-based authentication, and role-based access control. It serves as a demonstration of the practical implementation of these concepts within a simulated real-world environment.

## Features

### Task Management (Authentication Required)
- **Add Tasks**: Introduce new tasks with distinctive descriptions.
- **List Tasks**: Generate a comprehensive list of all tasks, complete with their statuses and timestamps.
- **Update Task Status**: Transition tasks among `todo`, `in-progress`, and `done` statuses.
- **Delete Tasks**: Permanently remove tasks identified by unique IDs.
- **Clear Tasks**: Admin-only operation to remove all tasks from the system.

### User Management
- **Administrative Privileges**:
  - Introduce new users, assigning specific roles (`admin` or `user`).
  - Remove existing users from the system.
- **JWT-Based Authentication**:
  - Secure login mechanism generating time-limited JWT tokens (1-hour expiration).
  - All task operations protected by token verification.
  - Token-based session management ensuring secure, stateless authentication.

### Security Features
- **Environment Variable Validation**: Critical configuration values (JWT secret, admin credentials) validated on startup.
- **Password Hashing**: Secure password storage using bcrypt with salt rounds.
- **Token Expiration**: Automatic session expiration after 1 hour of inactivity.
- **Role-Based Access Control**: Granular permissions enforcing admin-only operations.
- **Protected Operations**: All task management commands require valid authentication tokens.

### Data Persistence
- **Task Storage**: Task information is persistently stored in `tasks.json` to facilitate consistent data retrieval.
- **User Storage**: User credentials and roles are maintained within `users.json`.
- **Secure Configuration**: Sensitive data (passwords, secrets) managed via environment variables.
- File initialization processes enforce proper setup and safeguard data integrity.

## Learning Outcomes
This project facilitated the acquisition and application of key backend development competencies, including:
- **Asynchronous File Handling**: Proficient utilization of `fs.promises` for the manipulation of JSON data files.
- **Command-line Tool Engineering**: Development of a robust, flexible CLI application with comprehensive argument parsing.
- **Data Validation and Error Management**: Implementation of rigorous input validation and handling of edge cases.
- **JWT Authentication**: Integration of JSON Web Token-based authentication with token generation, verification, and expiration handling.
- **Secure Password Management**: Implementation of bcrypt hashing with proper salt rounds for secure credential storage.
- **Role-based Access Control (RBAC)**: Implementation of granular user permissions aligned with organizational roles.
- **Environment Variable Management**: Secure configuration management using dotenv with startup validation.
- **Security Best Practices**: Protection against common vulnerabilities including authentication bypass and credential exposure.
- **Modular Code Design**: Development of a scalable and maintainable codebase through logical decomposition.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 16 or higher)

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/a4rmin/task-tracker-cli.git
   cd task-tracker-cli
   ```
2. Install required dependencies:
   ```bash
   npm install
   ```
3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` file with your secure credentials:
   ```bash
   # Use a strong, random JWT secret (generate with: openssl rand -base64 32)
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   
   # Set admin credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secure-password-change-this
   ADMIN_ROLE=admin
   ```
5. Run the application for the first time to initialize files:
   ```bash
   node task-tracker.js help
   ```

## Usage
All task operations require authentication. First login to receive a JWT token, then use the token for subsequent commands.

Execute the application using the syntax:
```bash
node task-tracker.js <command> <arguments>
```

### Command Overview

#### Authentication
- **Login to the System**:
  ```bash
  node task-tracker.js login <username> <password>
  ```
  Example:
  ```bash
  node task-tracker.js login admin mypassword
  ```
  Output:
  ```
  Logged in as admin (admin). Your token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
  **Important**: Copy the token from the output to use in subsequent commands. Tokens expire after 1 hour.

#### Task Management (Requires Authentication)
- **Add a Task**:
  ```bash
  node task-tracker.js add <token> "<task_description>"
  ```
  Example:
  ```bash
  node task-tracker.js add eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... "Complete thesis draft"
  ```
- **List All Tasks**:
  ```bash
  node task-tracker.js list <token>
  ```
- **Update Task Status**:
  - Mark as Done:
    ```bash
    node task-tracker.js mark-done <token> <task_id>
    ```
  - Mark as In Progress:
    ```bash
    node task-tracker.js mark-in-progress <token> <task_id>
    ```
  - Reset to Todo:
    ```bash
    node task-tracker.js mark-undone <token> <task_id>
    ```
- **Delete a Task**:
  ```bash
  node task-tracker.js delete <token> <task_id>
  ```
- **Clear All Tasks** (Admin Only):
  ```bash
  node task-tracker.js clear <token> yes confirm
  ```

#### User Management (Administrative Functions)
- **Add a User**:
  ```bash
  node task-tracker.js add-user <username> <password> <role> <admin_username> <admin_password>
  ```
  Example:
  ```bash
  node task-tracker.js add-user research123 pass123 user admin admin123
  ```
- **Remove a User**:
  ```bash
  node task-tracker.js remove-user <username> <admin_username> <admin_password>
  ```

#### Help Command
List all available commands:
```bash
node task-tracker.js help
```

### Security Notes
- **Token Storage**: Store your JWT token securely. Never commit tokens to version control.
- **Token Expiration**: Tokens expire after 1 hour. Login again to receive a new token.
- **Environment Variables**: Never commit your `.env` file. It's already in `.gitignore`.
- **Strong Passwords**: Use strong, unique passwords for all users, especially the admin account.
- **JWT Secret**: Generate a strong JWT secret using: `openssl rand -base64 32`

## Project Structure
```
.
├── task-tracker.js      # Core application logic with JWT authentication
├── .env                 # Environment variables (not committed)
├── .env.example         # Template for environment configuration
├── .gitignore           # Excludes sensitive files from version control
├── tasks.json           # Persistent storage for tasks (auto-generated)
├── users.json           # Persistent storage for user data (auto-generated)
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## Prospective Enhancements
- **Token Refresh Mechanism**: Implement refresh tokens for extended sessions without re-authentication.
- **Database Integration**: Replace JSON storage with a relational (e.g., PostgreSQL) or NoSQL (e.g., MongoDB) database for enhanced scalability and performance.
- **Token Revocation**: Add blacklist functionality for invalidating tokens before expiration.
- **Interactive CLI**: Employ libraries like `inquirer` to create an interactive, user-friendly command-line interface.
- **Rate Limiting**: Implement login attempt throttling to prevent brute-force attacks.
- **UUID-based Task Identifiers**: Utilize universally unique identifiers (UUIDs) to avoid ID conflicts in multi-user environments.
- **Audit Logging**: Track user actions and security events for compliance and monitoring.
- **RESTful API Development**: Transition the application to a web-accessible API, broadening its applicability and integration potential.
- **Two-Factor Authentication**: Add TOTP-based 2FA for enhanced security.

## Licensing
This application is distributed under the MIT License, allowing free and open-source use, modification, and distribution.

## Acknowledgments
This project was undertaken as an academic endeavor to consolidate backend development skills, including JWT authentication, data persistence, and role-based access control. Special emphasis was placed on implementing enterprise-grade security practices. Gratitude is extended to the open-source community for providing invaluable resources and inspiration.



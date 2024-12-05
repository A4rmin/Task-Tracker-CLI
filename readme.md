
# Task Tracker CLI

## Overview
Task Tracker CLI is an advanced command-line application meticulously designed for comprehensive task and user management. Constructed with Node.js, this project exemplifies the principles of backend development, encompassing file-based data persistence, asynchronous programming methodologies, modular code architecture, and user authentication augmented by role-based access control. It serves as a demonstration of the practical implementation of these concepts within a simulated real-world environment.

## Features

### Task Management
- **Add Tasks**: Introduce new tasks with distinctive descriptions.
- **List Tasks**: Generate a comprehensive list of all tasks, complete with their statuses and timestamps.
- **Update Task Status**: Transition tasks among `todo`, `in-progress`, and `done` statuses.
- **Delete Tasks**: Permanently remove tasks identified by unique IDs.

### User Management
- **Administrative Privileges**:
  - Introduce new users, assigning specific roles (`admin` or `user`).
  - Remove existing users from the system.
- **Authentication**:
  - Secure login mechanism ensuring operations are restricted to authenticated users based on role hierarchy.

### Data Persistence
- **Task Storage**: Task information is persistently stored in `tasks.json` to facilitate consistent data retrieval.
- **User Storage**: User credentials and roles are maintained within `users.json`.
- File initialization processes enforce proper setup and safeguard data integrity.

## Learning Outcomes
This project facilitated the acquisition and application of key backend development competencies, including:
- **Asynchronous File Handling**: Proficient utilization of `fs.promises` for the manipulation of JSON data files.
- **Command-line Tool Engineering**: Development of a robust, flexible CLI application with comprehensive argument parsing.
- **Data Validation and Error Management**: Implementation of rigorous input validation and handling of edge cases.
- **Authentication Techniques**: Integration of secure password hashing using `bcrypt` and token-based session management via JSON Web Tokens (JWTs).
- **Role-based Access Control (RBAC)**: Implementation of granular user permissions aligned with organizational roles.
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
3. Initialize application files:
   ```bash
   node app.js init
   ```

## Usage
Execute the application using the syntax:
```bash
node app.js <command> <arguments>
```

### Command Overview

#### Task Management
- **Add a Task**:
  ```bash
  node app.js add "<task_description>"
  ```
  Example:
  ```bash
  node app.js add "Complete thesis draft"
  ```
- **List All Tasks**:
  ```bash
  node app.js list
  ```
- **Update Task Status**:
  - Mark as Done:
    ```bash
    node app.js mark-done <task_id>
    ```
  - Mark as In Progress:
    ```bash
    node app.js mark-in-progress <task_id>
    ```
  - Reset to Todo:
    ```bash
    node app.js mark-undone <task_id>
    ```
- **Delete a Task**:
  ```bash
  node app.js delete <task_id>
  ```

#### User Management (Administrative Functions)
- **Add a User**:
  ```bash
  node app.js add-user <username> <password> <role> <admin_username> <admin_password>
  ```
  Example:
  ```bash
  node app.js add-user research123 pass123 user admin admin123
  ```
- **Remove a User**:
  ```bash
  node app.js remove-user <username> <admin_username> <admin_password>
  ```

#### Authentication
- **Login to the System**:
  ```bash
  node app.js login <username> <password>
  ```

#### Help Command
List all available commands:
```bash
node app.js help
```

## Project Structure
```
.
├── app.js          # Core application logic
├── tasks.json      # Persistent storage for tasks
├── users.json      # Persistent storage for user data
├── README.md       # Project documentation
```

## Prospective Enhancements
- **Database Integration**: Replace JSON storage with a relational (e.g., PostgreSQL) or NoSQL (e.g., MongoDB) database for enhanced scalability and performance.
- **Interactive CLI**: Employ libraries like `inquirer` to create an interactive, user-friendly command-line interface.
- **Advanced Session Management**: Include token revocation mechanisms and improve security for session persistence.
- **UUID-based Task Identifiers**: Utilize universally unique identifiers (UUIDs) to avoid ID conflicts in multi-user environments.
- **RESTful API Development**: Transition the application to a web-accessible API, broadening its applicability and integration potential.

## Licensing
This application is distributed under the MIT License, allowing free and open-source use, modification, and distribution.

## Acknowledgments
This project was undertaken as an academic endeavor to consolidate backend development skills, including data persistence and access control. Gratitude is extended to the open-source community for providing invaluable resources and inspiration.



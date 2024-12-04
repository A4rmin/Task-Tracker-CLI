
# Task Tracker CLI

## Overview
Task Tracker CLI is a command-line application designed to manage tasks and users efficiently. Built with Node.js, it showcases skills in handling file-based data storage, asynchronous programming, modular code organization, and basic user authentication and authorization. This project demonstrates fundamental concepts of backend development while implementing real-world features such as task management and user roles.

## Features

### Task Management
- **Add Tasks**: Add new tasks with descriptions.
- **List Tasks**: View a list of all tasks, including their status and timestamps.
- **Update Task Status**: Mark tasks as `todo`, `in-progress`, or `done`.
- **Delete Tasks**: Remove tasks by their unique IDs.

### User Management
- **Admin Role**:
  - Add new users with specific roles (`admin` or `user`).
  - Remove users from the system.
- **Authentication**: Secure login system to ensure only authorized users can perform specific actions.

### File-based Persistence
- Stores tasks and users in JSON files (`tasks.json` and `users.json`) for simplicity.
- Handles file initialization and ensures data integrity.

## Learning Outcomes
By developing this project, the following skills were demonstrated:
- **Asynchronous File Operations**: Mastery of `fs.promises` for reading and writing JSON data.
- **Command-line Application Development**: Creation of a flexible CLI tool with arguments parsing.
- **Data Validation and Error Handling**: Robust checks for user input, such as task IDs and roles.
- **User Authentication**: Implementation of a basic authentication mechanism.
- **Role-based Access Control**: Restriction of admin-only operations.
- **Code Organization**: Modular design for scalability and maintainability.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 16 or later)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/task-tracker-cli.git
   cd task-tracker-cli
   ```
2. Install dependencies (if any):
   ```bash
   npm install
   ```
3. Initialize the application files:
   ```bash
   node app.js
   ```

## Usage

Run the application by executing:
```bash
node app.js <command> <arguments>
```

### Available Commands

#### Task Management
- **Add Task**:
  ```bash
  node app.js add <task_description>
  ```
  Example:
  ```bash
  node app.js add "Finish project documentation"
  ```

- **List Tasks**:
  ```bash
  node app.js list
  ```

- **Mark Task Status**:
  - Mark as Done:
    ```bash
    node app.js mark-done <task_id>
    ```
  - Mark as In Progress:
    ```bash
    node app.js mark-in-progress <task_id>
    ```
  - Mark as Undone:
    ```bash
    node app.js mark-undone <task_id>
    ```

- **Delete Task**:
  ```bash
  node app.js delete <task_id>
  ```

#### User Management (Admin Only)
- **Add User**:
  ```bash
  node app.js add-user <username> <password> <role> <admin_username> <admin_password>
  ```
  Example:
  ```bash
  node app.js add-user user123 pass123 user admin admin123
  ```

- **Remove User**:
  ```bash
  node app.js remove-user <username> <admin_username> <admin_password>
  ```

#### Authentication
- **Login**:
  ```bash
  node app.js login <username> <password>
  ```

#### Help
Displays the list of available commands:
```bash
node app.js help
```

## File Structure
```
.
├── app.js          # Main application file
├── tasks.json      # File storing task data
├── users.json      # File storing user data
├── README.md       # Project documentation
```

## Future Enhancements
This project provides a foundation for further improvements:
- **Database Integration**: Replace JSON files with a relational database (e.g., PostgreSQL) for scalability.
- **Password Hashing**: Enhance user authentication by hashing passwords using libraries like `bcrypt`.
- **Interactive CLI**: Use libraries like `inquirer` for a more user-friendly CLI experience.
- **REST API**: Transition to a web-based API for broader accessibility and integration.

## License
This project is licensed under the MIT License.

## Acknowledgments
- This project was built as a learning exercise to demonstrate backend development concepts, role-based access control, and file-based persistence. Special thanks to those who guided and supported its creation.



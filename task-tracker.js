// Load environment variables from .env file
require('dotenv').config();

const args = process.argv.slice(2);
const command = args[0];
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tasksFilePath = process.env.TASKS_FILE_PATH || path.join(__dirname, "tasks.json");
const usersFilePath = process.env.USERS_FILE_PATH || path.join(__dirname, "users.json");

const TaskStatus = {
    TODO: "todo",
    DONE: "done",
    IN_PROGRESS: "in-progress",
};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;  // JWT secret key from environment variable

// Helper Functions for File Operations
const readFileAsync = async (filePath) => {
    try {
        const data = await fs.promises.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return [];
    }
};

const writeFileAsync = async (filePath, data) => {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`${path.basename(filePath)} updated successfully.`);
    } catch (err) {
        console.error(`Error writing to file ${filePath}:`, err);
    }
};

// Initialize files if they don't exist
const initializeFiles = async () => {
    const files = [
        { path: tasksFilePath, defaultData: [] },
        {
            path: usersFilePath,
            defaultData: async () => {
                const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
                return [{ username: process.env.ADMIN_USERNAME, password: hashedPassword, role: process.env.ADMIN_ROLE }];
            }
        },
    ];

    for (const file of files) {
        if (!fs.existsSync(file.path)) {
            const data = typeof file.defaultData === 'function' ? await file.defaultData() : file.defaultData;
            await writeFileAsync(file.path, data);
            console.log(`Initialized ${path.basename(file.path)} file.`);
        }
    }
};

// Helper Function to Validate Task ID
const validateTaskId = (input) => {
    const id = parseInt(input);
    if (isNaN(id) || id <= 0) {
        console.log("Error: Please provide a valid positive task ID.");
        return null;
    }
    return id;
};

// Helper Function to Update Task Status
const updateTaskStatus = (task, newStatus) => {
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
};

// Authentication Functions

// Generate JWT token after successful login
const generateAuthToken = (user) => {
    return jwt.sign({ username: user.username, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1h" });
};

// Authenticate User (Check password with bcrypt)
const authenticateUser = async (username, password) => {
    const users = await readFileAsync(usersFilePath);
    const user = users.find((user) => user.username === username);
    if (!user || !await bcrypt.compare(password, user.password)) {
        console.log("Error: Invalid credentials.");
        return null;
    }
    return user;
};

// Admin Role Check
const checkAdminRole = (user) => {
    if (user && user.role === "admin") {
        return true;
    }
    console.log("Error: Only admins can perform this action.");
    return false;
};

// Task Management Functions
const addTask = async (description) => {
    const tasks = await readFileAsync(tasksFilePath);
    const newId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
    const newTask = {
        id: newId,
        description,
        status: TaskStatus.TODO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    await writeFileAsync(tasksFilePath, tasks);
    console.log(`Task added: "${description}" (ID: ${newTask.id})`);
};

const listTasks = async () => {
    const tasks = await readFileAsync(tasksFilePath);
    if (tasks.length === 0) {
        console.log("No tasks found.");
    } else {
        console.log("Tasks:");
        tasks
            .sort((a, b) => a.id - b.id)
            .forEach((task) => {
                console.log(
                    `[ID: ${task.id}] ${task.description} - Status: ${task.status.toUpperCase()} (Created: ${new Date(task.createdAt).toLocaleString()})`
                );
            });
    }
};

const markTaskStatus = async (taskId, status) => {
    const tasks = await readFileAsync(tasksFilePath);
    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
        console.log(`Error: Task with ID ${taskId} not found.`);
        return;
    }
    updateTaskStatus(task, status);
    await writeFileAsync(tasksFilePath, tasks);
    console.log(`Task marked as ${status}: "${task.description}" (ID: ${taskId})`);
};

const deleteTask = async (taskId) => {
    const tasks = await readFileAsync(tasksFilePath);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
        console.log(`Error: Task with ID ${taskId} not found.`);
        return;
    }
    const deletedTask = tasks.splice(taskIndex, 1);
    await writeFileAsync(tasksFilePath, tasks);
    console.log(`Task deleted: "${deletedTask[0].description}" (ID: ${taskId})`);
};

const clearTasks = async () => {
    const confirmation = args[1];
    const doubleCheck = args[2];

    if (confirmation !== "yes" || doubleCheck !== "confirm") {
        console.log("Error: To clear all tasks, use 'clear yes confirm'.");
        return;
    }
    await writeFileAsync(tasksFilePath, []);
    console.log("All tasks have been cleared successfully.");
};

// User Management Functions (Admin Only)
const addUser = async (adminUser, username, password, role = "user") => {
    if (!checkAdminRole(adminUser)) return;
    const users = await readFileAsync(usersFilePath);
    if (users.some((user) => user.username === username)) {
        console.log("Error: User already exists.");
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword, role });
    await writeFileAsync(usersFilePath, users);
    console.log(`User "${username}" added successfully.`);
};

const removeUser = async (adminUsername, adminPassword, username) => {
    const adminUser = await authenticateUser(adminUsername, adminPassword);
    if (!adminUser || adminUser.role !== 'admin') {
        console.log("Error: Invalid admin credentials.");
        return;
    }
    const users = await readFileAsync(usersFilePath);
    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex === -1) {
        console.log(`Error: User "${username}" not found.`);
        return;
    }
    users.splice(userIndex, 1);
    await writeFileAsync(usersFilePath, users);
    console.log(`User "${username}" removed successfully.`);
};

// Command Handlers
const runApp = async () => {
    await initializeFiles();

    switch (command) {
        case "login":
            const [loginUsername, loginPassword] = args.slice(1);
            if (!loginUsername || !loginPassword) {
                console.log("Error: Please provide both username and password.");
                return;
            }
            const user = await authenticateUser(loginUsername, loginPassword);
            if (user) {
                const token = generateAuthToken(user);
                console.log(`Logged in as ${user.username} (${user.role}). Your token: ${token}`);
            } else {
                console.log("Error: Invalid username or password.");
            }
            break;

        case "add":
            const taskDescription = args[1];
            if (!taskDescription) {
                console.log("Error: Please provide a task description.");
            } else {
                await addTask(taskDescription);
            }
            break;

        case "list":
            console.log("Fetching tasks...");
            await listTasks();
            break;

        case "delete":
            const deleteId = validateTaskId(args[1]);
            if (deleteId) {
                await deleteTask(deleteId);
            }
            break;

        case "mark-done":
            const doneId = validateTaskId(args[1]);
            if (doneId) {
                await markTaskStatus(doneId, TaskStatus.DONE);
            }
            break;

        case "mark-in-progress":
            const inProgressId = validateTaskId(args[1]);
            if (inProgressId) {
                await markTaskStatus(inProgressId, TaskStatus.IN_PROGRESS);
            }
            break;

        case "mark-undone":
            const undoneId = validateTaskId(args[1]);
            if (undoneId) {
                await markTaskStatus(undoneId, TaskStatus.TODO);
            }
            break;

        case "clear":
            await clearTasks();
            break;

        case "add-user":
            const [username, password, role, adminUsername, adminPassword] = args.slice(1);
            const adminUser = await authenticateUser(adminUsername, adminPassword);
            if (adminUser) {
                await addUser(adminUser, username, password, role);
            } else {
                console.log("Error: Invalid admin credentials.");
            }
            break;

        case "remove-user":
            const [userToRemove, adminUsernameForRemoval, adminPasswordForRemoval] = args.slice(1);
            await removeUser(adminUsernameForRemoval, adminPasswordForRemoval, userToRemove);
            break;

        case "help":
            console.log(`
                Task Tracker CLI:
                -----------------
                Available commands:
                - login <username> <password>: Log in with a username and password
                - add <task_description>: Add a new task
                - list: List all tasks
                - delete <task_id>: Delete a task by ID
                - mark-done <task_id>: Mark a task as done
                - mark-in-progress <task_id>: Mark a task as in-progress
                - mark-undone <task_id>: Mark a task as undone
                - clear: Clear all tasks after double confirmation
                - add-user <username> <password> <role> <admin_username> <admin_password>: Admin adds a new user
                - remove-user <username> <admin_username> <admin_password>: Admin removes a user
                - help: Show this help message
            `);
            break;

        default:
            console.log("Unknown command. Use 'help' for a list of available commands.");
    }
};

// Start the application
runApp();

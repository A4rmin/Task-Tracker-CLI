// Task Tracker CLI App with Admin and User Role Management

const args = process.argv.slice(2);
const command = args[0];
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const tasksFilePath = path.join(__dirname, "tasks.json");
const usersFilePath = path.join(__dirname, "users.json");

const TaskStatus = {
    TODO: "todo",
    DONE: "done",
    IN_PROGRESS: "in-progress",
};

// Helper Functions (Async File Operations)
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
        console.log(`${filePath} updated successfully.`);
    } catch (err) {
        console.error(`Error writing to file ${filePath}:`, err);
    }
};

// Initialize files if not exist
const initializeFiles = async () => {
    const files = [
        { path: tasksFilePath, defaultData: [] },
        { path: usersFilePath, defaultData: [{ username: "admin", password: "admin", role: "admin" }] },
    ];

    for (const file of files) {
        if (!fs.existsSync(file.path)) {
            await writeFileAsync(file.path, file.defaultData);
            console.log(`Initialized ${path.basename(file.path)} file.`);
        }
    }
};

// Centralized Task Status Update
const updateTaskStatusHelper = (task, newStatus) => {
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
};

// Task ID Validation
const validateTaskId = (input) => {
    const id = parseInt(input);
    if (isNaN(id) || id <= 0) {
        console.log("Error: Please provide a valid positive task ID.");
        return null;
    }
    return id;
};

// User Authentication (Admin Check)
const authenticateUser = async (username, password) => {
    const users = await readFileAsync(usersFilePath);
    const user = users.find((u) => u.username === username && u.password === password);
    return user;
};

// Add User (Only Admin)
const addUser = async (adminUser, username, password, role) => {
    const users = await readFileAsync(usersFilePath);
    if (adminUser.role !== "admin") {
        console.log("Error: Only admins can add users.");
        return;
    }
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        console.log("Error: User already exists.");
        return;
    }
    const newUser = { username, password, role };
    users.push(newUser);
    await writeFileAsync(usersFilePath, users);
    console.log(`User "${username}" added successfully.`);
};

// Command Handlers
const runApp = async () => {
    switch (command) {
        case "add":
            const taskDescription = args[1];
            if (!taskDescription) {
                console.log("Error: Please provide a task description.");
            } else {
                const tasks = await readFileAsync(tasksFilePath);
                const newId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
                const newTask = {
                    id: newId,
                    description: taskDescription,
                    status: TaskStatus.TODO,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                tasks.push(newTask);
                await writeFileAsync(tasksFilePath, tasks);
                console.log(`Task added: "${taskDescription}" (ID: ${newTask.id})`);
            }
            break;

        case "list":
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
            break;

        case "delete":
            const deleteId = validateTaskId(args[1]);
            if (deleteId) {
                const tasks = await readFileAsync(tasksFilePath);
                const taskIndex = tasks.findIndex((task) => task.id === deleteId);
                if (taskIndex === -1) {
                    console.log(`Error: Task with ID ${deleteId} not found.`);
                } else {
                    const deletedTask = tasks.splice(taskIndex, 1);
                    await writeFileAsync(tasksFilePath, tasks);
                    console.log(`Task deleted: "${deletedTask[0].description}" (ID: ${deleteId})`);
                }
            }
            break;

        case "mark-done":
            const doneID = validateTaskId(args[1]);
            if (doneID) {
                const tasks = await readFileAsync(tasksFilePath);
                const task = tasks.find((task) => task.id === doneID);
                if (task) {
                    updateTaskStatusHelper(task, TaskStatus.DONE);
                    await writeFileAsync(tasksFilePath, tasks);
                    console.log(`Task marked as done: "${task.description}" (ID: ${doneID})`);
                } else {
                    console.log(`Error: Task with ID ${doneID} not found.`);
                }
            }
            break;

        case "mark-in-progress":
            const inProgressID = validateTaskId(args[1]);
            if (inProgressID) {
                const tasks = await readFileAsync(tasksFilePath);
                const task = tasks.find((task) => task.id === inProgressID);
                if (task) {
                    updateTaskStatusHelper(task, TaskStatus.IN_PROGRESS);
                    await writeFileAsync(tasksFilePath, tasks);
                    console.log(`Task marked as in-progress: "${task.description}" (ID: ${inProgressID})`);
                } else {
                    console.log(`Error: Task with ID ${inProgressID} not found.`);
                }
            }
            break;

        case "mark-undone":
            const undoneId = validateTaskId(args[1]);
            if (undoneId) {
                const tasks = await readFileAsync(tasksFilePath);
                const task = tasks.find((task) => task.id === undoneId);
                if (task) {
                    updateTaskStatusHelper(task, TaskStatus.TODO);
                    await writeFileAsync(tasksFilePath, tasks);
                    console.log(`Task marked as undone: "${task.description}" (ID: ${undoneId})`);
                } else {
                    console.log(`Error: Task with ID ${undoneId} not found.`);
                }
            }
            break;

        case "add-user":
            const username = args[1];
            const password = args[2];
            const role = args[3] || "user"; // Default role is 'user'
            const adminUsername = args[4];
            const adminPassword = args[5];
            const adminUser = await authenticateUser(adminUsername, adminPassword);

            if (adminUser) {
                await addUser(adminUser, username, password, role);
            } else {
                console.log("Error: Invalid admin credentials.");
            }
            break;

        case "help":
            console.log(`
                Task Tracker CLI:
                -----------------
                Available commands:
                - add <task_description>: Add a new task
                - list: List all tasks
                - delete <task_id>: Delete a task by ID
                - mark-done <task_id>: Mark a task as done
                - mark-in-progress <task_id>: Mark a task as in-progress
                - mark-undone <task_id>: Mark a task as undone
                - add-user <username> <password> <role> <admin_username> <admin_password>: Admin adds a new user
                - help: Show this help message
            `);
            break;

        default:
            if (!command) {
                console.log("No command provided. Use 'help' for available commands.");
            } else {
                console.log("Unknown command. Use 'help' for available commands.");
            }
            break;
    }
};

// Initialize the files when the app starts
initializeFiles().then(runApp);

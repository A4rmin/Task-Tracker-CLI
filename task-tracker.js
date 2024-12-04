// Task Tracker CLI App

const args = process.argv.slice(2);
const command = args[0];
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "tasks.json");

// Task Status Enum
const TaskStatus = {
    TODO: "todo",
    DONE: "done",
    IN_PROGRESS: "in-progress",
};

// Initialize tasks.json if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    console.log("Initialized tasks.json file.");
}

// Helper Functions
const readTasks = () => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
};

const writeTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    console.log("Tasks saved successfully.");
};

const updateTaskStatus = (taskId, newStatus) => {
    const tasks = readTasks(); // Always read fresh tasks
    const task = tasks.find((task) => task.id === taskId);
    if (!task) {
        console.log(`Error: Task with ID ${taskId} not found.`);
        return;
    }
    console.log(
        `Task updated: "${task.description}" - Status changed from ${task.status.toUpperCase()} to ${newStatus.toUpperCase()} (ID: ${taskId})`
    );
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
};

const validateTaskId = (input) => {
    const id = parseInt(input);
    if (isNaN(id)) {
        console.log("Error: Please provide a valid task ID.");
        return null;
    }
    return id;
};

const displayHelp = () => {
    console.log(`
        Task Tracker CLI:
        -----------------
        Available commands:
        - add <task_description>: Add a new task
        - list: List all tasks
        - delete <task_id>: Delete a task by ID
        - mark-done <task_id>: Mark a task as done
        - mark-undone <task_id>: Mark a task as undone
        - mark-in-progress <task_id>: Mark a task as in-progress
        - todo: Display tasks to do
        - clear: Clear all tasks
        - help: Show this help message
    `);
};

// Command Handlers
switch (command) {
    case "add":
        const taskDescription = args[1];
        if (!taskDescription) {
            console.log("Error: Please provide a task description.");
        } else {
            const tasks = readTasks();
            const newId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
            const newTask = {
                id: newId,
                description: taskDescription,
                status: TaskStatus.TODO,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            tasks.push(newTask);
            writeTasks(tasks);
            console.log(`Task added: "${taskDescription}" (ID: ${newTask.id})`);
        }
        break;

    case "list":
        const tasks = readTasks();
        if (tasks.length === 0) {
            console.log("No tasks found.");
        } else {
            console.log("Tasks:");
            tasks
                .sort((a, b) => a.id - b.id)
                .forEach((task) => {
                    console.log(
                        `[ID: ${task.id}] ${task.description} - Status: ${task.status.toUpperCase()} (Created: ${new Date(
                            task.createdAt
                        ).toLocaleString()})`
                    );
                });
        }
        break;

    case "delete":
        const deleteId = validateTaskId(args[1]);
        if (deleteId) {
            const tasks = readTasks();
            const taskIndex = tasks.findIndex((task) => task.id === deleteId);
            if (taskIndex === -1) {
                console.log(`Error: Task with ID ${deleteId} not found.`);
            } else {
                const deletedTask = tasks.splice(taskIndex, 1);
                writeTasks(tasks);
                console.log(`Task deleted: "${deletedTask[0].description}" (ID: ${deleteId})`);
            }
        }
        break;

    case "mark-done":
        const doneID = validateTaskId(args[1]);
        if (doneID) updateTaskStatus(doneID, TaskStatus.DONE);
        break;

    case "mark-in-progress":
        const inProgressID = validateTaskId(args[1]);
        if (inProgressID) updateTaskStatus(inProgressID, TaskStatus.IN_PROGRESS);
        break;

    case "mark-undone":
        const undoneId = validateTaskId(args[1]);
        if (undoneId) updateTaskStatus(undoneId, TaskStatus.TODO);
        break;

    case "todo":
        const todoTasks = readTasks().filter((task) => task.status === TaskStatus.TODO);
        if (todoTasks.length === 0) {
            console.log("No tasks to do.");
        } else {
            console.log("Tasks to do:");
            todoTasks.forEach((task) => {
                console.log(
                    `[ID: ${task.id}] ${task.description} - Status: ${task.status.toUpperCase()} (Created: ${new Date(
                        task.createdAt
                    ).toLocaleString()})`
                );
            });
        }
        break;

    case "clear":
        const readline = require("readline");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Are you sure you want to clear all tasks? This action cannot be undone. (yes/no): ", (answer) => {
            if (answer.toLowerCase() === "yes") {
                writeTasks([]);
                console.log("All tasks cleared.");
            } else {
                console.log("Action canceled. No tasks were cleared.");
            }
            rl.close();
        });
        break;


    case "help":
        displayHelp();
        break;

    default:
        if (!command) {
            console.log("No command provided. Use 'help' for available commands.");
        } else {
            console.log("Unknown command. Use 'help' for available commands.");
        }
        break;
}

// cli app to manage tasks

const args = process.argv.slice(2);
const command = args[0];
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "tasks.json");

// Initialize tasks.json if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    console.log("Initialized tasks.json file.")
};

// Helper functions
const readTasks = () => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
}

const writeTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    console.log("Tasks saved successfully.");
}


// func to show help
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
        - help: Show this help message
        `);
};



// command handlers
switch (command) {
    case "add":
        const taskDescription = args[1];
        if (!taskDescription) {
            console.log("ERROR: Please provide a task description.");
        } else {
            const tasks = readTasks();
            const newTask = {
                id: tasks.length + 1,
                description: taskDescription,
                status: "todo",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            tasks.push(newTask)
            writeTasks(tasks)
            console.log(`Task added: ${taskDescription} (ID: ${newTask.id})`);
        }
        break;

    case "list":
        const tasks = readTasks();
        if (tasks.length === 0) {
            console.log("No tasks found.");
        } else {
            console.log("Tasks:");
            tasks.forEach(task => {
                console.log(`[${task.id}] ${task.description} - ${task.status}`);
            });
        }
        break;
    case "delete":
        const deleteId = parseInt(args[1]);
        if (isNaN(deleteId)) {
            console.log("Error: Please provide a valid task ID.")
        } else {
            const tasks = readTasks();
            const taskIndex = tasks.findIndex((task) => task.id === deleteId);
            if (taskIndex === -1) {
                console.log(`Error: Task with ID ${deleteId} not found.`);
            } else {
                const deletedTask = tasks.splice(taskIndex, 1);
                writeTasks(tasks);
                console.log(`Task deleted: "${deletedTask[0].description}" (ID: ${deleteId})`);
            };
        };
        break;
    case "mark-done":
        const doneID = parseInt(args[1]);
        if (isNaN(doneID)) {
            console.log("Error: Please provide a valid task ID.")
        } else {
            const tasks = readTasks();
            const task = tasks.find((task) => task.id === doneID);

            if (!task) {
                console.log(`Error: Task with ID ${doneId} not found.`);
            } else {
                task.status = "done";
                task.updatedAt = new Date().toISOString();
                writeTasks(tasks);
                console.log(`Task marked as done: "${task.description}" (ID: ${doneID})`);
            }
        };
        break;
    case "mark-in-progress":
        const inProgressId = parseInt(args[1]);
        if (isNaN(inProgressId)) {
            console.log("Error: Please Provide a valid task ID.");
        } else {
            const tasks = readTasks();
            const task = tasks.find((task) => task.id === inProgressId);

            if (!task) {
                console.log(`Error: Task with ID ${inProgressId} not found.`);
            } else {
                task.status = "in-progress";
                task.updatedAt = new Date().toISOString();
                writeTasks(tasks);
                console.log(`Task marked as in-progress: "${task.description}" (ID: ${inProgressId})`);
            }

        };
        break;
    case "mark-undone":
        console.log("Marking a task as undone ...");
        break;
    case "todo":
        console.log("Displaying tasks to do ...");
        break;
    case "help":
        displayHelp();
        break;
    default:
        console.log("Unknown command, Please use help for available commands");
        break;
}
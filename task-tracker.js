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

const writeTasks = () => {
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
        console.log("Adding a task ...");
        break;
    case "list":
        console.log("listing all tasks ...");
        break;
    case "delete":
        console.log("Deleting a task ...");
        break;
    case "mark-done":
        console.log("Marking a task as done ...");
        break;
    case "mark-undone":
        console.log("Marking a task as undone ...");
        break;
    case "todo":
        console.log("Displaying tasks to do ...");
        break;
    case "mark-in-progress":
        console.log("Marking a task as in-progress...");
        break;
    case "help":
        displayHelp();
        break;
    default:
        console.log("Unknown command, Please use help for available commands");
        break;
}
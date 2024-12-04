// cli app to manage tasks

const args = process.argv.slice(2);

const command = args[0];

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
    case "help":
        console.log("Available commands: add, list, delete, help");
        break;
    default:
        console.log("Unknown command, Please use help for available commands");
        break;
}
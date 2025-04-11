const app = require("./app");
const http = require("http");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });

// Connect to Database
connectDatabase();

// Create HTTP Server
const server = http.createServer(app);

//
// Start the Server
const PORT = process.env.PORT ||  6000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle Unexpected Errors
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => process.exit(0));
});

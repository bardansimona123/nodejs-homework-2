// server.js
const app = require("./app");
const connectDB = require("./db");

connectDB(); // Establish MongoDB connection

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});


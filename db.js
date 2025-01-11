// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://bardansimona2006:dbBardanSimona123%40@cluster0.pwuzq.mongodb.net/db-contacts?retryWrites=true&w=majority");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;


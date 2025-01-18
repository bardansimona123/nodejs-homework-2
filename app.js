const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const usersRouter = require("./routes/api/users");

const app = express();

// Conectarea la baza de date MongoDB
const DB_URI = "mongodb+srv://bardansimona2006:dbBardanSimona123%40@cluster0.pwuzq.mongodb.net/db-contacts?retryWrites=true&w=majority";


mongoose.connect(DB_URI,)
.then(() => console.log("Conexiunea la baza de date a fost realizată cu succes!"))
.catch((err) => {
    console.error("Eroare la conectarea la baza de date:", err.message);
    process.exit(1); // Oprește aplicația în caz de eroare de conexiune
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Rute

app.use("/api/users", usersRouter);

module.exports = app;

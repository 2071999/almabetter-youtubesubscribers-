// This code sets up a server using Express.js and connects it to a MongoDB database using Mongoose.

// Importing necessary modules
const express = require("express"); // Importing Express module
const app = require("./src/app"); // Importing custom app module
const mongoose = require("mongoose"); // Importing Mongoose module
const port = process.env.port || 3003; // Setting the port number

// Middleware to parse JSON bodies and URL-encoded bodies
app.use(express.json()); // Parsing JSON bodies
app.use(express.urlencoded({ extended: false })); // Parsing URL-encoded bodies

// Connecting to the database
const DATABASE_URL =
"mongodb+srv://tapan007sathwara:Tapan_12345@cluster0.resxibh.mongodb.net/";

mongoose.connect(DATABASE_URL, {
useNewUrlParser: true,
useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.log(err)); // Handling database connection errors
db.once("open", () => console.log("connected to database")); // Logging successful database connection

// Starting the server
app.listen(port, () => console.log(`App listening on port ${port}!`)); // Logging the server start and listening on the specified port

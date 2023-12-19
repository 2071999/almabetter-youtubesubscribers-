// Import required dependencies
const mongoose = require("mongoose"); 
const subscriberModel = require("./models/subscribers"); 
const data = require("./data"); 

// Connect to DATABASE
const DATABASE_URL = "mongodb+srv://tapan007sathwara:Tapan_12345@cluster0.resxibh.mongodb.net/";
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
});
const db = mongoose.connection; // Get the database connection object

db.on("error", (err) => console.log(err)); // Event listener for connection errors
db.once("open", () => console.log("Database created...")); // Event listener for successful connection

const refreshAll = async () => {
  // Function to refresh data in the database
  await subscriberModel.deleteMany({}); // Delete all existing documents in the "subscribers" collection
  await subscriberModel.insertMany(data); // Insert new documents from the "data" array into the "subscribers" collection
  await mongoose.disconnect(); // Disconnect from the database
};

refreshAll(); // Call the refreshAll function to execute the data refresh

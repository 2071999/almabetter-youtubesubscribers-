const express = require("express"); // Import the Express framework
const path = require("path"); // Import the path module for working with file paths

//SCHEMA
const schema = require("./models/subscribers"); // Import the subscriber model
const { error } = require("console"); // Import the 'error' object from the console module

const app = express(); // Create an Express application

//PARSE INCOMING JSON DATA
app.use(express.json()); // Middleware to parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Middleware to parse incoming URL-encoded data

//HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html")); // Serve the index.html file as the home page
});

//THIS ROUTE SHOWS ALL THE SUBSCRIBERS LIST WITH DETAILS
app.get("/subscribers", async (req, res, next) => {
  try {
    let subscribers = await schema.find(); // Retrieve all subscribers from the schema/model
    res.status(200).json(subscribers); // Send the subscribers as a JSON response with a status of 200 (OK)
  } catch (err) {
    res.status(400); // Set the response status to 400 (Bad Request)
    next(err); // Pass the error to the error handling middleware
  }
});

//THIS ROUTE PROVIDES AN ARRAY OF ALL SUBSCRIBERS WITH ONLY TWO FIELDS, THEIR NAME AND SUBSCRIBED CHANNEL.
app.get("/subscribers/names", async (req, res, next) => {
  try {
    let subscribers = await schema.find(
      {},
      { name: 1, subscribedChannel: 1, _id: 0 }
    ); // Retrieve subscribers with only the name and subscribedChannel fields from the schema/model
    res.status(200).json(subscribers); // Send the subscribers as a JSON response with a status of 200 (OK)
  } catch (err) {
    res.status(400); // Set the response status to 400 (Bad Request)
    next(err); // Pass the error to the error handling middleware
  }
});

// THIS ROUTE PROVIDES THE DETAILS OF SUBSCRIBER WITH THE GIVEN ID.
app.get("/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id; // Extract the ID parameter from the request URL
    if (!id) {
      res.status(400).json({ message: "No ID provided" }); // Send a JSON response with a status of 400 (Bad Request)
      return;
    }
    const subscriber = await schema.findById(id); // Find a subscriber with the given ID in the schema/model
    if (!subscriber) {
      res.status(404).json({ message: "Subscriber not found" }); // Send a JSON response with a status of 404 (Not Found)
      return;
    }
    res.send(subscriber); // Send the subscriber details as the response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Send a JSON response with a status of 400 (Bad Request) and the error message
  }
});

// POST create a new subscriber
app.post("/subscribers", async (req, res) => {
  try {
    const { name, subscribedChannel } = req.body;
    if (!name || !subscribedChannel) {
      res.status(400).json({ message: "Name and Subscribed Channel are required" });
      return;
    }

    const newSubscriber = new schema({ name, subscribedChannel });
    const savedSubscriber = await newSubscriber.save();
    res.status(201).json(savedSubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST create a new subscriber with names only
app.post("/subscribers/names", async (req, res) => {
  try {
    const { name, subscribedChannel } = req.body;
    if (!name || !subscribedChannel) {
      res.status(400).json({ message: "Name and Subscribed Channel are required" });
      return;
    }

    const newSubscriber = new schema({ name, subscribedChannel });
    const savedSubscriber = await newSubscriber.save();
    const responseSubscriber = { name: savedSubscriber.name, subscribedChannel: savedSubscriber.subscribedChannel };
    res.status(201).json(responseSubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST create a new subscriber by ID (This might not be standard practice, adjust based on your use case)
app.post("/subscribers/:id", async (req, res) => {
  try {
    const { name, subscribedChannel } = req.body;
    const id = req.params.id;
    if (!id || !name || !subscribedChannel) {
      res.status(400).json({ message: "ID, Name, and Subscribed Channel are required" });
      return;
    }

    const newSubscriber = new schema({ _id: id, name, subscribedChannel });
    const savedSubscriber = await newSubscriber.save();
    res.status(201).json(savedSubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a subscriber by ID
app.delete("/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "No ID provided" });
      return;
    }
    const deletedSubscriber = await schema.findByIdAndDelete(id);
    if (!deletedSubscriber) {
      res.status(404).json({ message: "Subscriber not found" });
      return;
    }
    res.json({ message: "Subscriber deleted successfully", deletedSubscriber });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// HANDLES ALL THE UNWANTED REQUESTS.
app.use((req, res) => {
  res.status(404).json({ message: "Error - Route not found" }); // Send a JSON response with a status of 404 (Not Found)
});

module.exports = app; // Export the Express application

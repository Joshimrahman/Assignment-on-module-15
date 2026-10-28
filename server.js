
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Todo = require("./models/Todo");

const app = express();

// Middleware
app.use(express.json());

// Create a new task
app.post("/todos", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.create({
      title,
      description,
      completed,
    });

    res.status(201).json({
      message: "Task created successfully",
      todo,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// Get all tasks
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();

    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
});

// Get a single task by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(todo);
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;

    res.status(status).json({
      message: "Failed to retrieve task",
      error: error.message,
    });
  }
});

// Update a task by ID
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!todo) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      todo,
    });
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 400;

    res.status(status).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// Delete a task by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;

    res.status(status).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

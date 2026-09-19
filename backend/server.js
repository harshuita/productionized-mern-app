require("dotenv").config();

const express = require("express");
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
const mongoose = require("mongoose");
const Task = require("./models/Task");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.get("/", (req, res) => {
    res.json({
        message: "Productionized MERN API is running"
    });
});
app.get("/api/tasks", asyncHandler(async (req, res) => {
    const tasks = await Task.find();

    res.status(200).json(tasks);
}));
app.post("/api/tasks", asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.title.trim()) {
        return res.status(400).json({
            message: "Title is required"
        });
    }
    const task = await Task.create({
        title: req.body.title,
        completed: false
    });
    res.status(201).json(task)
}));
app.put("/api/tasks/:id",asyncHandler(async(req,res)=>{
    const task= await Task.findByIdAndUpdate(
        req.params.id,
        {
            title:req.body.title,
            completed:req.body.completed
        },
        {
            new:true //give doc after update
        }
    );
    if (!task) {
        return res.status(404).json({
        message: "Task not found"
    });
    }
    res.status(200).json(task);
}));
app.delete("/api/tasks/:id", asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }
    res.status(200).json({
        message: "Task deleted!"
    });

}));
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Something went wrong"
    });
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

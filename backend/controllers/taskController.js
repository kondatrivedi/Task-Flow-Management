
const Task = require('../models/Task');

// CREATE TASK
const createTask = async (req, res) => {
    try {
        const { title, priority } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Task title is required'
            });
        }

        const task = await Task.create({
            title,
            priority
        });

        res.status(201).json({
            message: 'Task created successfully',
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL TASKS
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE TASK
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task updated successfully',
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE TASK
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};

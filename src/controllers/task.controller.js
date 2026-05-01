const taskService = require('../services/task.service');

async function getTask(req, res) {
    try {
        const { search } = req.query;
        const { user_id } = req.user;
        const result = await taskService.getTask(search, user_id);
        return res.status(200).json({
            success: true,
            message: "Successfully get all data.",
            data: result.data,
            user: result.user,
            ada: result.ada
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

async function updateTaskSudah(req, res) {
    try {
        const { user_id } = req.user;
        const { task_id } = req.params;
        const result = await taskService.updateTaskSudah(user_id, task_id);
        return res.status(200).json({
            success: true,
            message: "Berhasil mengupdate task",
            data: result.data
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

async function createTask(req, res) {
    try {
        const { user_id } = req.user;
        const { title, description, deadline } = req.body;
        const result = await taskService.createTask(user_id, title, description, deadline);
        return res.status(201).json({
            success: true,
            message: "Successfully created task",
            data: result.data
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

async function updateTask(req, res) {
    try {
        const { user_id } = req.user;
        const { task_id } = req.params;
        const { title, description, deadline } = req.body;
        const result = await taskService.updateTask(user_id, task_id, title, description, deadline);
        return res.status(201).json({
            success: true,
            message: "Berhasil mengupdate task",
            data: result.data
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteTask(req, res) {
    try {
        const { user_id } = req.user;
        const { task_id } = req.params;
        const result = await taskService.deleteTask(user_id, task_id);
        return res.status(200).json({
            success: true,
            message: "Successfully deleted the task.",
            data: result.data
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getTask, updateTaskSudah, createTask, updateTask, deleteTask };
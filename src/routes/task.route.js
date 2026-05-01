const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authenticate");
const taskController = require('../controllers/task.controller');

router.get('/', authMiddleware, taskController.getTask);
router.post('/', authMiddleware, taskController.createTask);
router.put('/:task_id', authMiddleware, taskController.updateTask);
router.put('/:task_id/done', authMiddleware, taskController.updateTaskSudah);
router.delete('/:task_id', authMiddleware, taskController.deleteTask);

module.exports = router;
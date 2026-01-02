const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        const userId = req.user.id;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                userId
            },
        });
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;
        const userId = req.user.id;

        // Verify ownership
        const existingTask = await prisma.task.findUnique({ where: { id: parseInt(id) } });
        if (!existingTask || existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized or Task not found' });
        }

        const task = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                status,
                priority
            },
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verify ownership
        const existingTask = await prisma.task.findUnique({ where: { id: parseInt(id) } });
        if (!existingTask || existingTask.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized or Task not found' });
        }

        await prisma.task.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };

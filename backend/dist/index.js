"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const dailyLogRoutes_1 = __importDefault(require("./routes/dailyLogRoutes"));
const workerRoutes_1 = __importDefault(require("./routes/workerRoutes"));
const materialLogRoutes_1 = __importDefault(require("./routes/materialLogRoutes"));
const auth_1 = require("./middlewares/auth");
// Basic health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
// API Routes
app.use('/api/v1/projects', projectRoutes_1.default);
app.use('/api/v1/daily-logs', dailyLogRoutes_1.default);
app.use('/api/v1/workers', workerRoutes_1.default);
app.use('/api/v1/material-logs', materialLogRoutes_1.default);
// Simple notification endpoint (protected)
app.post('/api/v1/notifications', auth_1.requireAuth, (req, res) => {
    const { message, type, projectId } = req.body;
    // This endpoint can be expanded to trigger webhooks, push notifications, etc.
    console.log(`Notification [${type}] for project ${projectId}: ${message}`);
    res.status(200).json({ success: true, message: 'Notification sent successfully' });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

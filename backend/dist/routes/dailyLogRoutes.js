"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const dailyLogController_1 = require("../controllers/dailyLogController");
const router = (0, express_1.Router)();
// Apply auth middleware
router.use(auth_1.requireAuth);
router.get('/', dailyLogController_1.getDailyLogs);
router.post('/', dailyLogController_1.createDailyLog);
router.get('/:id', dailyLogController_1.getDailyLogById);
router.patch('/:id', dailyLogController_1.updateDailyLog);
router.delete('/:id', dailyLogController_1.deleteDailyLog);
exports.default = router;

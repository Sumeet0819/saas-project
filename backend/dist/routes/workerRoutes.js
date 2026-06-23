"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const workerController_1 = require("../controllers/workerController");
const router = (0, express_1.Router)();
// Apply auth middleware
router.use(auth_1.requireAuth);
router.get('/', workerController_1.getWorkers);
router.post('/', workerController_1.createWorker);
router.get('/:id', workerController_1.getWorkerById);
router.patch('/:id', workerController_1.updateWorker);
router.delete('/:id', workerController_1.deleteWorker);
exports.default = router;

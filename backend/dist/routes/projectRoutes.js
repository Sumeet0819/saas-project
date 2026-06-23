"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const projectController_1 = require("../controllers/projectController");
const router = (0, express_1.Router)();
// Apply auth middleware to all project routes
router.use(auth_1.requireAuth);
router.get('/', projectController_1.getProjects);
router.post('/', projectController_1.createProject);
router.get('/:id', projectController_1.getProjectById);
router.patch('/:id', projectController_1.updateProject);
router.delete('/:id', projectController_1.deleteProject);
exports.default = router;

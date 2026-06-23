"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const materialLogController_1 = require("../controllers/materialLogController");
const router = (0, express_1.Router)();
// Apply auth middleware
router.use(auth_1.requireAuth);
router.get('/', materialLogController_1.getMaterialLogs);
router.post('/', materialLogController_1.createMaterialLog);
router.get('/:id', materialLogController_1.getMaterialLogById);
router.patch('/:id', materialLogController_1.updateMaterialLog);
router.delete('/:id', materialLogController_1.deleteMaterialLog);
exports.default = router;

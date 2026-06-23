"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMaterialLog = exports.updateMaterialLog = exports.getMaterialLogById = exports.createMaterialLog = exports.getMaterialLogs = void 0;
const supabase_1 = require("../config/supabase");
const getMaterialLogs = async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase.from('material_logs').select('*');
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getMaterialLogs = getMaterialLogs;
const createMaterialLog = async (req, res) => {
    try {
        const logData = req.body;
        const { data, error } = await supabase_1.supabase.from('material_logs').insert([logData]).select();
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(201).json(data[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.createMaterialLog = createMaterialLog;
const getMaterialLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase_1.supabase.from('material_logs').select('*').eq('id', id).single();
        if (error) {
            res.status(404).json({ error: 'Material log not found' });
            return;
        }
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getMaterialLogById = getMaterialLogById;
const updateMaterialLog = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabase.from('material_logs').update(updates).eq('id', id).select();
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(200).json(data[0]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateMaterialLog = updateMaterialLog;
const deleteMaterialLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.supabase.from('material_logs').delete().eq('id', id);
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(200).json({ message: 'Material log deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteMaterialLog = deleteMaterialLog;

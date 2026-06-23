"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDailyLog = exports.updateDailyLog = exports.getDailyLogById = exports.createDailyLog = exports.getDailyLogs = void 0;
const supabase_1 = require("../config/supabase");
const getDailyLogs = async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase.from('daily_logs').select('*');
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
exports.getDailyLogs = getDailyLogs;
const createDailyLog = async (req, res) => {
    try {
        const logData = req.body;
        const { data, error } = await supabase_1.supabase.from('daily_logs').insert([logData]).select();
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
exports.createDailyLog = createDailyLog;
const getDailyLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase_1.supabase.from('daily_logs').select('*').eq('id', id).single();
        if (error) {
            res.status(404).json({ error: 'Daily log not found' });
            return;
        }
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getDailyLogById = getDailyLogById;
const updateDailyLog = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabase.from('daily_logs').update(updates).eq('id', id).select();
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
exports.updateDailyLog = updateDailyLog;
const deleteDailyLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.supabase.from('daily_logs').delete().eq('id', id);
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(200).json({ message: 'Daily log deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteDailyLog = deleteDailyLog;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = exports.updateWorker = exports.getWorkerById = exports.createWorker = exports.getWorkers = void 0;
const supabase_1 = require("../config/supabase");
const getWorkers = async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase.from('workers').select('*');
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
exports.getWorkers = getWorkers;
const createWorker = async (req, res) => {
    try {
        const workerData = req.body;
        const { data, error } = await supabase_1.supabase.from('workers').insert([workerData]).select();
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
exports.createWorker = createWorker;
const getWorkerById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase_1.supabase.from('workers').select('*').eq('id', id).single();
        if (error) {
            res.status(404).json({ error: 'Worker not found' });
            return;
        }
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getWorkerById = getWorkerById;
const updateWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabase.from('workers').update(updates).eq('id', id).select();
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
exports.updateWorker = updateWorker;
const deleteWorker = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.supabase.from('workers').delete().eq('id', id);
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(200).json({ message: 'Worker deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteWorker = deleteWorker;

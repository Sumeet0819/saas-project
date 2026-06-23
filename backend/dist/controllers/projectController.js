"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.createProject = exports.getProjects = void 0;
const supabase_1 = require("../config/supabase");
const getProjects = async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase.from('projects').select('*');
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
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    try {
        const projectData = req.body;
        const { data, error } = await supabase_1.supabase.from('projects').insert([projectData]).select();
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
exports.createProject = createProject;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase_1.supabase.from('projects').select('*').eq('id', id).single();
        if (error) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabase.from('projects').update(updates).eq('id', id).select();
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
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.supabase.from('projects').delete().eq('id', id);
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProject = deleteProject;

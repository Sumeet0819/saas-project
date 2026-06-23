import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { Project } from '../types';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectData: Partial<Project> = req.body;
    const { data, error } = await supabase.from('projects').insert([projectData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<Project> = req.body;
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { Worker } from '../types';

export const getWorkers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('workers').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createWorker = async (req: Request, res: Response): Promise<void> => {
  try {
    const workerData: Partial<Worker> = req.body;
    const { data, error } = await supabase.from('workers').insert([workerData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('workers').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Worker not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateWorker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<Worker> = req.body;
    const { data, error } = await supabase.from('workers').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteWorker = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('workers').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Worker deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

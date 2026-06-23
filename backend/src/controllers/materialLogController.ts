import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { MaterialLog } from '../types';

export const getMaterialLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('material_logs').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaterialLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const logData: Partial<MaterialLog> = req.body;
    const { data, error } = await supabase.from('material_logs').insert([logData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaterialLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('material_logs').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Material log not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaterialLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<MaterialLog> = req.body;
    const { data, error } = await supabase.from('material_logs').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaterialLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('material_logs').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Material log deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

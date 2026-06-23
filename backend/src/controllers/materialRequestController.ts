import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { MaterialRequest } from '../types';

export const getMaterialRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('material_requests').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaterialRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestData: Partial<MaterialRequest> = req.body;
    const { data, error } = await supabase.from('material_requests').insert([requestData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaterialRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('material_requests').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Material request not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaterialRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<MaterialRequest> = req.body;
    const { data, error } = await supabase.from('material_requests').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaterialRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('material_requests').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Material request deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

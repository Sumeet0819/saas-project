import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { MaterialMaster } from '../types';

export const getMaterialMasters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('material_master').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaterialMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const materialData: Partial<MaterialMaster> = req.body;
    const { data, error } = await supabase.from('material_master').insert([materialData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaterialMasterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('material_master').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Material not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaterialMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<MaterialMaster> = req.body;
    const { data, error } = await supabase.from('material_master').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaterialMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('material_master').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

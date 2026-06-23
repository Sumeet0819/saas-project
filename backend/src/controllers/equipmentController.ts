import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { Equipment } from '../types';

export const getEquipments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('equipment').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipmentData: Partial<Equipment> = req.body;
    const { data, error } = await supabase.from('equipment').insert([equipmentData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('equipment').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Equipment not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<Equipment> = req.body;
    const { data, error } = await supabase.from('equipment').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

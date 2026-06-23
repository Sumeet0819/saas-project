import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { MaterialInventory } from '../types';

export const getMaterialInventories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('material_inventory').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaterialInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventoryData: Partial<MaterialInventory> = req.body;
    const { data, error } = await supabase.from('material_inventory').insert([inventoryData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaterialInventoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('material_inventory').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Inventory record not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaterialInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<MaterialInventory> = req.body;
    const { data, error } = await supabase.from('material_inventory').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaterialInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('material_inventory').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Inventory record deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { Supplier } from '../types';

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('suppliers').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplierData: Partial<Supplier> = req.body;
    const { data, error } = await supabase.from('suppliers').insert([supplierData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('suppliers').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<Supplier> = req.body;
    const { data, error } = await supabase.from('suppliers').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

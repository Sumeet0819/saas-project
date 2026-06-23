import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { Delivery } from '../types';

export const getDeliveries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('deliveries').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveryData: Partial<Delivery> = req.body;
    const { data, error } = await supabase.from('deliveries').insert([deliveryData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDeliveryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('deliveries').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Delivery not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<Delivery> = req.body;
    const { data, error } = await supabase.from('deliveries').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('deliveries').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

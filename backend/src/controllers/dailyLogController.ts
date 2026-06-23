import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { DailyLog } from '../types';

export const getDailyLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('daily_logs').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createDailyLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const logData: Partial<DailyLog> = req.body;
    const { data, error } = await supabase.from('daily_logs').insert([logData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDailyLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('daily_logs').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Daily log not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDailyLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<DailyLog> = req.body;
    const { data, error } = await supabase.from('daily_logs').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDailyLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('daily_logs').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Daily log deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

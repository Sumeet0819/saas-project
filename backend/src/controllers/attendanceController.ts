import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { Attendance } from '../types';

export const getAttendances = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('attendance').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendanceData: Partial<Attendance> = req.body;
    const { data, error } = await supabase.from('attendance').insert([attendanceData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAttendanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('attendance').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Attendance record not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<Attendance> = req.body;
    const { data, error } = await supabase.from('attendance').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('attendance').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

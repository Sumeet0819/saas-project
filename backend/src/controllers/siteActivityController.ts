import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { SiteActivity } from '../types';

export const getSiteActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('site_activities').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSiteActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const activityData: Partial<SiteActivity> = req.body;
    const { data, error } = await supabase.from('site_activities').insert([activityData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSiteActivityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('site_activities').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Site activity not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSiteActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<SiteActivity> = req.body;
    const { data, error } = await supabase.from('site_activities').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSiteActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('site_activities').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Site activity deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

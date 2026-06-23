import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { SitePhoto } from '../types';

export const getSitePhotos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('site_photos').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSitePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const photoData: Partial<SitePhoto> = req.body;
    const { data, error } = await supabase.from('site_photos').insert([photoData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSitePhotoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('site_photos').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Site photo not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSitePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<SitePhoto> = req.body;
    const { data, error } = await supabase.from('site_photos').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSitePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('site_photos').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Site photo deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getOrganizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('organizations').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrganizationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('organizations').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('organizations').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('organizations').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.from('organizations').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Organization deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

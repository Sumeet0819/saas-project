import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { SiteIssue } from '../types';

export const getSiteIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('site_issues').select('*');
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createSiteIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const issueData: Partial<SiteIssue> = req.body;
    const { data, error } = await supabase.from('site_issues').insert([issueData]).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(201).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSiteIssueById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('site_issues').select('*').eq('id', id).single();
    if (error) {
      res.status(404).json({ error: 'Site issue not found' });
      return;
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSiteIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: Partial<SiteIssue> = req.body;
    const { data, error } = await supabase.from('site_issues').update(updates).eq('id', id).select();
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSiteIssue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('site_issues').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Site issue deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

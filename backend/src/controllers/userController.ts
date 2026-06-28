import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, full_name, phone, role, organization_id, profile_photo, is_active } = req.body;

    // 1. Create the user in Supabase Auth
    // Use a default password. In a real app, you'd send an invite email or generate a random one.
    const defaultPassword = 'TempPassword123!'; 
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: { full_name, role }
    });

    if (authError) throw authError;

    // 2. Insert into the public.users table using the generated UUID from Auth
    const { data, error } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name,
      phone,
      role,
      organization_id,
      profile_photo,
      is_active
    }).select().single();

    if (error) {
      // Rollback auth user creation if DB insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('users').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

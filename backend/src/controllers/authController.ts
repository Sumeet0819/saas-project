import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { UserRole } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, phone, role } = req.body;

    if (!email || !password || !full_name || !role) {
      res.status(400).json({ error: 'Missing required fields: email, password, full_name, role' });
      return;
    }

    // 1. Create user in Supabase Auth using admin API (since only admin/manager can register users)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role }
    });

    if (authError || !authData.user) {
      res.status(400).json({ error: authError?.message || 'Failed to create user in Auth' });
      return;
    }

    const userId = authData.user.id;

    // 2. Insert into the public users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          full_name,
          phone,
          role,
          is_active: true
        }
      ])
      .select()
      .single();

    if (userError) {
      // Rollback auth user creation if DB insert fails
      await supabase.auth.admin.deleteUser(userId);
      res.status(500).json({ error: 'Failed to create user record', details: userError.message });
      return;
    }

    res.status(201).json({ message: 'User registered successfully', user: userData });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Create an isolated client for login so we don't mutate the global service_role client
    const { createClient } = require('@supabase/supabase-js');
    const tempClient = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_ANON_KEY || '',
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await tempClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      res.status(401).json({ error: error?.message || 'Invalid login credentials' });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      session: data.session,
      user: data.user
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

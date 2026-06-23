import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

    if (error || !authUser) {
      res.status(401).json({ error: 'Unauthorized', details: error?.message });
      return;
    }

    // Fetch user details including role from our users table
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // Attach enriched user, fallback to authUser.user_metadata if DB record is missing
    req.user = dbUser || { 
      id: authUser.id, 
      email: authUser.email, 
      role: authUser.user_metadata?.role 
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({ error: 'Forbidden: No role assigned' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden: Requires one of roles [${allowedRoles.join(', ')}]` });
      return;
    }

    next();
  };
};

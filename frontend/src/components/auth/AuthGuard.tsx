'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { supabase } from '../../services/supabaseClient';
import { setCredentials, logout } from '../../store/slices/authSlice';
import api from '../../services/api';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          dispatch(logout());
          router.replace('/login');
          return;
        }

        // We have a session but Redux might be empty (e.g., page refresh)
        if (!isAuthenticated) {
          // Extract user details directly from Supabase session metadata
          try {
            const { id, email, user_metadata } = session.user;
            
            dispatch(setCredentials({
              user: {
                id,
                email: email || '',
                full_name: user_metadata?.full_name || '',
                role: user_metadata?.role || 'Guest',
              },
              token: session.access_token
            }));
          } catch (error) {
            console.error('Failed to sync auth user from session', error);
            dispatch(logout());
            router.replace('/login');
          }
        }
      } catch (error) {
        console.error('Auth check error', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-(--bg-primary)">
        <ConstructionLoader size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}

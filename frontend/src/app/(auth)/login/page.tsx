'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Lock, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { supabase } from '../../../services/supabaseClient';
import { useAppDispatch } from '../../../store/hooks';
import { setCredentials } from '../../../store/slices/authSlice';
import api from '../../../services/api';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReactHookForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.session && authData.user) {
        // Use user metadata directly from Supabase session
        const { id, email, user_metadata } = authData.user;
        
        dispatch(setCredentials({
          user: {
            id,
            email: email || '',
            full_name: user_metadata?.full_name || '',
            role: user_metadata?.role || 'Guest',
          },
          token: authData.session.access_token
        }));
        
        toast.success('Successfully logged in!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Abstract Architectural Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '48px 48px' }}></div>
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Building className="h-6 w-6 text-white" />
            </div>
            CivilSaaS
          </div>
        </div>
        
        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            System Operational
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Build the future,<br/>with confidence.
          </h2>
          <p className="text-lg text-slate-400 font-medium">
            The complete platform for modern contractors to track materials, manage workers, and deliver projects on time and under budget.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 text-2xl font-bold tracking-tight mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Building className="h-5 w-5 text-white" />
            </div>
            CivilSaaS
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-base text-gray-500">Enter your credentials to access your dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-gray-700">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-11 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
                  {...register('email')}
                />
              </div>
              {errors.email?.message && <p className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-semibold text-gray-700">Password</Label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
                  {...register('password')}
                />
              </div>
              {errors.password?.message && <p className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200 bg-blue-600 hover:bg-blue-700 active:scale-[0.98]">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Sign In to Dashboard
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all">
                Contact your administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

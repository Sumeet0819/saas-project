'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Building2, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { supabase } from '../../../services/supabaseClient';
import { useAppDispatch } from '../../../store/hooks';
import { setCredentials } from '../../../store/slices/authSlice';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const features = [
  'Real-time project tracking & reporting',
  'Workforce & attendance management',
  'Material procurement pipeline',
  'Budget vs actual cost analytics',
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      if (authData.session && authData.user) {
        const { id, email, user_metadata } = authData.user;
        dispatch(setCredentials({
          user: {
            id,
            email: email || '',
            full_name: user_metadata?.full_name || '',
            role: user_metadata?.role || 'Guest',
          } as any,
          token: authData.session.access_token
        }));
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8F7]">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#111312] relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #fff 1.5px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        {/* Brand green glow blobs */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#079B68] opacity-10 blur-3xl animate-blob" />
        <div className="absolute -top-32 -right-16 w-64 h-64 rounded-full bg-[#079B68] opacity-8 blur-3xl animate-blob animation-delay-2000" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#079B68] rounded-[10px] flex items-center justify-center shadow-lg shadow-[#079B68]/20">
              <Building2 size={18} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">CivilSaaS</span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs font-medium text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-[#079B68] animate-pulse" />
            All systems operational
          </div>

          <div>
            <h2 className="text-[2.4rem] font-semibold leading-[1.15] tracking-tight text-white mb-4">
              Build the future,<br />
              <span className="text-[#079B68]">with confidence.</span>
            </h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              The complete platform for modern contractors to manage projects, materials, and teams — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-white/60">
                <CheckCircle2 size={15} className="text-[#079B68] shrink-0 mt-0.5" strokeWidth={2} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/30">
          © 2026 CivilSaaS · Enterprise Construction Management
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-[#079B68] rounded-[8px] flex items-center justify-center">
              <Building2 size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-semibold text-[#171A18] text-base tracking-tight">CivilSaaS</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#171A18] tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-sm text-[#929994]">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[#626A66]">
                Email address
              </Label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]"
                  strokeWidth={1.75}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="pl-9 h-10 text-sm bg-white border-[#E6E9E7] rounded-[8px] text-[#171A18] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors"
                  {...register('email')}
                />
              </div>
              {errors.email?.message && (
                <p className="text-xs text-[#B85B63] flex items-center gap-1.5 mt-1">
                  <span className="w-1 h-1 rounded-full bg-[#B85B63] shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-[#626A66]">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-[#079B68] hover:text-[#087A55] font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]"
                  strokeWidth={1.75}
                />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-9 pr-10 h-10 text-sm bg-white border-[#E6E9E7] rounded-[8px] text-[#171A18] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#929994] hover:text-[#626A66] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                </button>
              </div>
              {errors.password?.message && (
                <p className="text-xs text-[#B85B63] flex items-center gap-1.5 mt-1">
                  <span className="w-1 h-1 rounded-full bg-[#B85B63] shrink-0" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] active:bg-[#076B4A] text-white rounded-[8px] shadow-sm cursor-pointer transition-all duration-150 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <ConstructionLoader size="sm" className="p-0" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} strokeWidth={2} />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-[#E6E9E7]">
            <p className="text-xs text-center text-[#929994]">
              Need access?{' '}
              <a
                href="#"
                className="text-[#079B68] hover:text-[#087A55] font-medium transition-colors"
              >
                Contact your administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

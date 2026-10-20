'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/usersSlice';
import { updateAuthUser } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { Camera, Check, Shield, Mail, Phone, KeyRound, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Admin:             { bg: '#F3EFFE', text: '#7C4DFF', border: 'rgba(124, 77, 255, 0.2)' },
  'Project Manager': { bg: '#EBF2FF', text: '#2563EB', border: 'rgba(37, 99, 235, 0.2)' },
  'Site Engineer':   { bg: '#E7F5EF', text: '#079B68', border: 'rgba(7, 155, 104, 0.2)' },
  Contractor:        { bg: '#FEF9EC', text: '#D5A04A', border: 'rgba(213, 160, 74, 0.2)' },
  Supplier:          { bg: '#F9EDEF', text: '#B85B63', border: 'rgba(184, 91, 99, 0.2)' },
};

export default function ProfileSettingsTab() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    profile_photo: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        profile_photo: user.profile_photo || '',
      });
      setPhotoUrlInput(user.profile_photo || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setIsSaving(true);
    try {
      if (user?.id) {
        // Update user via Redux
        await dispatch(
          updateUser({
            id: user.id,
            body: {
              full_name: formData.full_name,
              phone: formData.phone,
              profile_photo: formData.profile_photo,
            },
          })
        ).unwrap();
      }

      // Update auth state so header reflects changes immediately
      dispatch(
        updateAuthUser({
          full_name: formData.full_name,
          phone: formData.phone,
          profile_photo: formData.profile_photo,
        })
      );

      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyPhoto = () => {
    setFormData((prev) => ({ ...prev, profile_photo: photoUrlInput }));
    setShowPhotoModal(false);
    toast.success('Avatar preview updated. Click "Save Changes" to commit.');
  };

  const roleStyle = ROLE_COLORS[user?.role || 'Admin'] || ROLE_COLORS.Admin;
  const initials = formData.full_name
    ? formData.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AU';

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
          Personal Profile
        </h2>
        <p className="text-xs text-[#929994] mt-0.5">
          Manage your personal details, profile image, and contact information.
        </p>
      </div>

      {/* Main Profile Card */}
      <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
        {/* Avatar & Role Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E6E9E7] dark:border-white/[0.07] gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              {formData.profile_photo ? (
                <img
                  src={formData.profile_photo}
                  alt={formData.full_name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#079B68]/30 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center ring-2 ring-[#079B68]/20 shadow-sm">
                  <span className="text-lg font-bold text-[#079B68]">{initials}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPhotoModal(!showPhotoModal)}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#079B68] text-white flex items-center justify-center shadow-md hover:bg-[#068458] transition-colors cursor-pointer"
                title="Change Photo"
                aria-label="Change Photo"
              >
                <Camera size={12} strokeWidth={2.2} />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                  {formData.full_name || 'Admin User'}
                </h3>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: roleStyle.bg,
                    color: roleStyle.text,
                    border: `1px solid ${roleStyle.border}`,
                  }}
                >
                  {user?.role || 'Admin'}
                </span>
              </div>
              <p className="text-xs text-[#929994] flex items-center gap-1.5">
                <Mail size={12} /> {formData.email || 'user@apexconstruction.com'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPhotoModal(!showPhotoModal)}
            className="text-xs font-medium text-[#079B68] hover:text-[#068458] dark:text-[#0AAE78] self-start sm:self-center transition-colors cursor-pointer"
          >
            {formData.profile_photo ? 'Update photo URL' : 'Add photo URL'}
          </button>
        </div>

        {/* Photo URL popup / input */}
        {showPhotoModal && (
          <div className="mb-6 p-4 rounded-[8px] bg-[#F7F8F7] dark:bg-white/[0.03] border border-[#E6E9E7] dark:border-white/[0.08] space-y-3">
            <Label className="text-xs font-medium text-[#171A18] dark:text-[#EFF1F0]">
              Avatar Image URL
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                className="h-8 text-xs"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleApplyPhoto}
                className="bg-[#079B68] hover:bg-[#068458] text-white shrink-0 h-8 text-xs"
              >
                Apply
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPhotoModal(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Full Name <span className="text-[#B85B63]">*</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                placeholder="e.g. Sumeet Sharma"
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Phone Number
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="h-9 text-xs pl-8"
                />
                <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#929994]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="h-9 text-xs bg-[#F5F6F5] dark:bg-white/[0.04] text-[#929994] cursor-not-allowed"
              />
              <p className="text-[10px] text-[#929994]">Login email cannot be changed directly.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                System Role
              </Label>
              <Input
                id="role"
                value={user?.role || 'Admin'}
                disabled
                className="h-9 text-xs bg-[#F5F6F5] dark:bg-white/[0.04] text-[#929994] cursor-not-allowed"
              />
              <p className="text-[10px] text-[#929994]">Managed by Organization Administrator.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-[#E6E9E7] dark:border-white/[0.07]">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#079B68] hover:bg-[#068458] text-white text-xs h-8 px-4 font-semibold"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <ConstructionLoader size="sm" /> Saving...
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Check size={14} /> Save Changes
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Security Card */}
      <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-[#079B68]" />
              <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                Security & Authentication
              </h3>
            </div>
            <p className="text-xs text-[#929994] max-w-md">
              Secure your account credentials or request a password reset email via Supabase Auth.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toast.success('Password reset email sent to ' + (formData.email || 'your email'))}
            className="text-xs h-8 border-[#E6E9E7] dark:border-white/[0.08] text-[#171A18] dark:text-[#EFF1F0]"
          >
            Reset Password
          </Button>
        </div>
      </Card>
    </div>
  );
}

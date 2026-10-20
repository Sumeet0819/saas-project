'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, User as UserIcon, Mail, Phone, Shield, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUser } from '../../../../store/slices/usersSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { UserRole } from '../../../../types';
import { motion, Variants } from 'framer-motion';

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

function FormSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={fade}
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-[#E6E9E7] dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">{title}</h2>
        {subtitle && <p className="text-xs text-[#929994] mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
        {label}{required && <span className="text-[#B85B63] ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

const inputCls = "h-10 text-sm bg-white dark:bg-[#232622] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors";
const selectTriggerCls = "h-10 text-sm bg-white dark:bg-[#232622] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] focus:ring-[#079B68]/20 focus:border-[#079B68] data-[placeholder]:text-[#929994] transition-colors";

export default function NewUserPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status: userStatus } = useSelector((state: RootState) => state.users);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'Site Engineer' as UserRole,
    organization_id: '',
    profile_photo: '',
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as any).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createUser(formData)).unwrap();
      router.push('/users');
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const isLoading = userStatus === 'loading';
  const canSubmit = !!formData.full_name && !!formData.email && !isLoading;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[800px] mx-auto w-full">
      {/* Header */}
      <motion.div variants={fade} className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] transition-colors cursor-pointer shadow-[0_1px_2px_rgba(16,24,20,0.06)]"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">Add New Member</h1>
          <p className="text-xs text-[#929994] mt-0.5">Provision platform credentials and assign site roles</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormSection title="Account Identity" subtitle="User credentials and identity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Full Name" required>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="e.g. John Doe"
              />
            </FormField>

            <FormField label="Work Email" required>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="name@company.com"
              />
            </FormField>

            <FormField label="Phone Number">
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputCls}
                placeholder="+91 98765 43210"
              />
            </FormField>

            <FormField label="Role Access" required>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, role: (val || 'Site Engineer') as UserRole }))}
              >
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Site Engineer">Site Engineer</SelectItem>
                  <SelectItem value="Contractor">Contractor</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Affiliation & Profile" subtitle="Organization association and avatar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <FormField label="Organization">
                <Select
                  value={formData.organization_id}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, organization_id: val || '' }))}
                >
                  <SelectTrigger className={selectTriggerCls}>
                    <SelectValue placeholder="Select Organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations?.map((org) => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Profile Photo URL">
                <Input
                  id="profile_photo"
                  name="profile_photo"
                  value={formData.profile_photo}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="https://example.com/avatar.jpg"
                />
              </FormField>
            </div>

            <div className="md:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#171A18] dark:text-[#EFF1F0]">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-[#079B68]"
                />
                <span className="text-xs font-medium">Account is active and permitted to login</span>
              </label>
            </div>
          </div>
        </FormSection>

        {/* Actions */}
        <motion.div variants={fade} className="flex items-center justify-end gap-3 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-9 px-4 text-sm font-medium rounded-[8px] border-[#E6E9E7] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] cursor-pointer transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="h-9 px-5 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              <>
                <Save size={14} strokeWidth={2} />
                Save User
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

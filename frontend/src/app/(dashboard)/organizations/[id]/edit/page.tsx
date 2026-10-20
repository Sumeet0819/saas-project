'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Building2, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchOrganizationById, updateOrganization } from '../../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../../store/store';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
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

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { currentOrganization: org, status } = useSelector((state: RootState) => state.organizations);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gst_number: '',
    logo: '',
  });

  useEffect(() => {
    dispatch(fetchOrganizationById(orgId));
  }, [orgId, dispatch]);

  useEffect(() => {
    if (org) {
      setFormData({
        name: org.name || '',
        email: org.email || '',
        phone: org.phone || '',
        address: org.address || '',
        gst_number: org.gst_number || '',
        logo: org.logo || '',
      });
    }
  }, [org]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateOrganization({ id: orgId, body: formData })).unwrap();
      router.push(`/organizations/${orgId}`);
    } catch (err) {
      console.error('Failed to update organization:', err);
    }
  };

  if (status === 'loading' && !org) {
    return (
      <div className="flex justify-center items-center py-24">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  const isLoading = status === 'loading';
  const canSubmit = !!formData.name.trim() && !isLoading;

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
          <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">Edit Organization</h1>
          <p className="text-xs text-[#929994] mt-0.5">
            Updating {formData.name || 'Organization'} details
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormSection title="Organization Profile" subtitle="General details and branding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <FormField label="Organization Name" required>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputCls}
                  placeholder="e.g. Apex Infrastructure Pvt Ltd"
                />
              </FormField>
            </div>
            <FormField label="GST / Tax Identification">
              <Input
                id="gst_number"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. 27ABCDE1234F1Z5"
              />
            </FormField>
            <FormField label="Logo URL">
              <Input
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className={inputCls}
                placeholder="https://example.com/logo.png"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Contact & Address" subtitle="Communication coordinates and official address">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Official Email">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={inputCls}
                placeholder="contact@company.com"
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
            <div className="md:col-span-2">
              <FormField label="Registered Office Address">
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Suite 400, Construction Plaza, Sector 12, City"
                />
              </FormField>
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
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

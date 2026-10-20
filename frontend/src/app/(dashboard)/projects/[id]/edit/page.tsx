'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Building, User, Phone, MapPin, DollarSign, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProjectById, updateProject } from '../../../../../store/slices/projectsSlice';
import { fetchOrganizations } from '../../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../../store/store';
import { ProjectType, ProjectStatus } from '../../../../../types';
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
const selectTriggerCls = "h-10 text-sm bg-white dark:bg-[#232622] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] focus:ring-[#079B68]/20 focus:border-[#079B68] data-[placeholder]:text-[#929994] transition-colors";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { currentProject: project, status: projectStatus } = useSelector((state: RootState) => state.projects);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  const [formData, setFormData] = useState({
    project_name: '',
    project_code: '',
    description: '',
    project_type: 'Residential' as ProjectType,
    client_name: '',
    client_phone: '',
    site_address: '',
    budget: '',
    estimated_cost: '',
    start_date: '',
    expected_completion_date: '',
    actual_completion_date: '',
    status: 'Planning' as ProjectStatus,
    organization_id: '',
  });

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  useEffect(() => {
    if (project) {
      setFormData({
        project_name: project.project_name || '',
        project_code: project.project_code || '',
        description: project.description || '',
        project_type: project.project_type || 'Residential',
        client_name: project.client_name || '',
        client_phone: project.client_phone || '',
        site_address: project.site_address || '',
        budget: project.budget !== undefined && project.budget !== null ? project.budget.toString() : '',
        estimated_cost: project.estimated_cost !== undefined && project.estimated_cost !== null ? project.estimated_cost.toString() : '',
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        expected_completion_date: project.expected_completion_date ? project.expected_completion_date.split('T')[0] : '',
        actual_completion_date: project.actual_completion_date ? project.actual_completion_date.split('T')[0] : '',
        status: project.status || 'Planning',
        organization_id: project.organization_id || '',
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : undefined,
      };
      await dispatch(updateProject({ id: projectId, body: payload as any })).unwrap();
      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  if (projectStatus === 'loading' && !project) {
    return (
      <div className="flex justify-center items-center py-24">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  const isLoading = projectStatus === 'loading';
  const canSubmit = !!formData.project_name && !!formData.project_code && !isLoading;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[900px] mx-auto w-full">
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
          <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">Edit Project</h1>
          <p className="text-xs text-[#929994] mt-0.5">
            Updating {formData.project_name || 'project'} ({formData.project_code || projectId})
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Basic info */}
        <FormSection title="Basic Information" subtitle="Project identification and categorization">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Project Name" required>
              <Input
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="e.g. Skyline Towers Phase 1"
              />
            </FormField>
            <FormField label="Project Code" required>
              <Input
                id="project_code"
                name="project_code"
                value={formData.project_code}
                onChange={handleChange}
                required
                className={inputCls}
                placeholder="e.g. ST-PH1-2026"
              />
            </FormField>
            <FormField label="Project Type" required>
              <Select
                value={formData.project_type}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, project_type: (val || 'Residential') as ProjectType }))}
              >
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {['Residential', 'Commercial', 'Industrial', 'Interior'].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Organization">
              <Select
                value={formData.organization_id}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, organization_id: val || '' }))}
              >
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {(organizations || []).map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Description">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of the project scope…"
                  className="w-full text-sm bg-white dark:bg-[#232622] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] px-3 py-2.5 text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus:outline-none focus:border-[#079B68] focus:ring-1 focus:ring-[#079B68]/20 transition-colors resize-none"
                />
              </FormField>
            </div>
          </div>
        </FormSection>

        {/* Client & Location */}
        <FormSection title="Client & Location" subtitle="Client contact details and site location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Client Name">
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                className={inputCls}
                placeholder="e.g. Sharma Builders Pvt. Ltd."
              />
            </FormField>
            <FormField label="Client Phone">
              <Input
                id="client_phone"
                name="client_phone"
                value={formData.client_phone}
                onChange={handleChange}
                className={inputCls}
                placeholder="+91 98765 43210"
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Site Address">
                <Input
                  id="site_address"
                  name="site_address"
                  value={formData.site_address}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Full site address"
                />
              </FormField>
            </div>
          </div>
        </FormSection>

        {/* Financials, Status & Timeline */}
        <FormSection title="Financials & Timeline" subtitle="Budget, schedule, and execution progress">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <FormField label="Budget (Rs.)">
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={handleChange}
                className={inputCls}
                placeholder="0.00"
              />
            </FormField>
            <FormField label="Estimated Cost (Rs.)">
              <Input
                id="estimated_cost"
                name="estimated_cost"
                type="number"
                step="0.01"
                value={formData.estimated_cost}
                onChange={handleChange}
                className={inputCls}
                placeholder="0.00"
              />
            </FormField>
            <FormField label="Status">
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, status: (val || 'Planning') as ProjectStatus }))}
              >
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['Planning', 'Active', 'On Hold', 'Delayed', 'Completed'].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Start Date">
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className={inputCls}
              />
            </FormField>
            <FormField label="Expected Completion">
              <Input
                id="expected_completion_date"
                name="expected_completion_date"
                type="date"
                value={formData.expected_completion_date}
                onChange={handleChange}
                className={inputCls}
              />
            </FormField>
            <FormField label="Actual Completion">
              <Input
                id="actual_completion_date"
                name="actual_completion_date"
                type="date"
                value={formData.actual_completion_date}
                onChange={handleChange}
                className={inputCls}
              />
            </FormField>
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

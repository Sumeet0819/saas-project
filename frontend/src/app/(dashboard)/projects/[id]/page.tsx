'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, Building, MapPin, Calendar, DollarSign,
  Building2, Edit, AlertTriangle, BarChart3, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchProjectById } from '../../../../store/slices/projectsSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';
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

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Planning: { bg: '#EBF2FF', text: '#2563EB', dot: '#2563EB' },
  Active:   { bg: '#E7F5EF', text: '#079B68', dot: '#079B68' },
  'On Hold':{ bg: '#FEF9EC', text: '#D5A04A', dot: '#D5A04A' },
  Delayed:  { bg: '#F9EDEF', text: '#B85B63', dot: '#B85B63' },
  Completed:{ bg: '#F3EFFE', text: '#7C4DFF', dot: '#7C4DFF' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { bg: '#F5F6F5', text: '#929994', dot: '#929994' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.dot }} />
      {status || 'Planning'}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#E6E9E7] dark:border-white/[0.07] last:border-0">
      <div className="w-8 h-8 rounded-[7px] bg-[#F5F6F5] dark:bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-[#929994]" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#929994] mb-0.5">{label}</p>
        <p className="text-sm font-medium text-[#171A18] dark:text-[#EFF1F0] truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={fade}
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)]"
    >
      <div className="px-5 py-3.5 border-b border-[#E6E9E7] dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </motion.div>
  );
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { currentProject: project, status: projectStatus, error } = useSelector((state: RootState) => state.projects);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  useEffect(() => { dispatch(fetchProjectById(projectId)); }, [projectId, dispatch]);
  useEffect(() => { if (orgStatus === 'idle') dispatch(fetchOrganizations()); }, [orgStatus, dispatch]);

  const org = organizations.find((o) => o.id === project?.organization_id);

  if (projectStatus === 'loading') {
    return <div className="flex justify-center py-24"><ConstructionLoader size="md" /></div>;
  }
  if (error || !project) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-14 h-14 bg-[#F9EDEF] rounded-[12px] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-[#B85B63]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">Project not found</p>
        <p className="text-xs text-[#929994] mb-4">We could not load the project details.</p>
        <Button onClick={() => router.push('/projects')} className="bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] h-9 text-sm cursor-pointer">
          Back to Projects
        </Button>
      </div>
    );
  }

  const budgetUsedPct = project.budget && project.estimated_cost
    ? Math.min(Math.round((project.estimated_cost / project.budget) * 100), 100)
    : 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1100px] mx-auto w-full">
      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/projects')}
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] transition-colors cursor-pointer shadow-[0_1px_2px_rgba(16,24,20,0.06)]"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-[10px] flex items-center justify-center shrink-0">
              <Building size={20} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">{project.project_name}</h1>
                <StatusBadge status={project.status || 'Planning'} />
              </div>
              <p className="text-xs text-[#929994] mt-0.5">{project.project_code} &bull; {project.project_type}</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/projects/${project.id}/edit`)}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <Edit size={14} strokeWidth={2} /> Edit Project
        </Button>
      </motion.div>

      {/* KPI strip */}
      <motion.div variants={fade} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Budget', icon: DollarSign, value: project.budget ? ('Rs.' + project.budget.toLocaleString()) : 'N/A', sub: null, accent: false },
          { label: 'Budget Used', icon: BarChart3, value: (budgetUsedPct + '%'), sub: budgetUsedPct > 90 ? 'Over budget risk' : 'Within budget', accent: budgetUsedPct > 90 },
          { label: 'Start Date', icon: Calendar, value: project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD', sub: null, accent: false },
          { label: 'Due Date', icon: Clock, value: project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD', sub: null, accent: false },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-[0_1px_4px_rgba(16,24,20,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">{kpi.label}</p>
              <div className="w-7 h-7 rounded-[6px] flex items-center justify-center" style={{ background: kpi.accent ? '#F9EDEF' : '#E7F5EF' }}>
                <kpi.icon size={13} style={{ color: kpi.accent ? '#B85B63' : '#079B68' }} strokeWidth={1.75} />
              </div>
            </div>
            <p className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0] leading-tight">{kpi.value}</p>
            {kpi.sub && <p className="text-[10px] mt-0.5" style={{ color: kpi.accent ? '#B85B63' : '#929994' }}>{kpi.sub}</p>}
            {kpi.label === 'Budget Used' && project.budget && (
              <div className="mt-2 h-1.5 bg-[#EEF0EF] dark:bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: (budgetUsedPct + '%') }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: budgetUsedPct > 90 ? '#B85B63' : '#079B68' }}
                />
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Client & Location">
          <InfoRow icon={Building2} label="Client Name"   value={project.client_name || ''} />
          <InfoRow icon={MapPin}    label="Site Address"  value={project.site_address || ''} />
          <InfoRow icon={Building}  label="Organization"  value={org ? org.name : (project.organization_id ? 'Loading...' : '')} />
        </SectionCard>

        <SectionCard title="Financials & Timeline">
          <InfoRow icon={DollarSign} label="Budget"              value={project.budget ? ('Rs.' + project.budget.toLocaleString()) : ''} />
          <InfoRow icon={DollarSign} label="Estimated Cost"      value={project.estimated_cost ? ('Rs.' + project.estimated_cost.toLocaleString()) : ''} />
          <InfoRow icon={Calendar}   label="Start Date"          value={project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''} />
          <InfoRow icon={Calendar}   label="Expected Completion" value={project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''} />
        </SectionCard>

        {project.description && (
          <motion.div
            variants={fade}
            className="md:col-span-2 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)]"
          >
            <div className="px-5 py-3.5 border-b border-[#E6E9E7] dark:border-white/[0.07]">
              <h2 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">Description</h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-[#626A66] dark:text-[#9BA49E] leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Building2, MapPin, Phone, Mail, FileText, Edit, ShieldCheck, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchOrganizationById } from '../../../../store/slices/organizationsSlice';
import { fetchProjects } from '../../../../store/slices/projectsSlice';
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
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-[#E6E9E7] dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </motion.div>
  );
}

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { currentOrganization: org, status, error } = useSelector((state: RootState) => state.organizations);
  const { projects, status: projStatus } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchOrganizationById(orgId));
    if (projStatus === 'idle') dispatch(fetchProjects());
  }, [orgId, projStatus, dispatch]);

  const orgProjects = (projects || []).filter((p) => p.organization_id === orgId);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-24">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-14 h-14 bg-[#F9EDEF] rounded-[12px] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-[#B85B63]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">Organization not found</p>
        <p className="text-xs text-[#929994] mb-4">We could not load this organization's details.</p>
        <Button
          onClick={() => router.push('/organizations')}
          className="bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] h-9 text-sm cursor-pointer"
        >
          Back to Organizations
        </Button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1000px] mx-auto w-full">
      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/organizations')}
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] transition-colors cursor-pointer shadow-[0_1px_2px_rgba(16,24,20,0.06)]"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-[10px] flex items-center justify-center shrink-0 border border-[#079B68]/15">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-[10px]" />
              ) : (
                <Building2 size={20} className="text-[#079B68]" strokeWidth={1.75} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">{org.name}</h1>
                {org.gst_number && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E7F5EF] text-[#079B68] font-semibold">
                    <ShieldCheck size={11} /> Verified GST
                  </span>
                )}
              </div>
              <p className="text-xs text-[#929994] mt-0.5">
                Registered {new Date(org.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/organizations/${org.id}/edit`)}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <Edit size={14} strokeWidth={2} /> Edit Organization
        </Button>
      </motion.div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <SectionCard title="Contact Coordinates">
          <InfoRow icon={Mail} label="Email Address" value={org.email || ''} />
          <InfoRow icon={Phone} label="Phone Number" value={org.phone || ''} />
          <InfoRow icon={MapPin} label="Office Address" value={org.address || ''} />
        </SectionCard>

        <SectionCard title="Corporate Details">
          <InfoRow icon={ShieldCheck} label="GST Number" value={org.gst_number || ''} />
          <InfoRow icon={Calendar} label="Date Registered" value={new Date(org.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          <InfoRow icon={Building2} label="Associated Projects" value={`${orgProjects.length} active project${orgProjects.length === 1 ? '' : 's'}`} />
        </SectionCard>
      </div>

      {/* Projects under this organization */}
      {orgProjects.length > 0 && (
        <SectionCard title={`Projects (${orgProjects.length})`}>
          <div className="divide-y divide-[#E6E9E7] dark:divide-white/[0.05]">
            {orgProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/projects/${p.id}`)}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-[#F9FAF9] dark:hover:bg-white/[0.02] px-2 rounded-[6px] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[#171A18] dark:text-[#EFF1F0]">{p.project_name}</p>
                  <p className="text-xs text-[#929994]">{p.project_code} &bull; {p.project_type}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E7F5EF] text-[#079B68]">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </motion.div>
  );
}

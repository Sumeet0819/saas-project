'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building, MapPin, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import { Project } from '../../../../types';
import { motion } from 'framer-motion';

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Planning: { bg: '#EBF2FF', text: '#2563EB', dot: '#2563EB' },
  Active:   { bg: '#E7F5EF', text: '#079B68', dot: '#079B68' },
  'On Hold':{ bg: '#FEF9EC', text: '#D5A04A', dot: '#D5A04A' },
  Delayed:  { bg: '#F9EDEF', text: '#B85B63', dot: '#B85B63' },
  Completed:{ bg: '#F3EFFE', text: '#7C4DFF', dot: '#7C4DFF' },
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const cfg = STATUS_CONFIG[project.status] || { bg: '#F5F6F5', text: '#929994', dot: '#929994' };

  const budgetUsedPct =
    project.budget && project.estimated_cost
      ? Math.min(Math.round((project.estimated_cost / project.budget) * 100), 100)
      : 0;

  return (
    <div
      onClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] hover:shadow-[0_4px_12px_rgba(16,24,20,0.08)] transition-all flex flex-col h-full cursor-pointer overflow-hidden group"
    >
      {/* Top Header */}
      <div className="p-4 border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold text-[#929994] uppercase tracking-wider">
            {project.project_code}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: cfg.bg, color: cfg.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            {project.status || 'Planning'}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors truncate">
          {project.project_name}
        </h3>
        <p className="text-xs text-[#929994] mt-0.5">{project.project_type}</p>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-xs">
        <div className="space-y-2 text-[#626A66] dark:text-[#9BA49E]">
          {project.site_address && (
            <div className="flex items-center gap-1.5 truncate" title={project.site_address}>
              <MapPin size={13} className="text-[#929994] shrink-0" />
              <span className="truncate">{project.site_address}</span>
            </div>
          )}
          {project.client_name && (
            <div className="flex items-center gap-1.5 truncate">
              <Building size={13} className="text-[#929994] shrink-0" />
              <span className="truncate">Client: {project.client_name}</span>
            </div>
          )}
        </div>

        {/* Budget Progress */}
        {project.budget ? (
          <div className="pt-2 border-t border-[#E6E9E7] dark:border-white/[0.07]">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#929994]">Budget Used ({budgetUsedPct}%)</span>
              <span className="font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                Rs. {project.budget.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 bg-[#EEF0EF] dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${budgetUsedPct}%`,
                  background: budgetUsedPct > 90 ? '#B85B63' : '#079B68',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="pt-2 border-t border-[#E6E9E7] dark:border-white/[0.07] text-[11px] text-[#929994]">
            Budget: Not Specified
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between text-[11px] text-[#929994] bg-[#F9FAF9] dark:bg-white/[0.02]">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {project.start_date
            ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'No start date'}
        </span>
        <span className="text-[#079B68] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          View <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}

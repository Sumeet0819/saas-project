'use client';

import React from 'react';
import { Project, SiteActivity, SiteIssue, DailyLog, MaterialInventory } from '../../types';
import {
  DollarSign, BarChart3, Calendar, Clock,
  CheckCircle2, AlertTriangle, ClipboardList, Package,
  Users, MapPin, Building2, Building
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectOverviewTabProps {
  project: Project;
  orgName?: string;
  activities: SiteActivity[];
  issues: SiteIssue[];
  logs: DailyLog[];
  inventory: MaterialInventory[];
  membersCount: number;
  onOpenDprModal?: () => void;
  onOpenIssueModal?: () => void;
  onSelectTab: (tab: string) => void;
}

export function ProjectOverviewTab({
  project,
  orgName,
  activities,
  issues,
  logs,
  inventory,
  membersCount,
  onSelectTab,
}: ProjectOverviewTabProps) {
  // Calculations
  const budget = Number(project.budget) || 0;
  const estimatedCost = Number(project.estimated_cost) || 0;
  const budgetUsedPct = budget > 0 ? Math.min(Math.round((estimatedCost / budget) * 100), 100) : 0;

  const completedActivities = activities.filter((a) => a.status === 'Completed').length;
  const activityProgressPct = activities.length > 0 ? Math.round((completedActivities / activities.length) * 100) : 0;

  const openIssues = issues.filter((i) => i.status !== 'Resolved');
  const criticalIssuesCount = openIssues.filter((i) => i.priority === 'Critical').length;

  const lowStockItems = inventory.filter((item) => Number(item.current_stock) <= Number(item.opening_stock) * 0.2);

  // Format Dates
  const startDateFormatted = project.start_date
    ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD';

  const dueDateFormatted = project.expected_completion_date
    ? new Date(project.expected_completion_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD';

  return (
    <div className="space-y-5">
      {/* ── Financial & Timeline KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Budget */}
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Project Budget</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#E7F5EF] flex items-center justify-center">
              <DollarSign size={13} className="text-[#079B68]" strokeWidth={2} />
            </div>
          </div>
          <p className="text-lg font-bold text-[#171A18] dark:text-[#EFF1F0]">
            {budget ? `Rs. ${budget.toLocaleString()}` : 'N/A'}
          </p>
          <p className="text-[11px] text-[#929994] mt-1">
            Est. Cost: {estimatedCost ? `Rs. ${estimatedCost.toLocaleString()}` : 'N/A'}
          </p>
        </div>

        {/* Budget Used */}
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Budget Burn</span>
            <div className={`w-7 h-7 rounded-[6px] flex items-center justify-center ${budgetUsedPct > 90 ? 'bg-[#F9EDEF]' : 'bg-[#E7F5EF]'}`}>
              <BarChart3 size={13} className={budgetUsedPct > 90 ? 'text-[#B85B63]' : 'text-[#079B68]'} strokeWidth={2} />
            </div>
          </div>
          <p className="text-lg font-bold text-[#171A18] dark:text-[#EFF1F0]">{budgetUsedPct}%</p>
          <div className="mt-2 h-1.5 bg-[#EEF0EF] dark:bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetUsedPct}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full"
              style={{ background: budgetUsedPct > 90 ? '#B85B63' : '#079B68' }}
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Start Date</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#E7F5EF] flex items-center justify-center">
              <Calendar size={13} className="text-[#079B68]" strokeWidth={2} />
            </div>
          </div>
          <p className="text-base font-bold text-[#171A18] dark:text-[#EFF1F0]">{startDateFormatted}</p>
          <p className="text-[11px] text-[#929994] mt-1">Site mobilized</p>
        </div>

        {/* Due Date */}
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Target Handover</span>
            <div className="w-7 h-7 rounded-[6px] bg-[#E7F5EF] flex items-center justify-center">
              <Clock size={13} className="text-[#079B68]" strokeWidth={2} />
            </div>
          </div>
          <p className="text-base font-bold text-[#171A18] dark:text-[#EFF1F0]">{dueDateFormatted}</p>
          <p className="text-[11px] text-[#929994] mt-1">{project.status} phase</p>
        </div>
      </div>

      {/* ── Operational Site Health Matrix ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Activities */}
        <div
          onClick={() => onSelectTab('activities')}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3.5 hover:border-[#079B68]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-[#626A66] dark:text-[#9BA49E]">Tasks Done</span>
            <CheckCircle2 size={14} className="text-[#079B68]" />
          </div>
          <p className="text-xl font-bold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
            {completedActivities} <span className="text-xs font-normal text-[#929994]">/ {activities.length}</span>
          </p>
          <span className="text-[10px] font-semibold text-[#079B68]">{activityProgressPct}% completed</span>
        </div>

        {/* Open Snags */}
        <div
          onClick={() => onSelectTab('issues')}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3.5 hover:border-[#B85B63]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-[#626A66] dark:text-[#9BA49E]">Open Snags</span>
            <AlertTriangle size={14} className={criticalIssuesCount > 0 ? 'text-[#B85B63]' : 'text-[#D5A04A]'} />
          </div>
          <p className="text-xl font-bold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#B85B63] transition-colors">
            {openIssues.length}
          </p>
          <span className="text-[10px] font-semibold text-[#B85B63]">
            {criticalIssuesCount > 0 ? `${criticalIssuesCount} Critical` : '0 Critical'}
          </span>
        </div>

        {/* DPR Logs */}
        <div
          onClick={() => onSelectTab('dpr')}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3.5 hover:border-[#079B68]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-[#626A66] dark:text-[#9BA49E]">DPR Logs</span>
            <ClipboardList size={14} className="text-[#079B68]" />
          </div>
          <p className="text-xl font-bold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
            {logs.length}
          </p>
          <span className="text-[10px] font-semibold text-[#929994]">Logged days</span>
        </div>

        {/* Materials in Stock */}
        <div
          onClick={() => onSelectTab('materials')}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3.5 hover:border-[#079B68]/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-[#626A66] dark:text-[#9BA49E]">Material Items</span>
            <Package size={14} className="text-[#079B68]" />
          </div>
          <p className="text-xl font-bold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
            {inventory.length}
          </p>
          <span className="text-[10px] font-semibold text-[#D5A04A]">
            {lowStockItems.length > 0 ? `${lowStockItems.length} Low stock` : 'Healthy stock'}
          </span>
        </div>

        {/* Team Assigned */}
        <div
          onClick={() => onSelectTab('team')}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3.5 hover:border-[#079B68]/40 transition-colors cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-[#626A66] dark:text-[#9BA49E]">Team Members</span>
            <Users size={14} className="text-[#079B68]" />
          </div>
          <p className="text-xl font-bold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
            {membersCount}
          </p>
          <span className="text-[10px] font-semibold text-[#079B68]">Engineers & Staff</span>
        </div>
      </div>

      {/* ── Detail Cards: Client & Location + Description ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client & Site */}
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-5 shadow-[0_1px_4px_rgba(16,24,20,0.06)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#929994] mb-3">Client & Site Information</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[7px] bg-[#F5F6F5] dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                <Building2 size={14} className="text-[#929994]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Client Name</p>
                <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] truncate">
                  {project.client_name || 'Not Specified'}
                </p>
                {project.client_phone && <p className="text-xs text-[#929994]">{project.client_phone}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[7px] bg-[#F5F6F5] dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-[#929994]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Site Address</p>
                <p className="text-sm font-medium text-[#171A18] dark:text-[#EFF1F0]">
                  {project.site_address || 'Address not registered'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[7px] bg-[#F5F6F5] dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                <Building size={14} className="text-[#929994]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Managing Organization</p>
                <p className="text-sm font-medium text-[#171A18] dark:text-[#EFF1F0]">{orgName || 'Civil SaaS Org'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scope / Description */}
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-5 shadow-[0_1px_4px_rgba(16,24,20,0.06)] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#929994] mb-3">Scope & Project Description</h3>
            <p className="text-xs text-[#626A66] dark:text-[#9BA49E] leading-relaxed whitespace-pre-wrap">
              {project.description || 'No detailed scope description provided for this project.'}
            </p>
          </div>
          <div className="pt-4 border-t border-[#E6E9E7] dark:border-white/[0.08] mt-4 flex items-center justify-between text-xs text-[#929994]">
            <span>Type: <strong className="text-[#171A18] dark:text-[#EFF1F0]">{project.project_type}</strong></span>
            <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

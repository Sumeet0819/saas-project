'use client';

import React, { useState } from 'react';
import { SiteIssue, IssueStatus, IssuePriority } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { updateSiteIssue } from '../../store/slices/siteIssuesSlice';
import { AlertTriangle, ShieldAlert, CheckCircle, Clock, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface ProjectIssuesTabProps {
  issues: SiteIssue[];
  onOpenIssueModal: () => void;
}

const PRIORITY_CONFIG: Record<IssuePriority, { bg: string; text: string }> = {
  Critical: { bg: '#F9EDEF', text: '#B85B63' },
  High:     { bg: '#FEF0EE', text: '#EA580C' },
  Medium:   { bg: '#FEF9EC', text: '#D5A04A' },
  Low:      { bg: '#EBF2FF', text: '#2563EB' },
};

const STATUS_CONFIG: Record<IssueStatus, { bg: string; text: string }> = {
  Open:        { bg: '#F9EDEF', text: '#B85B63' },
  'In Progress':{ bg: '#FEF9EC', text: '#D5A04A' },
  Resolved:    { bg: '#E7F5EF', text: '#079B68' },
};

export function ProjectIssuesTab({ issues, onOpenIssueModal }: ProjectIssuesTabProps) {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  const handleStatusChange = async (issue: SiteIssue, newStatus: IssueStatus) => {
    await dispatch(updateSiteIssue({ id: issue.id, body: { status: newStatus } }));
  };

  const filtered = issues.filter((iss) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      iss.title.toLowerCase().includes(term) ||
      (iss.description && iss.description.toLowerCase().includes(term)) ||
      iss.category.toLowerCase().includes(term);
    const matchStatus = statusFilter === 'All' || iss.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || iss.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const inputCls =
    'h-9 text-xs bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors';

  return (
    <div className="space-y-4">
      {/* Controls & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" />
            <Input
              placeholder="Search snags, safety hazards…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 ${inputCls}`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Open', 'In Progress', 'Resolved'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-[#E7F5EF] text-[#079B68] dark:bg-[rgba(7,155,104,0.15)]'
                    : 'text-[#929994] hover:text-[#171A18]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={onOpenIssueModal}
          className="h-9 px-4 text-xs font-semibold bg-[#B85B63] hover:bg-[#A34B53] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors shrink-0"
        >
          <Plus size={14} strokeWidth={2.25} /> Report Snag
        </Button>
      </div>

      {/* Issues Feed */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-[10px] bg-[#E7F5EF] flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={22} className="text-[#079B68]" />
          </div>
          <h4 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">
            {statusFilter === 'Resolved' ? 'No Resolved Snags' : 'No Open Snags'}
          </h4>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-4">
            {searchTerm || statusFilter !== 'All'
              ? 'No issues match your current filters. Clear filters to see all.'
              : 'All quality snags and safety concerns have been resolved for this site.'}
          </p>
          <Button
            onClick={onOpenIssueModal}
            variant="outline"
            className="h-8 px-4 text-xs font-semibold text-[#B85B63] border-[#E6E9E7] dark:border-white/[0.08] rounded-[7px] cursor-pointer"
          >
            Report New Snag
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => {
            const pCfg = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.Medium;
            const sCfg = STATUS_CONFIG[issue.status] || STATUS_CONFIG.Open;

            return (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-[0_1px_3px_rgba(16,24,20,0.04)] hover:border-[#B85B63]/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: pCfg.bg, color: pCfg.text }}
                    >
                      {issue.priority} Priority
                    </span>
                    <span className="text-xs font-semibold text-[#626A66] dark:text-[#9BA49E] bg-[#F5F6F5] dark:bg-white/[0.05] px-2 py-0.5 rounded-[5px]">
                      {issue.category}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: sCfg.bg, color: sCfg.text }}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#929994]">
                    Reported {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">
                  {issue.title}
                </h4>

                {issue.description && (
                  <p className="text-xs text-[#626A66] dark:text-[#9BA49E] leading-relaxed mb-3">
                    {issue.description}
                  </p>
                )}

                <div className="pt-3 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between">
                  <span className="text-[10px] text-[#929994]">Action:</span>
                  <div className="flex items-center gap-2">
                    {issue.status !== 'Resolved' ? (
                      <>
                        {issue.status === 'Open' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(issue, 'In Progress')}
                            className="h-7 px-2.5 text-xs text-[#D5A04A] border-[#E6E9E7] rounded-[6px] cursor-pointer"
                          >
                            Mark In Progress
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(issue, 'Resolved')}
                          className="h-7 px-3 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[6px] cursor-pointer"
                        >
                          Resolve Snag
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(issue, 'Open')}
                        className="h-7 px-2.5 text-xs text-[#B85B63] border-[#E6E9E7] rounded-[6px] cursor-pointer"
                      >
                        Re-open
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

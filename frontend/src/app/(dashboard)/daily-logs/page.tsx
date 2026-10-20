'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Image as ImageIcon, Search, LayoutGrid, List, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetDailyLogsQuery } from '../../../store/api/logsApi';
import { DailyLog } from '../../../types';
import clsx from 'clsx';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

const fade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function DailyLogsPage() {
  const { data: logs, isLoading, error } = useGetDailyLogsQuery({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs =
    logs
      ?.filter((log) => {
        const matchesSearch = log.progress_update?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = dateFilter ? new Date(log.log_date).toISOString().split('T')[0] === dateFilter : true;
        return matchesSearch && matchesDate;
      })
      .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()) || [];

  const inputCls = "h-9 text-sm bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">Daily Site Logs</h1>
          <p className="text-xs text-[#929994] mt-0.5">Track day-to-day site progress, weather conditions, and photo updates</p>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" strokeWidth={1.75} />
            <Input
              placeholder="Search progress logs…"
              className={`pl-9 ${inputCls}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Input
              type="date"
              className={inputCls}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-[#929994] hover:text-[#171A18] underline cursor-pointer"
            >
              Clear date
            </button>
          )}
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 bg-[#F5F6F5] dark:bg-white/[0.04] rounded-[8px] border border-[#E6E9E7] dark:border-white/[0.08]">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              'p-1.5 rounded-[6px] transition-all cursor-pointer',
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#1B1E1C] text-[#079B68] shadow-sm'
                : 'text-[#929994] hover:text-[#171A18]'
            )}
            title="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-1.5 rounded-[6px] transition-all cursor-pointer',
              viewMode === 'list'
                ? 'bg-white dark:bg-[#1B1E1C] text-[#079B68] shadow-sm'
                : 'text-[#929994] hover:text-[#171A18]'
            )}
            title="List View"
          >
            <List size={15} />
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={clsx(
              'p-1.5 rounded-[6px] transition-all cursor-pointer',
              viewMode === 'timeline'
                ? 'bg-white dark:bg-[#1B1E1C] text-[#079B68] shadow-sm'
                : 'text-[#929994] hover:text-[#171A18]'
            )}
            title="Timeline View"
          >
            <Clock size={15} />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <ConstructionLoader size="md" />
        </div>
      ) : error ? (
        <motion.div variants={fade} className="bg-white dark:bg-[#1B1E1C] border border-[#B85B63]/20 rounded-[10px] p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-[#B85B63] mb-1">Failed to load daily logs</p>
          <p className="text-xs text-[#929994]">Please check your network or backend connection.</p>
        </motion.div>
      ) : filteredLogs.length === 0 ? (
        <motion.div
          variants={fade}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-12 text-center shadow-[0_1px_4px_rgba(16,24,20,0.06)]"
        >
          <div className="w-12 h-12 bg-[#F5F6F5] dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar size={20} className="text-[#929994]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">No daily logs found</p>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-4">
            {searchTerm || dateFilter
              ? 'No records match your filters. Try clearing your search or date selection.'
              : 'Daily logs submitted by site supervisors will appear here.'}
          </p>
        </motion.div>
      ) : (
        <div className="w-full">
          {viewMode === 'grid' && (
            <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLogs.map((log: DailyLog) => (
                <LogCard key={log.id} log={log} />
              ))}
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div variants={container} className="flex flex-col gap-3">
              {filteredLogs.map((log: DailyLog) => (
                <LogListItem key={log.id} log={log} />
              ))}
            </motion.div>
          )}

          {viewMode === 'timeline' && (
            <motion.div
              variants={container}
              className="relative border-l border-[#E6E9E7] dark:border-white/[0.08] ml-4 py-2 flex flex-col gap-6 max-w-3xl"
            >
              {filteredLogs.map((log: DailyLog) => (
                <LogTimelineItem key={log.id} log={log} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function LogCard({ log }: { log: DailyLog }) {
  return (
    <motion.div variants={fade}>
      <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] hover:shadow-[0_4px_12px_rgba(16,24,20,0.08)] transition-all flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02] flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#079B68] bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] px-2 py-0.5 rounded-[5px]">
            PRJ: {log.project_id.substring(0, 8)}
          </span>
          <div className="flex items-center text-[11px] font-medium text-[#929994]">
            <Calendar size={12} className="mr-1.5 text-[#929994]" />
            {new Date(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex-1">
          <p className="text-xs text-[#171A18] dark:text-[#EFF1F0] leading-relaxed whitespace-pre-wrap">
            {log.progress_update || <span className="italic text-[#929994]">No progress update recorded.</span>}
          </p>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between text-xs">
          {log.photo_link ? (
            <a
              href={log.photo_link}
              target="_blank"
              rel="noreferrer"
              className="text-[#2563EB] hover:underline flex items-center text-xs font-medium"
            >
              <ImageIcon size={13} className="mr-1.5" />
              View Site Photo
            </a>
          ) : (
            <span className="text-[11px] text-[#929994] flex items-center">
              <ImageIcon size={12} className="mr-1.5 opacity-60" /> No Photo
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LogListItem({ log }: { log: DailyLog }) {
  return (
    <motion.div variants={fade}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] p-4 rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] hover:bg-[#F9FAF9] dark:hover:bg-white/[0.02] transition-colors">
        <div className="shrink-0 sm:w-44">
          <span className="block text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
            {new Date(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[10px] uppercase font-semibold text-[#079B68]">PRJ: {log.project_id.substring(0, 8)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#626A66] dark:text-[#9BA49E] line-clamp-2 leading-relaxed">
            {log.progress_update || 'No progress update.'}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {log.photo_link ? (
            <a
              href={log.photo_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-xs font-medium text-[#2563EB] hover:underline px-2.5 py-1 rounded-[6px] bg-[#EBF2FF]"
            >
              <ImageIcon size={13} className="mr-1.5" />
              Photo
            </a>
          ) : (
            <span className="text-[11px] text-[#929994]">No Attachment</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LogTimelineItem({ log }: { log: DailyLog }) {
  return (
    <motion.div variants={fade} className="relative pl-6">
      <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-[#079B68] ring-4 ring-white dark:ring-[#141615]" />
      <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] p-4 rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] flex items-center gap-1.5">
            <Calendar size={13} className="text-[#079B68]" />
            {new Date(log.log_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[10px] font-semibold text-[#079B68] bg-[#E7F5EF] px-2 py-0.5 rounded-[5px] uppercase">
            PRJ: {log.project_id.substring(0, 8)}
          </span>
        </div>
        <p className="text-xs text-[#626A66] dark:text-[#9BA49E] leading-relaxed whitespace-pre-wrap mb-2">
          {log.progress_update}
        </p>
        {log.photo_link && (
          <a
            href={log.photo_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs font-medium text-[#2563EB] hover:underline"
          >
            <ImageIcon size={13} className="mr-1.5" /> View Photo Evidence
          </a>
        )}
      </div>
    </motion.div>
  );
}

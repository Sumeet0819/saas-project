'use client';

import React, { useState } from 'react';
import { DailyLog } from '../../types';
import { Calendar, Image as ImageIcon, Plus, Search, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface ProjectDprTabProps {
  logs: DailyLog[];
  onOpenDprModal: () => void;
}

export function ProjectDprTab({ logs, onOpenDprModal }: ProjectDprTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch = log.progress_update?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = dateFilter ? new Date(log.log_date).toISOString().split('T')[0] === dateFilter : true;
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());

  const inputCls =
    'h-9 text-xs bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors';

  return (
    <div className="space-y-4">
      {/* Controls & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" />
            <Input
              placeholder="Search DPR progress narratives…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 ${inputCls}`}
            />
          </div>
          <div className="w-36">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={inputCls}
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-[#929994] hover:text-[#171A18] underline cursor-pointer shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        <Button
          onClick={onOpenDprModal}
          className="h-9 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors shrink-0"
        >
          <Plus size={14} strokeWidth={2.25} /> New DPR
        </Button>
      </div>

      {/* DPR Feed */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-[10px] bg-[#E7F5EF] flex items-center justify-center mx-auto mb-3">
            <ClipboardList size={22} className="text-[#079B68]" />
          </div>
          <h4 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">No Daily Reports Found</h4>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-4">
            {searchTerm || dateFilter
              ? 'No DPRs match your search or date filter. Try clearing filters.'
              : 'Start logging daily site progress, weather impact, and activity summaries.'}
          </p>
          <Button
            onClick={onOpenDprModal}
            className="h-8 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] cursor-pointer"
          >
            Create First Daily Log
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const formattedDate = new Date(log.log_date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-[0_1px_3px_rgba(16,24,20,0.04)] hover:border-[#079B68]/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E9E7] dark:border-white/[0.07] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[6px] bg-[#E7F5EF] flex items-center justify-center">
                      <Calendar size={13} className="text-[#079B68]" />
                    </div>
                    <span className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                      {formattedDate}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#929994]">
                    Submitted {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs text-[#171A18] dark:text-[#EFF1F0] leading-relaxed whitespace-pre-wrap">
                      {log.progress_update || 'No detailed narrative entered.'}
                    </p>
                  </div>

                  {log.photo_link && (
                    <div className="shrink-0 w-full md:w-48 h-32 rounded-[8px] overflow-hidden border border-[#E6E9E7] dark:border-white/[0.08] relative group">
                      <img
                        src={log.photo_link}
                        alt="Daily progress"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <a
                        href={log.photo_link}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1"
                      >
                        <ImageIcon size={14} /> View Photo
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

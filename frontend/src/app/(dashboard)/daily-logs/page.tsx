'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Image as ImageIcon, Search, LayoutGrid, List, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetDailyLogsQuery } from '../../../store/api/logsApi';
import { DailyLog } from '../../../types';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function DailyLogsPage() {
  const { data: logs, isLoading, error } = useGetDailyLogsQuery({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch = log.progress_update?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? new Date(log.log_date).toISOString().split('T')[0] === dateFilter : true;
    return matchesSearch && matchesDate;
  }).sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()) || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Daily Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track daily progress and updates across all sites.</p>
        </div>
        <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          New Log
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search updates..."
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl w-full focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Input
              type="date"
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus-visible:ring-primary/20"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 w-full md:w-auto justify-center">
          <button 
            onClick={() => setViewMode('grid')}
            className={clsx("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}
            title="Grid View"
          ><LayoutGrid size={18} /></button>
          <button 
            onClick={() => setViewMode('list')}
            className={clsx("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}
            title="List View"
          ><List size={18} /></button>
          <button 
            onClick={() => setViewMode('timeline')}
            className={clsx("p-2 rounded-lg transition-all", viewMode === 'timeline' ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-gray-500 hover:text-gray-900 dark:hover:text-white")}
            title="Timeline View"
          ><Clock size={18} /></button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <ConstructionLoader size="md" />
        </div>
      ) : error ? (
        <div className="text-destructive p-4 text-center bg-destructive/10 rounded-xl max-w-md mx-auto mt-12 border border-destructive/20">
          <p className="font-bold">Failed to load logs.</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 mt-4">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Calendar className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No logs found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or date filters.</p>
        </div>
      ) : (
        <div className="w-full mt-2">
          {viewMode === 'grid' && (
            <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLogs.map((log: DailyLog) => (
                <LogCard key={log.id} log={log} />
              ))}
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="flex flex-col gap-4">
              {filteredLogs.map((log: DailyLog) => (
                <LogListItem key={log.id} log={log} />
              ))}
            </motion.div>
          )}

          {viewMode === 'timeline' && (
            <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-4 py-4 flex flex-col gap-8 max-w-4xl mx-auto w-full">
              {filteredLogs.map((log: DailyLog) => (
                <LogTimelineItem key={log.id} log={log} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

function LogCard({ log }: { log: DailyLog }) {
  return (
    <Card className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all">
      <CardContent className="p-5 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black tracking-wider uppercase text-primary/80 bg-primary/10 px-2.5 py-1 rounded-md">
                PRJ: {log.project_id.substring(0, 8)}
              </span>
              <div className="flex items-center text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded border border-gray-100 dark:border-gray-800">
                <Calendar size={12} className="mr-1.5 text-gray-400" />
                {new Date(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 grow leading-relaxed">
          {log.progress_update || <span className="italic text-gray-400">No progress update provided.</span>}
        </p>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          {log.photo_link ? (
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 h-8">
              <ImageIcon size={14} className="mr-2" />
              View Photo
            </Button>
          ) : (
            <span className="text-xs text-gray-400 flex items-center font-medium">
              <ImageIcon size={12} className="mr-1.5 opacity-50" /> No photos attached
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LogListItem({ log }: { log: DailyLog }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm items-start md:items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="shrink-0 w-40">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {new Date(log.log_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[10px] uppercase text-gray-500 font-bold mt-0.5 tracking-wider">PRJ: {log.project_id.substring(0,8)}</span>
        </div>
      </div>
      <div className="grow">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed">{log.progress_update}</p>
      </div>
      <div className="shrink-0 min-w-[120px] text-right">
        {log.photo_link ? (
          <Button variant="secondary" size="sm" className="h-8 w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">
            <ImageIcon size={14} className="mr-2" />
            View Photo
          </Button>
        ) : (
          <span className="text-xs text-gray-400 font-medium">No Attachment</span>
        )}
      </div>
    </div>
  );
}

function LogTimelineItem({ log }: { log: DailyLog }) {
  return (
    <div className="relative pl-8 md:pl-12">
      <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-white dark:ring-gray-950"></div>
      <div className="flex flex-col gap-3 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar size={14} className="mr-2 text-primary" />
            {new Date(log.log_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[10px] font-black text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
            PRJ: {log.project_id.substring(0,8)}
          </span>
        </div>
        <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {log.progress_update}
        </p>
        {log.photo_link && (
          <div className="mt-2">
             <Button variant="outline" size="sm" className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50">
              <ImageIcon size={14} className="mr-2" />
              View Attached Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

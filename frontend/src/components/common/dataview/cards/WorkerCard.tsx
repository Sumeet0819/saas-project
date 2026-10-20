'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HardHat, Phone, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import { Worker } from '../../../../types';

interface WorkerCardProps {
  worker: Worker;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/workers/${worker.id}`)}
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] hover:shadow-[0_4px_12px_rgba(16,24,20,0.08)] transition-all flex flex-col h-full cursor-pointer overflow-hidden group"
    >
      {/* Top Header */}
      <div className="p-4 border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-full flex items-center justify-center shrink-0 border border-[#079B68]/15">
            <HardHat size={16} className="text-[#079B68]" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors truncate">
              {worker.worker_name}
            </h3>
            {worker.contractor_name ? (
              <span className="block text-[10px] text-[#929994] truncate">via {worker.contractor_name}</span>
            ) : (
              <span className="block text-[10px] text-[#929994]">Direct Staff</span>
            )}
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
            worker.is_active ? 'bg-[#E7F5EF] text-[#079B68]' : 'bg-[#F9EDEF] text-[#B85B63]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${worker.is_active ? 'bg-[#079B68]' : 'bg-[#B85B63]'}`} />
          {worker.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-xs text-[#626A66] dark:text-[#9BA49E]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#929994]">Trade Role:</span>
            <span className="inline-flex px-2 py-0.5 rounded-[5px] bg-[#F5F6F5] dark:bg-white/[0.04] text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] border border-[#E6E9E7] dark:border-white/[0.08]">
              {worker.trade}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#929994]">Daily Wage:</span>
            <span className="font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              {worker.daily_wage ? `Rs. ${worker.daily_wage.toLocaleString()}` : 'Not set'}
            </span>
          </div>

          {worker.phone && (
            <div className="flex items-center gap-1.5 pt-1">
              <Phone size={12} className="text-[#929994] shrink-0" />
              <span>{worker.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between text-[11px] text-[#929994] bg-[#F9FAF9] dark:bg-white/[0.02]">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {worker.joining_date
            ? new Date(worker.joining_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Unknown date'}
        </span>
        <span className="text-[#079B68] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          View <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}

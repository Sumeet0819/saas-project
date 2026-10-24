'use client';

import React from 'react';
import { Worker } from '../../types';
import { Users, HardHat, Mail, Phone, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProjectMember {
  id: string;
  project_id: string;
  designation: string;
  assigned_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    phone?: string;
    profile_photo?: string;
  };
}

interface ProjectTeamTabProps {
  members: ProjectMember[];
  workers: Worker[];
}

export function ProjectTeamTab({ members, workers }: ProjectTeamTabProps) {
  const router = useRouter();

  // Group workers by trade
  const tradeGroups = workers.reduce<Record<string, number>>((acc, w) => {
    const trade = w.trade || 'General Labour';
    acc[trade] = (acc[trade] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* ── Project Supervision & Staff ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">Project Supervisory Team</h3>
            <p className="text-xs text-[#929994] mt-0.5">Managers, site engineers, and supervisors assigned to this project</p>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] py-10 px-4 text-center">
            <div className="w-10 h-10 rounded-[8px] bg-[#E7F5EF] flex items-center justify-center mx-auto mb-2.5">
              <Users size={18} className="text-[#079B68]" />
            </div>
            <p className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">No Members Explicitly Assigned</p>
            <p className="text-[11px] text-[#929994] max-w-xs mx-auto mt-0.5">
              Administrators and site managers maintain full supervisory access to this site.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {members.map((m) => {
              const u = m.user;
              const initials = u?.full_name
                ? u.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'AU';

              return (
                <div
                  key={m.id}
                  className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-sm flex items-start gap-3"
                >
                  {u?.profile_photo ? (
                    <img
                      src={u.profile_photo}
                      alt={u.full_name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-[#079B68]/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#079B68]">{initials}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] truncate">
                        {u?.full_name || 'Staff Member'}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#079B68] bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] px-2 py-0.5 rounded-full shrink-0">
                        {m.designation || u?.role || 'Staff'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#929994] flex items-center gap-1 mt-1 truncate">
                      <Mail size={11} className="shrink-0" /> {u?.email || 'No email registered'}
                    </p>

                    {u?.phone && (
                      <p className="text-[11px] text-[#929994] flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="shrink-0" /> {u.phone}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Workforce & Trade Breakdown ── */}
      <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">Available Site Workforce</h3>
            <p className="text-xs text-[#929994] mt-0.5">Trade allocation of registered workers in the active organization</p>
          </div>
          <Button
            onClick={() => router.push('/workers')}
            variant="outline"
            className="h-8 px-3 text-xs font-semibold border-[#E6E9E7] dark:border-white/[0.08] rounded-[7px] gap-1 cursor-pointer"
          >
            Muster Roll <ArrowUpRight size={13} />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(tradeGroups).map(([trade, count]) => (
            <div
              key={trade}
              className="p-3 rounded-[8px] bg-[#F9FAF9] dark:bg-white/[0.02] border border-[#E6E9E7] dark:border-white/[0.06] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[6px] bg-[#E7F5EF] flex items-center justify-center">
                  <HardHat size={14} className="text-[#079B68]" />
                </div>
                <span className="text-xs font-medium text-[#171A18] dark:text-[#EFF1F0]">{trade}</span>
              </div>
              <span className="text-sm font-bold text-[#079B68]">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

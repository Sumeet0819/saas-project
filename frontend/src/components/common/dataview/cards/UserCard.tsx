'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Mail, Phone, Calendar, ArrowUpRight, Shield } from 'lucide-react';
import { User } from '../../../../types';

const ROLE_CONFIG: Record<string, { bg: string; text: string }> = {
  Admin:             { bg: '#F3EFFE', text: '#7C4DFF' },
  'Project Manager': { bg: '#EBF2FF', text: '#2563EB' },
  'Site Engineer':   { bg: '#E7F5EF', text: '#079B68' },
  Contractor:        { bg: '#FEF9EC', text: '#D5A04A' },
  Supplier:          { bg: '#F9EDEF', text: '#B85B63' },
};

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const roleCfg = ROLE_CONFIG[user.role] || { bg: '#F5F6F5', text: '#929994' };

  return (
    <div
      onClick={() => router.push(`/users/${user.id}`)}
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] hover:shadow-[0_4px_12px_rgba(16,24,20,0.08)] transition-all flex flex-col h-full cursor-pointer overflow-hidden group"
    >
      {/* Top Header */}
      <div className="p-4 border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center shrink-0 overflow-hidden border border-[#079B68]/15">
            {user.profile_photo ? (
              <img src={user.profile_photo} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-xs text-[#079B68]">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors truncate">
              {user.full_name}
            </h3>
            <span className="block text-[10px] text-[#929994]">ID: {user.id.slice(0, 8)}</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
            user.is_active ? 'bg-[#E7F5EF] text-[#079B68]' : 'bg-[#F9EDEF] text-[#B85B63]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-[#079B68]' : 'bg-[#B85B63]'}`} />
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-xs text-[#626A66] dark:text-[#9BA49E]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#929994]">System Role:</span>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ background: roleCfg.bg, color: roleCfg.text }}
            >
              <Shield size={10} />
              {user.role}
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate pt-1">
            <Mail size={12} className="text-[#929994] shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-[#929994] shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between text-[11px] text-[#929994] bg-[#F9FAF9] dark:bg-white/[0.02]">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-[#079B68] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          View <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}

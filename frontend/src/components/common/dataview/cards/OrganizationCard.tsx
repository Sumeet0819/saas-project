'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Phone, Mail, ShieldCheck, ArrowUpRight, Calendar } from 'lucide-react';
import { Organization } from '../../../../types';

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/organizations/${organization.id}`)}
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] hover:shadow-[0_4px_12px_rgba(16,24,20,0.08)] transition-all flex flex-col h-full cursor-pointer overflow-hidden group"
    >
      {/* Top Header */}
      <div className="p-4 border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-[8px] flex items-center justify-center shrink-0 border border-[#079B68]/15">
            {organization.logo ? (
              <img src={organization.logo} alt={organization.name} className="w-full h-full object-cover rounded-[8px]" />
            ) : (
              <Building2 size={16} className="text-[#079B68]" strokeWidth={1.75} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors truncate">
              {organization.name}
            </h3>
            <span className="block text-[10px] text-[#929994]">ID: {organization.id.slice(0, 8)}</span>
          </div>
        </div>

        {organization.gst_number && (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[5px] bg-[#E7F5EF] text-[#079B68] font-semibold shrink-0">
            <ShieldCheck size={11} />
            GST
          </span>
        )}
      </div>

      {/* Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-xs text-[#626A66] dark:text-[#9BA49E]">
        <div className="space-y-2">
          {organization.email && (
            <div className="flex items-center gap-1.5 truncate">
              <Mail size={12} className="text-[#929994] shrink-0" />
              <span className="truncate">{organization.email}</span>
            </div>
          )}
          {organization.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={12} className="text-[#929994] shrink-0" />
              <span>{organization.phone}</span>
            </div>
          )}
          {organization.address && (
            <div className="flex items-center gap-1.5 truncate" title={organization.address}>
              <MapPin size={12} className="text-[#929994] shrink-0" />
              <span className="truncate">{organization.address}</span>
            </div>
          )}
        </div>

        {organization.gst_number && (
          <div className="pt-2 border-t border-[#E6E9E7] dark:border-white/[0.07] text-[11px]">
            <span className="text-[#929994]">GSTIN: </span>
            <span className="font-mono text-[#171A18] dark:text-[#EFF1F0]">{organization.gst_number}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between text-[11px] text-[#929994] bg-[#F9FAF9] dark:bg-white/[0.02]">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(organization.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-[#079B68] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          View <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Building2, MapPin, Phone, Mail, ShieldCheck, Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchOrganizations } from '../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Organization } from '../../../types';
import { DataView, DataTable, DataGrid, OrganizationCard, Column } from '@/components/common/dataview';

export default function OrganizationsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { organizations, status, error } = useSelector((state: RootState) => state.organizations);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [status, dispatch]);

  const filteredOrgs = useMemo(() => {
    return (organizations || []).filter(
      (org) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.gst_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [organizations, searchTerm]);

  const columns: Column<Organization>[] = [
    {
      key: 'org',
      header: 'Organization',
      render: (org) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-[8px] flex items-center justify-center shrink-0 border border-[#079B68]/15">
            {org.logo ? (
              <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-[8px]" />
            ) : (
              <Building2 size={16} className="text-[#079B68]" strokeWidth={1.75} />
            )}
          </div>
          <div>
            <span className="font-semibold text-sm text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
              {org.name}
            </span>
            <span className="block text-[11px] text-[#929994]">ID: {org.id.slice(0, 8)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (org) => (
        <div className="flex flex-col gap-0.5 text-xs text-[#626A66] dark:text-[#9BA49E]">
          {org.email ? (
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-[#929994]" /> {org.email}
            </span>
          ) : (
            <span className="text-[#929994] italic text-[11px]">No email</span>
          )}
          {org.phone && (
            <span className="flex items-center gap-1.5 text-[#929994]">
              <Phone size={12} /> {org.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (org) =>
        org.address ? (
          <div className="flex items-center gap-1.5 max-w-[220px] truncate text-xs text-[#626A66] dark:text-[#9BA49E]" title={org.address}>
            <MapPin size={13} className="text-[#929994] shrink-0" />
            <span className="truncate">{org.address}</span>
          </div>
        ) : (
          <span className="text-[#929994] italic text-[11px]">No address</span>
        ),
    },
    {
      key: 'gst',
      header: 'GST Number',
      render: (org) =>
        org.gst_number ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-[5px] bg-[#F5F6F5] dark:bg-white/[0.04] text-[#171A18] dark:text-[#EFF1F0] border border-[#E6E9E7] dark:border-white/[0.08]">
            <ShieldCheck size={11} className="text-[#079B68]" />
            {org.gst_number}
          </span>
        ) : (
          <span className="text-[#929994] text-[11px]">&mdash;</span>
        ),
    },
    {
      key: 'created',
      header: 'Created',
      render: (org) => (
        <span className="text-xs text-[#929994] whitespace-nowrap flex items-center gap-1.5">
          <Calendar size={12} />
          {new Date(org.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: () => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] text-[#929994] group-hover:text-[#079B68] group-hover:bg-[#E7F5EF] dark:group-hover:bg-[rgba(7,155,104,0.15)] transition-colors">
          <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      ),
    },
  ];

  return (
    <DataView
      title="Organizations"
      subtitle={`${(organizations || []).length} registered enterprise and client entities`}
      action={
        <Button
          onClick={() => router.push('/organizations/new')}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] shadow-sm gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={15} strokeWidth={2.25} />
          New Organization
        </Button>
      }
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search organizations by name, GST, address…"
      isLoading={status === 'loading'}
      error={error}
      onRetry={() => dispatch(fetchOrganizations())}
      isEmpty={filteredOrgs.length === 0}
      emptyIcon={Building2}
      emptyTitle="No organizations found"
      emptyDescription={
        searchTerm
          ? `No results match "${searchTerm}". Try a different keyword.`
          : 'Get started by creating your first client or vendor organization.'
      }
      emptyActionText={searchTerm ? 'Clear Search' : 'New Organization'}
      onEmptyAction={() => {
        if (searchTerm) {
          setSearchTerm('');
        } else {
          router.push('/organizations/new');
        }
      }}
      tableView={
        <DataTable
          columns={columns}
          data={filteredOrgs}
          keyExtractor={(org) => org.id}
          onRowClick={(org) => router.push(`/organizations/${org.id}`)}
        />
      }
      gridView={
        <DataGrid
          data={filteredOrgs}
          keyExtractor={(org) => org.id}
          renderItem={(org) => <OrganizationCard organization={org} />}
        />
      }
    />
  );
}

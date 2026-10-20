'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, HardHat, Phone, Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchWorkers } from '../../../store/slices/workersSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Worker } from '../../../types';
import { DataView, DataTable, DataGrid, WorkerCard, Column } from '@/components/common/dataview';

export default function WorkersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { workers, status, error } = useSelector((state: RootState) => state.workers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWorkers());
    }
  }, [status, dispatch]);

  const filteredWorkers = useMemo(() => {
    return (workers || []).filter((w) => {
      const matchSearch =
        w.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.contractor_name && w.contractor_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        activeStatusFilter === 'All'
          ? true
          : activeStatusFilter === 'Active'
          ? w.is_active
          : !w.is_active;

      return matchSearch && matchStatus;
    });
  }, [workers, searchTerm, activeStatusFilter]);

  const filterTabs = useMemo(() => {
    const total = (workers || []).length;
    const active = (workers || []).filter((w) => w.is_active).length;
    const inactive = total - active;

    return [
      { key: 'All', label: 'All Workers', count: total },
      { key: 'Active', label: 'Active', count: active },
      { key: 'Inactive', label: 'Inactive', count: inactive },
    ];
  }, [workers]);

  const columns: Column<Worker>[] = [
    {
      key: 'worker',
      header: 'Worker Name',
      render: (w) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-full flex items-center justify-center shrink-0 border border-[#079B68]/15">
            <HardHat size={16} className="text-[#079B68]" strokeWidth={1.75} />
          </div>
          <div>
            <span className="font-semibold text-sm text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
              {w.worker_name}
            </span>
            {w.contractor_name && (
              <span className="block text-[11px] text-[#929994]">via {w.contractor_name}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'trade',
      header: 'Trade',
      render: (w) => (
        <span className="inline-flex px-2 py-0.5 rounded-[5px] bg-[#F5F6F5] dark:bg-white/[0.04] text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] border border-[#E6E9E7] dark:border-white/[0.08]">
          {w.trade}
        </span>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (w) =>
        w.phone ? (
          <span className="flex items-center gap-1.5 text-xs text-[#626A66] dark:text-[#9BA49E]">
            <Phone size={12} className="text-[#929994]" /> {w.phone}
          </span>
        ) : (
          <span className="text-[#929994] italic text-[11px]">No phone</span>
        ),
    },
    {
      key: 'wage',
      header: 'Daily Wage',
      render: (w) => (
        <span className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">
          {w.daily_wage ? `Rs. ${w.daily_wage.toLocaleString()}` : <span className="text-[#929994] font-normal">&mdash;</span>}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (w) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            w.is_active ? 'bg-[#E7F5EF] text-[#079B68]' : 'bg-[#F9EDEF] text-[#B85B63]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${w.is_active ? 'bg-[#079B68]' : 'bg-[#B85B63]'}`} />
          {w.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (w) => (
        <span className="text-xs text-[#929994] whitespace-nowrap flex items-center gap-1.5">
          <Calendar size={12} />
          {w.joining_date
            ? new Date(w.joining_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '-'}
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
      title="Site Workers"
      subtitle={`${(workers || []).length} registered field workforce and trade specialists`}
      action={
        <Button
          onClick={() => router.push('/workers/new')}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] shadow-sm gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={15} strokeWidth={2.25} />
          New Worker
        </Button>
      }
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search workers by name, trade, contractor…"
      filterTabs={filterTabs}
      activeFilterTab={activeStatusFilter}
      onFilterTabChange={(key) => setActiveStatusFilter(key as any)}
      isLoading={status === 'loading'}
      error={error}
      onRetry={() => dispatch(fetchWorkers())}
      isEmpty={filteredWorkers.length === 0}
      emptyIcon={HardHat}
      emptyTitle="No workers found"
      emptyDescription={
        searchTerm || activeStatusFilter !== 'All'
          ? 'No workers match your search and filter criteria.'
          : 'Add your site laborers, masons, carpenters, and technicians to monitor daily attendance and wages.'
      }
      emptyActionText={searchTerm || activeStatusFilter !== 'All' ? 'Reset Filters' : 'New Worker'}
      onEmptyAction={() => {
        if (searchTerm || activeStatusFilter !== 'All') {
          setSearchTerm('');
          setActiveStatusFilter('All');
        } else {
          router.push('/workers/new');
        }
      }}
      tableView={
        <DataTable
          columns={columns}
          data={filteredWorkers}
          keyExtractor={(w) => w.id}
          onRowClick={(w) => router.push(`/workers/${w.id}`)}
        />
      }
      gridView={
        <DataGrid
          data={filteredWorkers}
          keyExtractor={(w) => w.id}
          renderItem={(w) => <WorkerCard worker={w} />}
        />
      }
    />
  );
}

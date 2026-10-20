'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Building, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Project } from '../../../types';
import { DataView, DataTable, DataGrid, ProjectCard, Column } from '@/components/common/dataview';

const ALL_STATUSES = ['All', 'Active', 'Planning', 'On Hold', 'Delayed', 'Completed'];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  Planning: { bg: '#EBF2FF', text: '#2563EB', dot: '#2563EB' },
  Active:   { bg: '#E7F5EF', text: '#079B68', dot: '#079B68' },
  'On Hold':{ bg: '#FEF9EC', text: '#D5A04A', dot: '#D5A04A' },
  Delayed:  { bg: '#F9EDEF', text: '#B85B63', dot: '#B85B63' },
  Completed:{ bg: '#F3EFFE', text: '#7C4DFF', dot: '#7C4DFF' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { bg: '#F5F6F5', text: '#929994', dot: '#929994' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {status || 'Planning'}
    </span>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { projects, status, error } = useSelector((state: RootState) => state.projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProjects());
  }, [status, dispatch]);

  const filtered = useMemo(() => {
    return (projects || []).filter((p) => {
      const matchSearch =
        p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.project_code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = activeStatus === 'All' || p.status === activeStatus;
      return matchSearch && matchStatus;
    });
  }, [projects, searchTerm, activeStatus]);

  const counts = useMemo(() => {
    return ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
      acc[s] = s === 'All' ? (projects || []).length : (projects || []).filter((p) => p.status === s).length;
      return acc;
    }, {});
  }, [projects]);

  const filterTabs = useMemo(() => {
    return ALL_STATUSES.map((s) => ({
      key: s,
      label: s,
      count: counts[s] ?? 0,
    }));
  }, [counts]);

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project Name',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[7px] bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center shrink-0">
            <Building size={15} className="text-[#079B68]" strokeWidth={1.75} />
          </div>
          <div>
            <span className="font-semibold text-sm text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
              {p.project_name}
            </span>
            <span className="block text-[11px] text-[#929994]">{p.project_code} &bull; {p.project_type}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client & Site',
      render: (p) => (
        <div className="flex flex-col gap-0.5 text-xs text-[#626A66] dark:text-[#9BA49E]">
          <span className="font-medium text-[#171A18] dark:text-[#EFF1F0]">{p.client_name || '-'}</span>
          {p.site_address && (
            <span className="flex items-center gap-1 text-[#929994] max-w-[200px] truncate">
              <MapPin size={10} className="shrink-0" /> {p.site_address}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (p) => (
        <span className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">
          {p.budget ? `Rs. ${p.budget.toLocaleString()}` : <span className="text-[#929994] font-normal">&mdash;</span>}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: (p) => (
        <span className="text-xs text-[#929994] whitespace-nowrap flex items-center gap-1.5">
          <Calendar size={12} />
          {p.start_date
            ? new Date(p.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      title="Projects"
      subtitle={`${(projects || []).length} active, planning, and completed sites`}
      action={
        <Button
          onClick={() => router.push('/projects/new')}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] shadow-sm gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={15} strokeWidth={2.25} />
          New Project
        </Button>
      }
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search projects by name or code…"
      filterTabs={filterTabs}
      activeFilterTab={activeStatus}
      onFilterTabChange={setActiveStatus}
      isLoading={status === 'loading'}
      error={error}
      onRetry={() => dispatch(fetchProjects())}
      isEmpty={filtered.length === 0}
      emptyIcon={Building}
      emptyTitle="No projects found"
      emptyDescription={
        searchTerm || activeStatus !== 'All'
          ? 'No projects match your current filter criteria. Try resetting your search or status.'
          : 'Create your first construction project to track schedules, budgets, and logs.'
      }
      emptyActionText={searchTerm || activeStatus !== 'All' ? 'Reset Filters' : 'New Project'}
      onEmptyAction={() => {
        if (searchTerm || activeStatus !== 'All') {
          setSearchTerm('');
          setActiveStatus('All');
        } else {
          router.push('/projects/new');
        }
      }}
      tableView={
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => router.push(`/projects/${p.id}`)}
        />
      }
      gridView={
        <DataGrid
          data={filtered}
          keyExtractor={(p) => p.id}
          renderItem={(p) => <ProjectCard project={p} />}
        />
      }
    />
  );
}

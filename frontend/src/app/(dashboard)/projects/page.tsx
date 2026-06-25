'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, MapPin, Calendar, LayoutGrid, List as ListIcon, Kanban as KanbanIcon, DollarSign, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetProjectsQuery } from '../../../store/api/projectsApi';
import { Project, ProjectStatus } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type ViewMode = 'grid' | 'list' | 'kanban';

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projects, isLoading, error } = useGetProjectsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredProjects = projects?.filter((p) =>
    p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-primary/10 text-primary border-primary/20';
      case 'Planning': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'On Hold': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Delayed': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString();
  };

  // --- Components ---

  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -5 }}
        className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all cursor-pointer h-full"
        onClick={() => router.push(`/projects/${project.id}`)}
      >
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{project.project_type}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-primary transition-colors">{project.project_name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{project.project_code}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${getStatusClass(project.status)}`}>
              {project.status}
            </span>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                 <User size={14} className="text-primary" />
              </div>
              <span className="line-clamp-1 font-medium text-gray-700 dark:text-gray-300">{project.client_name || 'No Client Assigned'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-blue-500" />
              </div>
              <span className="line-clamp-1 font-medium text-gray-700 dark:text-gray-300">{project.site_address || 'Address not set'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign size={14} className="text-emerald-500" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(project.budget || project.estimated_cost)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Start Date</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Calendar size={12} className="text-gray-400" />
              {formatDate(project.start_date)}
            </span>
          </div>
          <div className="flex flex-col text-right items-end">
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Target Date</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Calendar size={12} className="text-gray-400" />
              {formatDate(project.expected_completion_date)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const ListView = () => (
    <div className="w-full overflow-x-auto bg-white dark:bg-card rounded-2xl border border-border shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-gray-50/50 dark:bg-gray-900/50 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <th className="p-4 font-semibold">Project</th>
            <th className="p-4 font-semibold">Client</th>
            <th className="p-4 font-semibold">Location</th>
            <th className="p-4 font-semibold">Budget</th>
            <th className="p-4 font-semibold">Timeline</th>
            <th className="p-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-border">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.tr 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="group cursor-pointer hover:bg-primary/5 transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">{project.project_name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{project.project_code} • {project.project_type}</div>
                </td>
                <td className="p-4 text-foreground">
                  <div className="flex items-center gap-1.5"><User size={14} className="text-muted-foreground" /> {project.client_name || '-'}</div>
                </td>
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5 line-clamp-1"><MapPin size={14} /> {project.site_address || '-'}</div>
                </td>
                <td className="p-4 font-semibold text-foreground">
                  {formatCurrency(project.budget || project.estimated_cost)}
                </td>
                <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                  <div>{formatDate(project.start_date)} -</div>
                  <div>{formatDate(project.expected_completion_date)}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-block ${getStatusClass(project.status)}`}>
                    {project.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );

  const KanbanView = () => {
    const statuses: ProjectStatus[] = ['Planning', 'Active', 'On Hold', 'Delayed', 'Completed'];
    
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-240px)] items-start">
        {statuses.map(status => {
          const colProjects = filteredProjects.filter(p => p.status === status);
          return (
            <div key={status} className="flex flex-col min-w-[320px] w-[320px] max-h-full bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-border p-3">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">{status}</h3>
                <span className="bg-white dark:bg-card text-foreground text-xs font-bold px-2 py-0.5 rounded-full border border-border shadow-sm">
                  {colProjects.length}
                </span>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-2">
                <AnimatePresence>
                  {colProjects.map(project => (
                    <div key={project.id}>
                       <ProjectCard project={project} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <Button onClick={() => router.push('/projects/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-white dark:bg-card border-border"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-white dark:bg-card border border-border rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              "p-2 rounded-md transition-all flex items-center justify-center",
              viewMode === 'grid' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              "p-2 rounded-md transition-all flex items-center justify-center",
              viewMode === 'list' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="List View"
          >
            <ListIcon size={18} />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={clsx(
              "p-2 rounded-md transition-all flex items-center justify-center",
              viewMode === 'kanban' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            title="Kanban View"
          >
            <KanbanIcon size={18} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-destructive p-4 text-center">
          Failed to load projects. Please try again.
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border">
          No projects found matching your search.
        </div>
      ) : (
        <div className="mt-2">
          {viewMode === 'grid' && (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project: Project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          
          {viewMode === 'list' && <ListView />}
          
          {viewMode === 'kanban' && <KanbanView />}
        </div>
      )}
    </div>
  );
}

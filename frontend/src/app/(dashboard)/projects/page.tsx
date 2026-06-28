'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Building, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { projects, status, error } = useSelector((state: RootState) => state.projects);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  const filteredProjects = projects?.filter((p) =>
    p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project_code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (statusStr: string) => {
    switch (statusStr) {
      case 'Planning': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'On Hold': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Delayed': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Completed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
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

      <div className="flex items-center gap-4">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-white dark:bg-card border-border"
            placeholder="Search projects by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {status === 'loading' ? (
        <div className="flex justify-center p-24">
          <ConstructionLoader size="md" />
        </div>
      ) : status === 'failed' ? (
        <div className="text-destructive p-4 text-center">
          {error || 'Failed to load projects.'}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border">
          No projects found.
        </div>
      ) : (
        <div className="mt-2 w-full overflow-x-auto bg-white dark:bg-card rounded-2xl border border-border shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50 dark:bg-gray-900/50 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4 font-semibold">Project Name & Code</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Dates</th>
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          <Building size={18} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">{project.project_name}</div>
                          <div className="text-xs text-muted-foreground font-medium">{project.project_code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-foreground">
                      <span className="text-sm flex items-center gap-1.5 line-clamp-1"><MapPin size={12} className="text-muted-foreground shrink-0" /> {project.site_address || '-'}</span>
                    </td>
                    <td className="p-4">
                      {project.project_type}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(project.status || '')}`}>
                        {project.status || 'Planning'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5"><Calendar size={10}/> Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

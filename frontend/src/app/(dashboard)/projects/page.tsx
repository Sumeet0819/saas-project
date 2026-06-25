'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetProjectsQuery } from '../../../store/api/projectsApi';
import { Project } from '../../../types';

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projects, isLoading, error } = useGetProjectsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects?.filter((p) =>
    p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project_code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Planning': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Delayed': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
        <Button 
          onClick={() => router.push('/projects/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="max-w-md w-full relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
        </div>
      ) : error ? (
        <div className="text-[var(--status-danger)] p-4 text-center">
          Failed to load projects. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center p-12 text-gray-500">
              No projects found.
            </div>
          ) : (
            filteredProjects.map((project: Project) => (
              <Card 
                key={project.id} 
                className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{project.project_type}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClass(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-1">{project.project_name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                    <MapPin size={14} />
                    {project.site_address || 'Address not set'}
                  </div>

                  <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Code</span>
                      <span className="text-sm font-semibold text-gray-900">{project.project_code}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Start Date</span>
                      <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar size={12} />
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

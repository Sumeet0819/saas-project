'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Building, MapPin, Calendar, DollarSign, Building2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchProjectById } from '../../../../store/slices/projectsSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentProject: project, status: projectStatus, error } = useSelector((state: RootState) => state.projects);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  const org = organizations.find(o => o.id === project?.organization_id);

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

  if (projectStatus === 'loading') {
    return (
      <div className="flex justify-center p-12">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-destructive p-4 text-center">
        Failed to load project details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px] mx-auto w-full p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border-2 border-border shadow-sm">
              <Building size={32} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.project_name}</h1>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-flex items-center gap-1 ${getStatusColor(project.status || '')}`}>
                  {project.status || 'Planning'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Project Code: {project.project_code} • {project.project_type}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push(`/projects/${project.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Client & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Client Name</span>
                <span className="font-medium">{project.client_name || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Site Address</span>
                <span className="font-medium">{project.site_address || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Building className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Organization</span>
                <span className="font-medium">{org ? org.name : (project.organization_id ? 'Loading...' : 'N/A')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Financials & Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Budget</span>
                <span className="font-medium">{project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Start Date</span>
                <span className="font-medium">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Expected Completion</span>
                <span className="font-medium">{project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {project.description && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground whitespace-pre-wrap">{project.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

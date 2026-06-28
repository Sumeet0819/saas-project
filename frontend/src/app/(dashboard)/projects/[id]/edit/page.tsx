'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchProjectById, updateProject } from '../../../../../store/slices/projectsSlice';
import { fetchOrganizations } from '../../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../../store/store';
import { ProjectType, ProjectStatus } from '../../../../../types';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentProject: project, status: projectStatus } = useSelector((state: RootState) => state.projects);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  const [formData, setFormData] = useState({
    project_name: '',
    project_code: '',
    description: '',
    project_type: 'Residential' as ProjectType,
    client_name: '',
    client_phone: '',
    site_address: '',
    budget: '',
    estimated_cost: '',
    start_date: '',
    expected_completion_date: '',
    actual_completion_date: '',
    status: 'Planning' as ProjectStatus,
    organization_id: '',
  });

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  useEffect(() => {
    if (project) {
      setFormData({
        project_name: project.project_name || '',
        project_code: project.project_code || '',
        description: project.description || '',
        project_type: project.project_type || 'Residential',
        client_name: project.client_name || '',
        client_phone: project.client_phone || '',
        site_address: project.site_address || '',
        budget: project.budget ? project.budget.toString() : '',
        estimated_cost: project.estimated_cost ? project.estimated_cost.toString() : '',
        start_date: project.start_date || '',
        expected_completion_date: project.expected_completion_date || '',
        actual_completion_date: project.actual_completion_date || '',
        status: project.status || 'Planning',
        organization_id: project.organization_id || '',
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : undefined,
      };
      await dispatch(updateProject({ id: projectId, body: payload as any })).unwrap();
      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  if (projectStatus === 'loading' && !project) {
    return (
      <div className="flex justify-center p-12">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px] mx-auto w-full p-4 md:p-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project_name">Project Name *</Label>
                <Input id="project_name" name="project_name" value={formData.project_name} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project_code">Project Code *</Label>
                <Input id="project_code" name="project_code" value={formData.project_code} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project_type">Project Type *</Label>
                <Select value={formData.project_type} onValueChange={(val) => setFormData(prev => ({ ...prev, project_type: val as ProjectType }))} required>
                  <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <SelectValue placeholder="Select Project Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Interior">Interior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="organization_id">Organization</Label>
                <Select value={formData.organization_id} onValueChange={(val) => setFormData(prev => ({ ...prev, organization_id: val || '' }))}>
                  <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <SelectValue placeholder="Select Organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations?.map((org) => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Client & Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input id="client_name" name="client_name" value={formData.client_name} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="client_phone">Client Phone</Label>
                <Input id="client_phone" name="client_phone" value={formData.client_phone} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="site_address">Site Address</Label>
                <Input id="site_address" name="site_address" value={formData.site_address} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Financials & Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input id="budget" name="budget" type="number" step="0.01" value={formData.budget} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="estimated_cost">Estimated Cost ($)</Label>
                <Input id="estimated_cost" name="estimated_cost" type="number" step="0.01" value={formData.estimated_cost} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" name="start_date" type="date" value={formData.start_date ? formData.start_date.split('T')[0] : ''} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="expected_completion_date">Expected Completion Date</Label>
                <Input id="expected_completion_date" name="expected_completion_date" type="date" value={formData.expected_completion_date ? formData.expected_completion_date.split('T')[0] : ''} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="actual_completion_date">Actual Completion Date</Label>
                <Input id="actual_completion_date" name="actual_completion_date" type="date" value={formData.actual_completion_date ? formData.actual_completion_date.split('T')[0] : ''} onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData(prev => ({ ...prev, status: val as ProjectStatus }))}>
                  <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={projectStatus === 'loading' || !formData.project_name || !formData.project_code}>
                {projectStatus === 'loading' ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, ArrowLeft, MapPin, Calendar, Building, DollarSign, Users, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetProjectByIdQuery } from '../../../../store/api/projectsApi';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: project, isLoading, error } = useGetProjectByIdQuery(id);
  const [activeTab, setActiveTab] = useState<'overview' | 'daily-logs' | 'materials'>('overview');

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-[var(--status-danger)] p-4 text-center">
        Failed to load project details. Please try again.
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="detail-header">
        <div className="header-info">
          <Button variant="ghost" onClick={() => router.back()}  className="mb-2 px-0">
            Back to Projects
          </Button>
          <h1>
            {project.project_name}
            <span className="project-code">({project.project_code})</span>
          </h1>
          <span className="status-badge" data-status={project.status.toLowerCase()}>{project.status}</span>
        </div>
        <div className="header-actions">
          <Button variant="secondary" >Edit Project</Button>
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'daily-logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily-logs')}
        >
          Daily Logs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="overview-grid">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="info-list">
                <div className="info-item">
                  <Building className="info-icon" size={18} />
                  <div className="info-content">
                    <span className="info-label">Client Name</span>
                    <span className="info-value">{project.client_name || 'N/A'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <MapPin className="info-icon" size={18} />
                  <div className="info-content">
                    <span className="info-label">Site Address</span>
                    <span className="info-value">{project.site_address || 'N/A'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Briefcase className="info-icon" size={18} />
                  <div className="info-content">
                    <span className="info-label">Project Type</span>
                    <span className="info-value">{project.project_type}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Calendar className="info-icon" size={18} />
                  <div className="info-content">
                    <span className="info-label">Start Date - Expected Completion</span>
                    <span className="info-value">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'} 
                      {' - '}
                      {project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="info-list">
                <div className="info-item">
                  <DollarSign className="info-icon" size={18} />
                  <div className="info-content">
                    <span className="info-label">Total Budget</span>
                    <span className="info-value">${project.budget?.toLocaleString() || '0'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <DollarSign className="info-icon" size={18} />
                  <div className="info-content">
                    <span className="info-label">Estimated Cost</span>
                    <span className="info-value">${project.estimated_cost?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'daily-logs' && (
        <Card>
          <CardContent className="p-8 text-center text-[var(--text-secondary)]">
            Daily logs list will be implemented here.
          </CardContent>
        </Card>
      )}

      {activeTab === 'materials' && (
        <Card>
          <CardContent className="p-8 text-center text-[var(--text-secondary)]">
            Material inventory for this project will be implemented here.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

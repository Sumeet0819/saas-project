'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, ArrowLeft, MapPin, Calendar, Building, DollarSign, Users, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetProjectByIdQuery } from '../../../../store/api/projectsApi';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: project, isLoading, error } = useGetProjectByIdQuery(id);
  const [activeTab, setActiveTab] = useState<'overview' | 'daily-logs' | 'materials'>('overview');

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-destructive p-4 text-center bg-destructive/10 rounded-xl max-w-md mx-auto mt-12 border border-destructive/20">
        <p className="font-bold">Failed to load project details.</p>
        <p className="text-sm mt-1 text-destructive/80">Please try again later or contact support.</p>
      </div>
    );
  }

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
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}  
            className="w-fit pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {project.project_name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border shadow-sm ${getStatusClass(project.status)}`}>
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
                {project.project_code}
              </span>
              <span>•</span>
              <span className="uppercase tracking-widest text-[10px] font-bold">{project.project_type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 md:mt-10">
          <Button variant="outline" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-gray-100/80 dark:bg-gray-900/50 p-1 rounded-xl w-fit border border-gray-200 dark:border-gray-800">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'daily-logs', label: 'Daily Logs' },
          { id: 'materials', label: 'Materials' },
        ].map((tab) => (
          <button 
            key={tab.id}
            className={clsx(
              "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === tab.id 
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-700/50" 
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
            )}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-6">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Building className="text-primary" size={18} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Name</span>
                      <span className="text-base font-bold text-gray-900 dark:text-white">{project.client_name || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-blue-500" size={18} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site Address</span>
                      <span className="text-base font-bold text-gray-900 dark:text-white">{project.site_address || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Briefcase className="text-amber-500" size={18} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Type</span>
                      <span className="text-base font-bold text-gray-900 dark:text-white">{project.project_type}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="text-purple-500" size={18} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timeline</span>
                      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Start</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(project.start_date)}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Target</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(project.expected_completion_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] h-fit">
              <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-lg">Financials</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-6">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <DollarSign className="text-emerald-500" size={18} />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Budget</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(project.budget)}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <DollarSign className="text-orange-500" size={18} />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estimated Cost</span>
                      <span className="text-2xl font-black text-gray-900 dark:text-white">{formatCurrency(project.estimated_cost)}</span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'daily-logs' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-dashed">
              <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Daily Logs Integration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Daily logs specifically for this project will appear here. The dedicated log module is currently in development.
                </p>
                <Button className="mt-6" variant="outline">Create Initial Log</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'materials' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-dashed">
              <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                  <Building className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Material Inventory</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Track and manage material consumption and deliveries specific to this project site.
                </p>
                <Button className="mt-6" variant="outline">View Master Inventory</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}


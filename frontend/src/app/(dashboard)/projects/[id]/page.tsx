'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchProjectById, fetchProjectMembers } from '../../../../store/slices/projectsSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { fetchSiteActivitiesByProject } from '../../../../store/slices/siteActivitiesSlice';
import { fetchSiteIssuesByProject } from '../../../../store/slices/siteIssuesSlice';
import { fetchSitePhotosByProject } from '../../../../store/slices/sitePhotosSlice';
import { fetchDailyLogsByProject } from '../../../../store/slices/dailyLogsSlice';
import { fetchInventoryByProject } from '../../../../store/slices/materialInventorySlice';
import { fetchMaterialRequests } from '../../../../store/slices/materialRequestsSlice';
import { fetchMaterialMaster } from '../../../../store/slices/materialMasterSlice';
import { fetchWorkers } from '../../../../store/slices/workersSlice';
import { setActiveProject } from '../../../../store/slices/uiSlice';

import {
  ArrowLeft, Building, Edit, AlertTriangle,
  LayoutDashboard, ClipboardList, Layers, Camera,
  AlertCircle, Package, Users, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { motion, Variants } from 'framer-motion';

// Tab subcomponents
import { ProjectOverviewTab } from '@/components/projects/ProjectOverviewTab';
import { ProjectDprTab } from '@/components/projects/ProjectDprTab';
import { ProjectActivitiesTab } from '@/components/projects/ProjectActivitiesTab';
import { ProjectPhotosTab } from '@/components/projects/ProjectPhotosTab';
import { ProjectIssuesTab } from '@/components/projects/ProjectIssuesTab';
import { ProjectMaterialsTab } from '@/components/projects/ProjectMaterialsTab';
import { ProjectTeamTab } from '@/components/projects/ProjectTeamTab';
import { CreateIssueModal } from '@/components/projects/CreateIssueModal';
import { CreateDprModal } from '@/components/projects/CreateDprModal';

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

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
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.dot }} />
      {status || 'Planning'}
    </span>
  );
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const dispatch = useAppDispatch();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals state
  const [isDprModalOpen, setIsDprModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  // Redux Selectors
  const { currentProject: project, projectMembers, status: projectStatus, error } = useAppSelector(
    (state) => state.projects
  );
  const { organizations } = useAppSelector((state) => state.organizations);
  const { activities } = useAppSelector((state) => state.siteActivities);
  const { issues } = useAppSelector((state) => state.siteIssues);
  const { photos } = useAppSelector((state) => state.sitePhotos);
  const { logs } = useAppSelector((state) => state.dailyLogs);
  const { inventory } = useAppSelector((state) => state.materialInventory);
  const { requests } = useAppSelector((state) => state.materialRequests);
  const { materials: masterMaterials } = useAppSelector((state) => state.materialMaster);
  const { workers } = useAppSelector((state) => state.workers);

  // Fetch project-scoped data & synchronize global activeProjectId
  useEffect(() => {
    if (projectId) {
      dispatch(setActiveProject(projectId));
      dispatch(fetchProjectById(projectId));
      dispatch(fetchProjectMembers(projectId));
      dispatch(fetchSiteActivitiesByProject(projectId));
      dispatch(fetchSiteIssuesByProject(projectId));
      dispatch(fetchSitePhotosByProject(projectId));
      dispatch(fetchDailyLogsByProject(projectId));
      dispatch(fetchInventoryByProject(projectId));
      dispatch(fetchMaterialRequests());
      dispatch(fetchMaterialMaster());
      dispatch(fetchWorkers());
      dispatch(fetchOrganizations());
    }
  }, [projectId, dispatch]);

  const org = organizations.find((o) => o.id === project?.organization_id);

  if (projectStatus === 'loading' && !project) {
    return (
      <div className="flex justify-center items-center py-32">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-14 h-14 bg-[#F9EDEF] rounded-[12px] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-[#B85B63]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">Project not found</p>
        <p className="text-xs text-[#929994] mb-4">We could not load the details for this project.</p>
        <Button
          onClick={() => router.push('/projects')}
          className="bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] h-9 text-sm cursor-pointer"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  const openIssuesCount = issues.filter((i) => i.status !== 'Resolved').length;

  return (
    <div className="max-w-[1500px] mx-auto w-full space-y-6">
      {/* ── Top Header & Actions ── */}
      <motion.div variants={fade} initial="hidden" animate="show" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.push('/projects')}
            className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] transition-colors cursor-pointer shadow-sm shrink-0 mt-0.5"
            aria-label="Back to projects"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
                {project.project_name}
              </h1>
              <StatusBadge status={project.status || 'Planning'} />
            </div>
            <p className="text-xs text-[#929994] mt-1 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#626A66] dark:text-[#9BA49E]">{project.project_code}</span>
              <span>&bull;</span>
              <span>{project.project_type}</span>
              {project.client_name && (
                <>
                  <span>&bull;</span>
                  <span>Client: <strong className="text-[#171A18] dark:text-[#EFF1F0]">{project.client_name}</strong></span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            onClick={() => setIsDprModalOpen(true)}
            className="h-9 px-3.5 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <Plus size={14} strokeWidth={2.25} /> Log DPR
          </Button>

          <Button
            onClick={() => setIsIssueModalOpen(true)}
            variant="outline"
            className="h-9 px-3.5 text-xs font-semibold border-[#E6E9E7] dark:border-white/[0.08] text-[#B85B63] hover:bg-[#F9EDEF] rounded-[8px] gap-1.5 cursor-pointer"
          >
            <AlertTriangle size={13} strokeWidth={2} /> Report Snag
          </Button>

          <Button
            onClick={() => router.push(`/projects/${project.id}/edit`)}
            variant="outline"
            className="h-9 px-3.5 text-xs font-medium border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] dark:text-[#9BA49E] hover:text-[#171A18] rounded-[8px] gap-1.5 cursor-pointer"
          >
            <Edit size={13} strokeWidth={2} /> Edit
          </Button>
        </div>
      </motion.div>

      {/* ── 7-Tab Unified Workspace ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview" className="gap-1.5">
            <LayoutDashboard size={14} /> Overview
          </TabsTrigger>

          <TabsTrigger value="dpr" className="gap-1.5">
            <ClipboardList size={14} /> Daily Logs ({logs.length})
          </TabsTrigger>

          <TabsTrigger value="activities" className="gap-1.5">
            <Layers size={14} /> Activities ({activities.length})
          </TabsTrigger>

          <TabsTrigger value="photos" className="gap-1.5">
            <Camera size={14} /> Photos ({photos.length})
          </TabsTrigger>

          <TabsTrigger value="issues" className="gap-1.5">
            <AlertCircle size={14} /> Snags & Issues
            {openIssuesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#B85B63] text-white">
                {openIssuesCount}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="materials" className="gap-1.5">
            <Package size={14} /> Materials ({inventory.length})
          </TabsTrigger>

          <TabsTrigger value="team" className="gap-1.5">
            <Users size={14} /> Team & Labor
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview">
          <ProjectOverviewTab
            project={project}
            orgName={org?.name}
            activities={activities}
            issues={issues}
            logs={logs}
            inventory={inventory}
            membersCount={projectMembers.length}
            onSelectTab={setActiveTab}
          />
        </TabsContent>

        {/* Tab 2: DPR Logs */}
        <TabsContent value="dpr">
          <ProjectDprTab logs={logs} onOpenDprModal={() => setIsDprModalOpen(true)} />
        </TabsContent>

        {/* Tab 3: Activities */}
        <TabsContent value="activities">
          <ProjectActivitiesTab projectId={projectId} activities={activities} />
        </TabsContent>

        {/* Tab 4: Photos */}
        <TabsContent value="photos">
          <ProjectPhotosTab projectId={projectId} photos={photos} />
        </TabsContent>

        {/* Tab 5: Issues & Snags */}
        <TabsContent value="issues">
          <ProjectIssuesTab issues={issues} onOpenIssueModal={() => setIsIssueModalOpen(true)} />
        </TabsContent>

        {/* Tab 6: Materials */}
        <TabsContent value="materials">
          <ProjectMaterialsTab
            projectId={projectId}
            inventory={inventory}
            masterMaterials={masterMaterials}
            requests={requests}
          />
        </TabsContent>

        {/* Tab 7: Team */}
        <TabsContent value="team">
          <ProjectTeamTab members={projectMembers} workers={workers} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateDprModal
        isOpen={isDprModalOpen}
        onClose={() => setIsDprModalOpen(false)}
        projectId={projectId}
      />

      <CreateIssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
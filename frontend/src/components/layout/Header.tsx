'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Bell, Settings, Building2, Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, togglePreferences, setActiveOrganization, setActiveProject } from '../../store/slices/uiSlice';
import { fetchOrganizations } from '../../store/slices/organizationsSlice';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeOrganizationId, activeProjectId } = useAppSelector((state) => state.ui);
  const { organizations, status: orgStatus } = useAppSelector((state) => state.organizations);
  const { projects, currentProject, status: projStatus } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
    if (projStatus === 'idle') {
      dispatch(fetchProjects());
    }
  }, [orgStatus, projStatus, dispatch]);

  useEffect(() => {
    if (organizations.length > 0 && !activeOrganizationId) {
      const userOrg = organizations.find((o) => o.id === user?.organization_id);
      dispatch(setActiveOrganization(userOrg ? userOrg.id : organizations[0].id));
    }
  }, [organizations, user, activeOrganizationId, dispatch]);

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AU';

  const currentOrg =
    organizations.find((org) => org.id === activeOrganizationId) ||
    organizations.find((o) => o.id === user?.organization_id) ||
    organizations[0];

  const organizationName = currentOrg?.name || 'Apex Construction';

  // Merge all available projects (full list + current active project if loaded)
  const allKnownProjects = React.useMemo(() => {
    const list = [...projects];
    if (currentProject && !list.some((p) => p.id === currentProject.id)) {
      list.push(currentProject);
    }
    return list;
  }, [projects, currentProject]);

  const orgProjects = React.useMemo(() => {
    if (!activeOrganizationId) return allKnownProjects;
    return allKnownProjects.filter((p) => p.organization_id === activeOrganizationId);
  }, [allKnownProjects, activeOrganizationId]);

  // Ensure current active project is always represented in dropdown list
  const dropdownProjects = React.useMemo(() => {
    const list = [...orgProjects];
    if (activeProjectId && activeProjectId !== 'all') {
      const activeP = allKnownProjects.find((p) => p.id === activeProjectId);
      if (activeP && !list.some((p) => p.id === activeP.id)) {
        list.unshift(activeP);
      }
    }
    return list;
  }, [orgProjects, activeProjectId, allKnownProjects]);

  // Project label lookup map for Base UI Select
  const projectItemsMap = React.useMemo(() => {
    const map: Record<string, string> = {
      all: 'All Projects',
    };
    allKnownProjects.forEach((p) => {
      map[p.id] = `${p.project_name} (${p.project_code})`;
    });
    return map;
  }, [allKnownProjects]);

  const activeProject = React.useMemo(() => {
    if (!activeProjectId || activeProjectId === 'all') return null;
    return allKnownProjects.find((p) => p.id === activeProjectId) || null;
  }, [allKnownProjects, activeProjectId]);

  const handleProjectSelect = (val: string | null) => {
    const selected = val || 'all';
    if (selected === 'all') {
      dispatch(setActiveProject(null));
    } else {
      dispatch(setActiveProject(selected));
      router.push(`/projects/${selected}`);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1B1E1C] flex items-center justify-between px-4 lg:px-6 z-30 sticky top-0 border-b border-[#E6E9E7] dark:border-white/[0.08]">
      {/* Left: mobile toggle + org name display + Project Selector */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile menu toggle only visible on small screens */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[7px] text-[#626A66] dark:text-[#9BA49E] hover:bg-[#F5F6F5] dark:hover:bg-white/[0.05] hover:text-[#171A18] dark:hover:text-[#EFF1F0] transition-colors cursor-pointer"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>

        {/* Organization Name (display only) */}
        <div className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-[#F7F8F7] dark:bg-white/[0.03]">
          <Building2 size={14} className="text-[#079B68] dark:text-[#0AAE78] shrink-0" strokeWidth={1.75} />
          <span className="text-sm font-medium text-[#171A18] dark:text-[#EFF1F0] tracking-tight truncate max-w-[150px] md:max-w-none">
            {organizationName}
          </span>
        </div>

        {/* Global Active Project Selector */}
        <div className="flex items-center">
          <Select
            value={activeProjectId || 'all'}
            onValueChange={(val) => handleProjectSelect(val || '')}
            items={projectItemsMap}
          >
            <SelectTrigger
              className="h-8 text-xs font-semibold bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] hover:border-[#079B68]/40 dark:hover:border-[#079B68]/40 rounded-[7px] gap-2 px-2.5 w-[170px] sm:w-[210px] md:w-[260px] transition-all shadow-xs"
              title={activeProject ? `${activeProject.project_name} (${activeProject.project_code})` : 'All Projects'}
            >
              <Briefcase size={13} className="text-[#079B68] shrink-0" />
              <SelectValue placeholder="All Projects">
                {(val: string | null) => {
                  if (!val || val === 'all') return 'All Projects';
                  const p = allKnownProjects.find((proj) => proj.id === val);
                  return p ? `${p.project_name} (${p.project_code})` : (val && val.length > 20 ? 'Project Workspace' : (val || 'All Projects'));
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              align="start"
              className="w-[300px] sm:w-[340px] max-h-80 bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] shadow-xl rounded-lg p-1.5"
            >
              <SelectItem value="all" className="cursor-pointer py-2 px-2.5 rounded-md text-xs font-medium">
                <span className="font-medium text-[#171A18] dark:text-[#EFF1F0]">All Projects</span>
              </SelectItem>
              {dropdownProjects.map((p) => (
                <SelectItem
                  key={p.id}
                  value={p.id}
                  className="cursor-pointer py-2 px-2.5 rounded-md text-xs"
                >
                  <span className="truncate font-medium text-[#171A18] dark:text-[#EFF1F0]">
                    {p.project_name}
                  </span>
                  <span className="text-[11px] text-[#929994] font-normal shrink-0">
                    ({p.project_code})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-[7px] text-[#626A66] dark:text-[#9BA49E] hover:bg-[#F5F6F5] dark:hover:bg-white/[0.05] hover:text-[#171A18] dark:hover:text-[#EFF1F0] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={17} strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#B85B63] rounded-full" />
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          className="hidden sm:flex w-8 h-8 items-center justify-center rounded-[7px] text-[#626A66] dark:text-[#9BA49E] hover:bg-[#F5F6F5] dark:hover:bg-white/[0.05] hover:text-[#171A18] dark:hover:text-[#EFF1F0] transition-colors cursor-pointer"
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={17} strokeWidth={1.75} />
        </Link>

        {/* Divider */}
        <div className="w-px h-5 bg-[#E6E9E7] dark:bg-white/[0.08] mx-2 hidden sm:block" />

        {/* User */}
        <Link href="/settings" className="flex items-center gap-2.5 group outline-none cursor-pointer" title="Manage Profile & Settings">
          {user?.profile_photo ? (
            <img
              src={user.profile_photo}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#079B68]/30 transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center ring-2 ring-transparent group-hover:ring-[#079B68]/30 transition-all">
              <span className="text-[11px] font-semibold text-[#079B68]">{initials}</span>
            </div>
          )}
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-[13px] font-semibold text-[#171A18] dark:text-[#EFF1F0] leading-tight group-hover:text-[#079B68] transition-colors">
              {user?.full_name || 'Admin User'}
            </span>
            <span className="text-[11px] text-[#929994] leading-tight">{user?.role || 'System Admin'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

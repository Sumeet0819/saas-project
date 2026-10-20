'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Menu, Bell, Settings, Building2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, togglePreferences, setActiveOrganization } from '../../store/slices/uiSlice';
import { fetchOrganizations } from '../../store/slices/organizationsSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeOrganizationId } = useAppSelector((state) => state.ui);
  const { organizations, status: orgStatus } = useAppSelector((state) => state.organizations);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

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

  return (
    <header className="h-16 bg-white dark:bg-[#1B1E1C] flex items-center justify-between px-4 lg:px-6 z-30 sticky top-0 border-b border-[#E6E9E7] dark:border-white/[0.08]">
      {/* Left: mobile toggle + org name display */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle only visible on small screens */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-[7px] text-[#626A66] dark:text-[#9BA49E] hover:bg-[#F5F6F5] dark:hover:bg-white/[0.05] hover:text-[#171A18] dark:hover:text-[#EFF1F0] transition-colors cursor-pointer"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>

        {/* Organization Name (display only) */}
        <div className="flex items-center gap-2 h-8 px-3 rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-[#F7F8F7] dark:bg-white/[0.03]">
          <Building2 size={14} className="text-[#079B68] dark:text-[#0AAE78] shrink-0" strokeWidth={1.75} />
          <span className="text-sm font-medium text-[#171A18] dark:text-[#EFF1F0] tracking-tight truncate max-w-[200px] sm:max-w-none">
            {organizationName}
          </span>
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

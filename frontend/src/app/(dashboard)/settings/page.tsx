'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  Building2,
  Palette,
  Bell,
  Wrench,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import ProfileSettingsTab from '@/components/settings/ProfileSettingsTab';
import OrganizationSettingsTab from '@/components/settings/OrganizationSettingsTab';
import AppearanceSettingsTab from '@/components/settings/AppearanceSettingsTab';
import NotificationSettingsTab from '@/components/settings/NotificationSettingsTab';
import ConstructionDefaultsTab from '@/components/settings/ConstructionDefaultsTab';

const TABS = [
  {
    id: 'profile',
    label: 'Profile & Account',
    description: 'Personal details and credentials',
    icon: UserIcon,
  },
  {
    id: 'organization',
    label: 'Organization & Company',
    description: 'Branding, GST, and currency',
    icon: Building2,
  },
  {
    id: 'appearance',
    label: 'Appearance & Theme',
    description: 'Theme mode and brand accents',
    icon: Palette,
  },
  {
    id: 'notifications',
    label: 'Notifications & Alerts',
    description: 'Inventory, log, and safety alerts',
    icon: Bell,
  },
  {
    id: 'defaults',
    label: 'Construction Defaults',
    description: 'Shifts, overtime, and buffer limits',
    icon: Wrench,
  },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const activeTab = TABS.some((t) => t.id === tabParam) ? (tabParam as string) : 'profile';

  const handleTabSelect = (tabId: string) => {
    router.replace(`/settings?tab=${tabId}`, { scroll: false });
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full pb-12">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-[#929994] mt-0.5">
          Manage your personal profile, organization setup, system appearance, and project defaults.
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          {/* Mobile horizontal pill navigation */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 custom-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#079B68] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] text-[#626A66] dark:text-[#9BA49E]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop vertical tab list */}
          <div className="hidden lg:block bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-2 shadow-[0_1px_3px_rgba(16,24,20,0.04)] sticky top-20">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">
              Configuration
            </div>
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-[8px] text-left transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-[#E7F5EF] text-[#079B68] dark:bg-[rgba(7,155,104,0.12)] font-semibold'
                        : 'text-[#626A66] dark:text-[#9BA49E] hover:bg-[#F5F6F5] dark:hover:bg-white/[0.04] hover:text-[#171A18] dark:hover:text-[#EFF1F0] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#079B68] text-white'
                            : 'bg-[#F5F6F5] dark:bg-white/[0.05] text-[#929994] group-hover:text-[#171A18] dark:group-hover:text-[#EFF1F0]'
                        }`}
                      >
                        <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs tracking-tight truncate">{tab.label}</p>
                        <p className="text-[10px] text-[#929994] font-normal truncate">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight size={14} className="text-[#079B68] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Column: Active Tab Content */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'profile' && <ProfileSettingsTab />}
              {activeTab === 'organization' && <OrganizationSettingsTab />}
              {activeTab === 'appearance' && <AppearanceSettingsTab />}
              {activeTab === 'notifications' && <NotificationSettingsTab />}
              {activeTab === 'defaults' && <ConstructionDefaultsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center">
          <ConstructionLoader size="md" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

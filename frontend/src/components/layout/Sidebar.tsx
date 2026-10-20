'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  HardHat,
  Package,
  Truck,
  Wrench,
  AlertTriangle,
  Image as ImageIcon,
  Building2,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSidebarOpen, toggleSidebar } from '../../store/slices/uiSlice';

const navCategories = [
  {
    title: 'Menu',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Projects', icon: Briefcase, href: '/projects' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Daily Logs', icon: HardHat, href: '/daily-logs' },
      { label: 'Workforce', icon: Users, href: '/workers' },
      { label: 'Materials', icon: Package, href: '/materials' },
      { label: 'Deliveries', icon: Truck, href: '/deliveries' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Equipment', icon: Wrench, href: '/equipment' },
      { label: 'Site Issues', icon: AlertTriangle, href: '/site-issues' },
      { label: 'Site Photos', icon: ImageIcon, href: '/site-photos' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', icon: Settings, href: '/settings' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <aside
      className={clsx(
        'fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out',
        'bg-white dark:bg-[#1B1E1C]',
        'border-r border-[#E6E9E7] dark:border-white/[0.08]',
        sidebarOpen ? 'w-60 translate-x-0' : 'w-16 -translate-x-full md:translate-x-0'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#E6E9E7] dark:border-white/[0.08] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 bg-[#079B68] rounded-[8px] flex items-center justify-center shadow-sm shadow-[#079B68]/20">
            <Building2 size={16} className="text-white" strokeWidth={2} />
          </div>
          <span
            className={clsx(
              'font-semibold text-[15px] text-[#171A18] dark:text-[#EFF1F0] tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden',
              !sidebarOpen && 'w-0 opacity-0'
            )}
          >
            CivilSaaS
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <div className="space-y-5">
          {navCategories.map((category) => (
            <div key={category.title}>
              {/* Section label */}
              <h3
                className={clsx(
                  'text-[10px] font-semibold uppercase tracking-wider text-[#929994] mb-2 px-2 transition-all duration-300 overflow-hidden whitespace-nowrap',
                  !sidebarOpen && 'w-0 opacity-0'
                )}
              >
                {category.title}
              </h3>

              <ul className="space-y-0.5">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + '/');

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            dispatch(setSidebarOpen(false));
                          }
                        }}
                        title={!sidebarOpen ? item.label : undefined}
                        className={clsx(
                          'flex items-center rounded-[8px] text-sm font-medium transition-all duration-150 group cursor-pointer',
                          sidebarOpen ? 'gap-3 px-2 py-2' : 'justify-center p-2 h-10',
                          isActive
                            ? 'bg-[#E7F5EF] text-[#079B68] dark:bg-[rgba(7,155,104,0.12)] dark:text-[#079B68]'
                            : 'text-[#626A66] dark:text-[#9BA49E] hover:bg-[#F5F6F5] dark:hover:bg-white/[0.04] hover:text-[#171A18] dark:hover:text-[#EFF1F0]'
                        )}
                      >
                        <Icon
                          size={17}
                          strokeWidth={isActive ? 2.25 : 1.75}
                          className={clsx('shrink-0', isActive ? 'text-[#079B68]' : 'text-[#929994] group-hover:text-[#626A66] dark:group-hover:text-[#9BA49E]')}
                        />
                        <span
                          className={clsx(
                            'whitespace-nowrap transition-all duration-300 overflow-hidden',
                            !sidebarOpen && 'w-0 opacity-0'
                          )}
                        >
                          {item.label}
                        </span>
                        {isActive && sidebarOpen && (
                          <ChevronRight size={12} className="ml-auto text-[#079B68]/60 shrink-0" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Upgrade panel */}
      <div className={clsx('px-3 transition-all duration-300 overflow-hidden', sidebarOpen ? 'pb-4' : 'h-0 pb-0 opacity-0 pointer-events-none')}>
        <div
          className="rounded-[10px] p-4 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #079B68 0%, #0AAE78 60%, #49C795 100%)' }}
        >
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-semibold text-white/90 mb-0.5">Upgrade to Pro</p>
          <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
            Unlock advanced analytics and unlimited projects.
          </p>
          <button className="w-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold py-1.5 rounded-[6px] transition-colors cursor-pointer">
            Upgrade — $30/mo
          </button>
        </div>
      </div>

      {/* Bottom Collapse / Expand Toggle */}
      <div className="p-3 border-t border-[#E6E9E7] dark:border-white/[0.08] shrink-0 bg-white dark:bg-[#1B1E1C]">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={clsx(
            'flex items-center rounded-[8px] text-xs font-medium text-[#626A66] dark:text-[#9BA49E]',
            'hover:bg-[#F5F6F5] dark:hover:bg-white/[0.05] hover:text-[#171A18] dark:hover:text-[#EFF1F0]',
            'transition-colors duration-150 cursor-pointer group',
            sidebarOpen ? 'w-full px-2.5 py-2 gap-2.5' : 'w-10 h-10 mx-auto justify-center p-0'
          )}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <>
              <PanelLeftClose
                size={18}
                strokeWidth={1.75}
                className="shrink-0 text-[#929994] group-hover:text-[#171A18] dark:group-hover:text-[#EFF1F0] transition-colors"
              />
              <span className="whitespace-nowrap transition-all duration-200 overflow-hidden text-[13px]">
                Collapse sidebar
              </span>
            </>
          ) : (
            <PanelLeftOpen
              size={18}
              strokeWidth={1.75}
              className="shrink-0 text-[#929994] group-hover:text-[#171A18] dark:group-hover:text-[#EFF1F0] transition-colors"
            />
          )}
        </button>
      </div>
    </aside>
  );
}

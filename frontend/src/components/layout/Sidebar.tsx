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
  Building
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const navCategories = [
  {
    title: 'MENU',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Projects', icon: Briefcase, href: '/projects' },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Daily Logs', icon: HardHat, href: '/daily-logs' },
      { label: 'Workforce', icon: Users, href: '/workers' },
      { label: 'Materials', icon: Package, href: '/materials' },
      { label: 'Deliveries', icon: Truck, href: '/deliveries' },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Equipment', icon: Wrench, href: '/equipment' },
      { label: 'Site Issues', icon: AlertTriangle, href: '/site-issues' },
      { label: 'Site Photos', icon: ImageIcon, href: '/site-photos' },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <aside className={clsx(
      "fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800",
      sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
    )}>
      {/* Logo Area */}
      <div className="h-[88px] flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center min-w-[32px] h-[32px] bg-white dark:bg-gray-800 rounded-lg border-2 border-primary text-primary transition-colors">
            <Building size={18} strokeWidth={2.5} />
          </div>
          <div className={clsx("flex flex-col overflow-hidden transition-all duration-300", !sidebarOpen && "hidden")}>
            <span className="text-gray-900 dark:text-white font-bold text-xl leading-tight tracking-tight">CivilSaaS</span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
        <div className="space-y-6">
          {navCategories.map((category) => (
            <div key={category.title}>
              <h3 className={clsx("text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-2 transition-all", !sidebarOpen && "hidden")}>
                {category.title}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href} 
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            dispatch(setSidebarOpen(false));
                          }
                        }}
                        className={clsx(
                          "flex items-center px-3 py-2.5 rounded-xl transition-all font-medium group",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <Icon className={clsx("min-w-[20px]", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600")} size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={clsx("ml-3 text-sm whitespace-nowrap transition-all duration-300", !sidebarOpen && "hidden")}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Upgrade Pro Widget */}
      <div className={clsx("p-4 transition-all duration-300", !sidebarOpen && "hidden")}>
        <div className="bg-slate-900 rounded-3xl p-5 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <Building size={20} className="text-white" />
          </div>
          
          <h4 className="font-bold text-lg mb-1">Upgrade Pro</h4>
          <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
            Discover the benefits of an upgraded account
          </p>
          
          <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-lg shadow-primary/20">
            Upgrade $30
          </button>
        </div>
      </div>
    </aside>
  );
}

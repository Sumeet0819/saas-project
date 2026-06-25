'use client';

import React from 'react';
import clsx from 'clsx';
import { useAppSelector } from '../../store/hooks';
import Sidebar from './Sidebar';
import Header from './Header';
export default function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FB] font-sans">
      <Sidebar />
      <div className={clsx(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-[#F4F7FB]">
          {children}
        </main>
      </div>
    </div>
  );
}

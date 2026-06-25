'use client';

import React from 'react';
import clsx from 'clsx';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import Sidebar from './Sidebar';
import Header from './Header';
import ThemePreferences from './ThemePreferences';
import { setSidebarOpen } from '../../store/slices/uiSlice';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans transition-colors relative">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      <Sidebar />
      <div className={clsx(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
      )}>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-background transition-colors">
          {children}
        </main>
      </div>
      <ThemePreferences />
    </div>
  );
}

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
    <div className="flex h-screen overflow-hidden bg-[#F7F8F7] dark:bg-[#111312] font-sans transition-colors relative">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-30 md:hidden transition-opacity"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <Sidebar />

      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out overflow-hidden',
          sidebarOpen ? 'ml-0 md:ml-60' : 'ml-0 md:ml-16'
        )}
      >
        <Header />
        <main className="flex-1 overflow-auto p-5 md:p-6 lg:p-8 bg-[#F7F8F7] dark:bg-[#111312] transition-colors custom-scrollbar">
          {children}
        </main>
      </div>

      <ThemePreferences />
    </div>
  );
}

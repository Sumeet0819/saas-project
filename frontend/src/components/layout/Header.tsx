'use client';

import React from 'react';
import { Menu, Search, Bell, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, togglePreferences } from '../../store/slices/uiSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center h-full">
        <button 
          className="flex items-center justify-center p-2 bg-white dark:bg-gray-800 shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl mr-4 transition-colors" 
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-5">
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Search">
          <Search size={18} strokeWidth={2.5} />
        </button>
        
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative" aria-label="Notifications">
          <Bell size={18} strokeWidth={2.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </button>

        <button 
          onClick={() => dispatch(togglePreferences())}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:flex" 
          aria-label="Settings"
        >
          <Settings size={18} strokeWidth={2.5} />
        </button>
        
        <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2"></div>
        
        <button className="flex items-center space-x-3 group outline-none">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSubHI-QwbO-uFuCN2iZ6P7r0HLhScutsjb_I_Uq5Y8VHxtDNbPC7Mw6dizCxI5YpwtTlRcb7En2lTGtgtEtMb_JT5U6qJX5hFaX7F8vbdE8Y86Jgn-zKph5QaKKLRHEKeNCK4qX5qsUxGSeSMuaf_a2SVPGSs7Cl1H0TdfTw6nM2IJEa9fD8WYuB5NsaIT0QxRJlisXW0HN-OFnAeH9m6SG_R7upSUKepl7-cnTn1UjVtTUsA5vWVgoL7S8EL8HsrKOyahl5Zslyo" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:ring-2 group-hover:ring-blue-500/50 transition-all" 
          />
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary transition-colors">{user?.full_name || 'Sajibur Rahman'}</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{user?.role || 'Project Manager'}</span>
          </div>
        </button>
      </div>
    </header>
  );
}

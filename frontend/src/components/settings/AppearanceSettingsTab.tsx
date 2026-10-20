'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme, setColorTheme } from '@/store/slices/uiSlice';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop, Check, Palette, Sparkles, Layout } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCENT_COLORS = [
  { id: 'emerald', name: 'Brand Emerald', hex: '#079B68', bgClass: 'bg-[#079B68]' },
  { id: 'teal', name: 'Teal Cyan', hex: '#14B8A6', bgClass: 'bg-[#14B8A6]' },
  { id: 'blue', name: 'Classic Blue', hex: '#2563EB', bgClass: 'bg-[#2563EB]' },
  { id: 'amber', name: 'Amber Gold', hex: '#D97706', bgClass: 'bg-[#D97706]' },
  { id: 'rose', name: 'Civil Rose', hex: '#E11D48', bgClass: 'bg-[#E11D48]' },
  { id: 'violet', name: 'Deep Violet', hex: '#7C3AED', bgClass: 'bg-[#7C3AED]' },
];

export default function AppearanceSettingsTab() {
  const dispatch = useAppDispatch();
  const { theme, colorTheme } = useAppSelector((state) => state.ui);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
    toast.success(`Theme switched to ${newTheme} mode`);
  };

  const handleColorChange = (newColor: string, name: string) => {
    dispatch(setColorTheme(newColor));
    toast.success(`Accent color set to ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
          Appearance & Theme
        </h2>
        <p className="text-xs text-[#929994] mt-0.5">
          Customize your dashboard theme, color palette, and interface preferences.
        </p>
      </div>

      {/* Theme Mode Card */}
      <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] flex items-center gap-2">
              <Sun size={15} className="text-[#079B68]" /> Interface Theme
            </h3>
            <p className="text-xs text-[#929994] mt-0.5">
              Select how CivilSaaS looks on your device.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-[10px] border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                theme === 'light'
                  ? 'border-[#079B68] bg-[#E7F5EF]/40 shadow-sm'
                  : 'border-[#E6E9E7] dark:border-white/[0.08] hover:border-[#CBD5E1] dark:hover:border-white/20 bg-white dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-[7px] bg-white border border-[#E6E9E7] flex items-center justify-center text-[#171A18] shadow-xs">
                  <Sun size={16} />
                </div>
                {theme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-[#079B68] text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Light</p>
                <p className="text-[11px] text-[#929994]">Crisp, daylight optimized contrast.</p>
              </div>
            </button>

            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-[10px] border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                theme === 'dark'
                  ? 'border-[#079B68] bg-[#079B68]/10 shadow-sm'
                  : 'border-[#E6E9E7] dark:border-white/[0.08] hover:border-[#CBD5E1] dark:hover:border-white/20 bg-white dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-[7px] bg-[#1B1E1C] border border-white/10 flex items-center justify-center text-white shadow-xs">
                  <Moon size={16} />
                </div>
                {theme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-[#079B68] text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Dark</p>
                <p className="text-[11px] text-[#929994]">Low-glare, dark slate theme for site cabins.</p>
              </div>
            </button>
          </div>
        </div>
      </Card>

      {/* Accent Color Palette */}
      <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] flex items-center gap-2">
              <Palette size={15} className="text-[#079B68]" /> Accent Brand Color
            </h3>
            <p className="text-xs text-[#929994] mt-0.5">
              Choose the primary highlight color across navigation, charts, and buttons.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {ACCENT_COLORS.map((accent) => {
              const isSelected = colorTheme === accent.id;
              return (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => handleColorChange(accent.id, accent.name)}
                  className={`p-3 rounded-[9px] border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-[#079B68] bg-[#E7F5EF]/30 dark:bg-[#079B68]/10'
                      : 'border-[#E6E9E7] dark:border-white/[0.08] hover:border-[#CBD5E1] dark:hover:border-white/20'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${accent.bgClass}`}>
                    {isSelected && <Check size={13} className="text-white" strokeWidth={2.5} />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-[#079B68]' : 'text-[#171A18] dark:text-[#EFF1F0]'}`}>
                      {accent.name}
                    </p>
                    <p className="text-[10px] text-[#929994] font-mono">{accent.hex}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Layout Density */}
      <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] flex items-center gap-2">
              <Layout size={15} className="text-[#079B68]" /> High-Density Tables
            </h3>
            <p className="text-xs text-[#929994] max-w-md">
              Compact row padding for materials, workers, and project data tables to display more information on screen.
            </p>
          </div>

          <span className="text-xs text-[#079B68] font-medium bg-[#E7F5EF] dark:bg-[#079B68]/15 px-2.5 py-1 rounded-full">
            Comfortable (Default)
          </span>
        </div>
      </Card>
    </div>
  );
}

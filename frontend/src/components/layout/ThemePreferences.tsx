'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { togglePreferences, setTheme, setColorTheme } from '../../store/slices/uiSlice';

const THEMES = [
  { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
  { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
  { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
  { id: 'violet', name: 'Violet', color: 'bg-violet-500' },
];

export default function ThemePreferences() {
  const dispatch = useAppDispatch();
  const { preferencesOpen, theme, colorTheme } = useAppSelector((state) => state.ui);

  return (
    <AnimatePresence>
      {preferencesOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(togglePreferences())}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Preferences Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preferences</h2>
              <button
                onClick={() => dispatch(togglePreferences())}
                className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
              
              {/* Mode Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Mode</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => dispatch(setTheme('light'))}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    <Sun size={24} />
                    <span className="text-xs font-bold uppercase tracking-wider">Light</span>
                  </button>
                  <button
                    onClick={() => dispatch(setTheme('dark'))}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    <Moon size={24} />
                    <span className="text-xs font-bold uppercase tracking-wider">Dark</span>
                  </button>
                </div>
              </div>

              {/* Theme Color Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Color Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => dispatch(setColorTheme(t.id))}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        colorTheme === t.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.color}`}>
                        {colorTheme === t.id && <Check size={16} className="text-white" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        colorTheme === t.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

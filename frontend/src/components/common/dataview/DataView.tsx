'use client';

import React, { useState } from 'react';
import { Search, X, Table, LayoutGrid, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { EmptyState } from './EmptyState';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const fade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export interface FilterTab {
  key: string;
  label: string;
  count?: number;
}

export interface DataViewProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  
  // Search
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchPlaceholder?: string;

  // Filter Tabs
  filterTabs?: FilterTab[];
  activeFilterTab?: string;
  onFilterTabChange?: (key: string) => void;

  // Custom filter element (e.g. project select, date picker)
  filterSlot?: React.ReactNode;

  // View mode
  viewMode?: 'table' | 'grid';
  defaultViewMode?: 'table' | 'grid';
  onViewModeChange?: (mode: 'table' | 'grid') => void;
  allowViewToggle?: boolean;

  // States
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;

  // Empty State Customization
  emptyIcon?: React.ElementType;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;

  // Views
  tableView?: React.ReactNode;
  gridView?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function DataView({
  title,
  subtitle,
  action,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search…',
  filterTabs,
  activeFilterTab,
  onFilterTabChange,
  filterSlot,
  viewMode: controlledViewMode,
  defaultViewMode = 'table',
  onViewModeChange,
  allowViewToggle = true,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  emptyIcon = Search,
  emptyTitle = 'No records found',
  emptyDescription = 'No records match your criteria. Try adjusting your search or filters.',
  emptyActionText,
  onEmptyAction,
  tableView,
  gridView,
  children,
  className = '',
}: DataViewProps) {
  const [internalViewMode, setInternalViewMode] = useState<'table' | 'grid'>(defaultViewMode);

  const activeViewMode = controlledViewMode !== undefined ? controlledViewMode : internalViewMode;

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  const hasControls = !!onSearchChange || !!filterTabs?.length || !!filterSlot || (allowViewToggle && (tableView || gridView));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`max-w-[1400px] mx-auto w-full ${className}`}
    >
      {/* Page Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-[#929994] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-2.5 flex-wrap">{action}</div>}
      </motion.div>

      {/* Controls Bar: Search, Filter Tabs, Slots, and View Toggle */}
      {hasControls && (
        <motion.div variants={fade} className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search */}
              {onSearchChange && (
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" strokeWidth={1.75} />
                  <Input
                    className="pl-9 pr-8 h-9 text-sm bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#929994] hover:text-[#171A18] cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              )}

              {/* Extra Filter Slot */}
              {filterSlot}
            </div>

            {/* View Mode Switcher */}
            {allowViewToggle && (tableView || gridView) && (
              <div className="flex items-center self-end sm:self-auto p-1 bg-[#F5F6F5] dark:bg-white/[0.04] rounded-[8px] border border-[#E6E9E7] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => handleViewModeChange('table')}
                  className={`p-1.5 rounded-[6px] transition-all cursor-pointer ${
                    activeViewMode === 'table'
                      ? 'bg-white dark:bg-[#1B1E1C] text-[#079B68] shadow-sm'
                      : 'text-[#929994] hover:text-[#171A18]'
                  }`}
                  title="Table View"
                >
                  <Table size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-1.5 rounded-[6px] transition-all cursor-pointer ${
                    activeViewMode === 'grid'
                      ? 'bg-white dark:bg-[#1B1E1C] text-[#079B68] shadow-sm'
                      : 'text-[#929994] hover:text-[#171A18]'
                  }`}
                  title="Grid / Card View"
                >
                  <LayoutGrid size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Filter Tabs / Pills */}
          {filterTabs && filterTabs.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {filterTabs.map((tab) => {
                const isActive = activeFilterTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => onFilterTabChange && onFilterTabChange(tab.key)}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-xs font-semibold transition-all cursor-pointer border"
                    style={
                      isActive
                        ? { background: '#E7F5EF', color: '#079B68', borderColor: '#079B6830' }
                        : { background: 'white', color: '#626A66', borderColor: '#E6E9E7' }
                    }
                  >
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0 rounded-full"
                        style={
                          isActive
                            ? { background: '#079B6820', color: '#079B68' }
                            : { background: '#F5F6F5', color: '#929994' }
                        }
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <ConstructionLoader size="md" />
        </div>
      ) : error ? (
        <motion.div variants={fade} className="bg-white dark:bg-[#1B1E1C] border border-[#B85B63]/20 rounded-[10px] p-8 text-center shadow-sm">
          <div className="w-10 h-10 bg-[#F9EDEF] rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle size={18} className="text-[#B85B63]" />
          </div>
          <p className="text-sm font-semibold text-[#B85B63] mb-1">Failed to load data</p>
          <p className="text-xs text-[#929994] mb-4">{error}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="h-8 text-xs border-[#E6E9E7] rounded-[7px]"
            >
              Retry
            </Button>
          )}
        </motion.div>
      ) : isEmpty ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          actionText={emptyActionText}
          onAction={onEmptyAction}
        />
      ) : (
        <AnimatePresence mode="wait">
          {activeViewMode === 'table' && tableView ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {tableView}
            </motion.div>
          ) : activeViewMode === 'grid' && gridView ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {gridView}
            </motion.div>
          ) : (
            <motion.div
              key="children"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

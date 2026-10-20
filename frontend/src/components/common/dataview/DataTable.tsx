'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  return (
    <div
      className={`bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994] ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E9E7] dark:divide-white/[0.05] text-sm">
            <AnimatePresence>
              {data.map((item, index) => {
                const key = keyExtractor(item);
                const isClickable = !!onRowClick;

                return (
                  <motion.tr
                    key={key}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`group transition-colors ${
                      isClickable
                        ? 'cursor-pointer hover:bg-[#F9FAF9] dark:hover:bg-white/[0.02]'
                        : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={`${key}-${col.key}`}
                        className={`px-5 py-3.5 ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {col.render(item, index)}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

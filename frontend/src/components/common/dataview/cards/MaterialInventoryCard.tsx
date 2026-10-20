'use client';

import React from 'react';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface InventoryItemDisplay {
  id: string;
  project_id: string;
  material_id: string;
  opening_stock: number;
  received_stock: number;
  consumed_stock: number;
  current_stock: number;
  material_name: string;
  unit: string;
  min_stock: number;
}

interface MaterialInventoryCardProps {
  item: InventoryItemDisplay;
  projectName: string;
  onAdjustStock: () => void;
}

export function MaterialInventoryCard({
  item,
  projectName,
  onAdjustStock,
}: MaterialInventoryCardProps) {
  const isCritical = item.current_stock <= item.min_stock * 0.5;
  const isLow = item.current_stock <= item.min_stock && !isCritical;

  const statusBadgeConfig = isCritical
    ? { bg: '#F9EDEF', text: '#B85B63', label: 'CRITICAL LOW' }
    : isLow
    ? { bg: '#FEF9EC', text: '#D5A04A', label: 'LOW STOCK' }
    : { bg: '#E7F5EF', text: '#079B68', label: 'IN STOCK' };

  return (
    <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] hover:shadow-[0_4px_12px_rgba(16,24,20,0.08)] transition-all flex flex-col h-full overflow-hidden">
      {/* Top card header */}
      <div className="px-4 py-3 border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold text-[#929994] truncate uppercase tracking-wider">
            {projectName}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: statusBadgeConfig.bg, color: statusBadgeConfig.text }}
          >
            {statusBadgeConfig.label}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mt-1 truncate">
          {item.material_name}
        </h3>
      </div>

      {/* Stock Metrics */}
      <div className="p-4 grid grid-cols-2 gap-3 flex-1">
        <div className="bg-[#F9FAF9] dark:bg-white/[0.02] border border-[#E6E9E7] dark:border-white/[0.06] rounded-[7px] p-2.5 text-center">
          <p className="text-[10px] font-semibold text-[#929994] uppercase tracking-wider mb-0.5">Current</p>
          <p className="text-lg font-bold text-[#171A18] dark:text-[#EFF1F0] leading-tight">
            {item.current_stock}
            <span className="text-[10px] font-normal text-[#929994] ml-1">{item.unit}</span>
          </p>
        </div>
        <div className="bg-[#F9FAF9] dark:bg-white/[0.02] border border-[#E6E9E7] dark:border-white/[0.06] rounded-[7px] p-2.5 text-center">
          <p className="text-[10px] font-semibold text-[#929994] uppercase tracking-wider mb-0.5">Consumed</p>
          <p className="text-lg font-bold text-[#626A66] dark:text-[#9BA49E] leading-tight">
            {item.consumed_stock}
            <span className="text-[10px] font-normal text-[#929994] ml-1">{item.unit}</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#E6E9E7] dark:border-white/[0.07] flex items-center justify-between text-[11px] text-[#929994] bg-[#F9FAF9] dark:bg-white/[0.02]">
        <span>Min Threshold: {item.min_stock} {item.unit}</span>
        <button
          onClick={onAdjustStock}
          className="text-[#079B68] font-medium hover:underline cursor-pointer"
        >
          Adjust Stock
        </button>
      </div>
    </div>
  );
}

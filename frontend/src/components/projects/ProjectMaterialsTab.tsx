'use client';

import React from 'react';
import { MaterialInventory, MaterialMaster, MaterialRequest } from '../../types';
import { Package, AlertTriangle, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ProjectMaterialsTabProps {
  projectId: string;
  inventory: MaterialInventory[];
  masterMaterials: MaterialMaster[];
  requests: MaterialRequest[];
}

export function ProjectMaterialsTab({
  projectId,
  inventory,
  masterMaterials,
  requests,
}: ProjectMaterialsTabProps) {
  const router = useRouter();

  // Combine inventory with master catalog
  const inventoryWithDetails = inventory.map((item) => {
    const master = masterMaterials.find((m) => m.id === item.material_id);
    const minLevel = master?.minimum_stock_level || 0;
    const isLow = Number(item.current_stock) <= Number(minLevel);
    return {
      ...item,
      material_name: master?.material_name || 'Standard Material',
      unit: master?.unit || 'Units',
      min_level: minLevel,
      is_low: isLow,
    };
  });

  const projectRequests = requests.filter((r) => r.project_id === projectId);

  return (
    <div className="space-y-5">
      {/* ── Header Strip ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-4 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">Project Material Stock</h3>
          <p className="text-xs text-[#929994] mt-0.5">Real-time inventory levels allocated to this construction site</p>
        </div>
        <Button
          onClick={() => router.push('/materials')}
          className="h-8 px-3.5 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] gap-1.5 cursor-pointer shadow-sm shrink-0"
        >
          Manage Materials <ArrowUpRight size={13} />
        </Button>
      </div>

      {/* ── Stock Inventory Table ── */}
      {inventoryWithDetails.length === 0 ? (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-[10px] bg-[#E7F5EF] flex items-center justify-center mx-auto mb-3">
            <Package size={22} className="text-[#079B68]" />
          </div>
          <h4 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">No Materials Stocked on Site</h4>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-4">
            No material inventory has been allocated or delivered to this project yet.
          </p>
          <Button
            onClick={() => router.push('/materials')}
            className="h-8 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] cursor-pointer"
          >
            Allocate Materials
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02]">
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Material Name</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Opening</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Received</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Consumed</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Current Stock</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E7] dark:divide-white/[0.07]">
                {inventoryWithDetails.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F8F7] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                        {item.material_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#626A66] dark:text-[#9BA49E]">
                      {item.opening_stock} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#079B68] font-medium">
                      +{item.received_stock} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#B85B63] font-medium">
                      -{item.consumed_stock} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-[#171A18] dark:text-[#EFF1F0]">
                      {item.current_stock} <span className="text-xs font-normal text-[#929994]">{item.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      {item.is_low ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B85B63] bg-[#F9EDEF] px-2 py-0.5 rounded-full">
                          <AlertTriangle size={11} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#079B68] bg-[#E7F5EF] px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} /> Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Project Indents / Requests ── */}
      {projectRequests.length > 0 && (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#929994] mb-3">Recent Site Material Indents</h3>
          <div className="space-y-2">
            {projectRequests.slice(0, 5).map((req) => {
              const master = masterMaterials.find((m) => m.id === req.material_id);
              return (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-[8px] bg-[#F9FAF9] dark:bg-white/[0.02] border border-[#E6E9E7] dark:border-white/[0.06]"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                      {master?.material_name || 'Material Request'}
                    </p>
                    <p className="text-[10px] text-[#929994]">
                      Requested Qty: {req.quantity_requested} {master?.unit || ''} • {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EBF2FF] text-[#2563EB]">
                    {req.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

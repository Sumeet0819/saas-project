'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMaterialInventory, updateInventoryStock, createMaterialInventory } from '../../../store/slices/materialInventorySlice';
import { fetchMaterialMaster } from '../../../store/slices/materialMasterSlice';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import { Plus, Search, FileText, Package, PackageOpen, AlertTriangle, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataView, DataTable, DataGrid, MaterialInventoryCard, Column, InventoryItemDisplay } from '@/components/common/dataview';

export default function MaterialsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { inventory, status: invStatus } = useAppSelector((state) => state.materialInventory);
  const { materials: masterMaterials, status: masterStatus } = useAppSelector((state) => state.materialMaster);
  const { projects, status: projStatus } = useAppSelector((state) => state.projects);
  const { activeOrganizationId } = useAppSelector((state) => state.ui);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Stock Update Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateType, setUpdateType] = useState<'add' | 'consume'>('add');
  const [stockFormData, setStockFormData] = useState({
    project_id: '',
    material_id: '',
    quantity: 0,
  });

  useEffect(() => {
    if (invStatus === 'idle') dispatch(fetchMaterialInventory());
    if (masterStatus === 'idle') dispatch(fetchMaterialMaster());
    if (projStatus === 'idle') dispatch(fetchProjects());
  }, [invStatus, masterStatus, projStatus, dispatch]);

  const orgProjects = useMemo(() => {
    if (!activeOrganizationId) return projects;
    return projects.filter((p) => p.organization_id === activeOrganizationId);
  }, [projects, activeOrganizationId]);

  const orgProjectIds = useMemo(() => new Set(orgProjects.map((p) => p.id)), [orgProjects]);

  const displayInventory: InventoryItemDisplay[] = useMemo(() => {
    let filtered = inventory.filter((item) => orgProjectIds.has(item.project_id));

    if (selectedProjectId !== 'all') {
      filtered = filtered.filter((item) => item.project_id === selectedProjectId);
    }

    return filtered
      .map((item) => {
        const masterData = masterMaterials.find((m) => m.id === item.material_id);
        return {
          ...item,
          material_name: masterData?.material_name || `Material (ID: ${item.material_id.substring(0, 6)})`,
          unit: masterData?.unit || 'Units',
          min_stock: masterData?.minimum_stock_level || 0,
        };
      })
      .filter((item) => item.material_name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [inventory, masterMaterials, orgProjectIds, selectedProjectId, searchTerm]);

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockFormData.project_id || !stockFormData.material_id || stockFormData.quantity <= 0) return;

    const existingRecord = inventory.find(
      (i) => i.project_id === stockFormData.project_id && i.material_id === stockFormData.material_id
    );

    if (existingRecord) {
      const newReceived = updateType === 'add' ? existingRecord.received_stock + stockFormData.quantity : existingRecord.received_stock;
      const newConsumed = updateType === 'consume' ? existingRecord.consumed_stock + stockFormData.quantity : existingRecord.consumed_stock;
      const newCurrent = existingRecord.opening_stock + newReceived - newConsumed;

      await dispatch(
        updateInventoryStock({
          id: existingRecord.id,
          data: {
            received_stock: newReceived,
            consumed_stock: newConsumed,
            current_stock: newCurrent,
          },
        })
      );
    } else {
      if (updateType === 'consume') {
        alert('Cannot consume from an empty inventory allocation.');
        return;
      }
      await dispatch(
        createMaterialInventory({
          project_id: stockFormData.project_id,
          material_id: stockFormData.material_id,
          opening_stock: 0,
          received_stock: stockFormData.quantity,
          consumed_stock: 0,
          current_stock: stockFormData.quantity,
        })
      );
    }

    setIsModalOpen(false);
    setStockFormData({ project_id: '', material_id: '', quantity: 0 });
  };

  const columns: Column<InventoryItemDisplay>[] = [
    {
      key: 'material',
      header: 'Material Name',
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[7px] bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center shrink-0">
            <Package size={14} className="text-[#079B68]" />
          </div>
          <div>
            <span className="font-semibold text-sm text-[#171A18] dark:text-[#EFF1F0]">{item.material_name}</span>
            <span className="block text-[11px] text-[#929994]">ID: {item.material_id.slice(0, 8)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'project',
      header: 'Project',
      render: (item) => (
        <span className="text-xs text-[#626A66] dark:text-[#9BA49E]">
          {orgProjects.find((p) => p.id === item.project_id)?.project_name || 'Project'}
        </span>
      ),
    },
    {
      key: 'current',
      header: 'Current Stock',
      render: (item) => {
        const isCritical = item.current_stock <= item.min_stock * 0.5;
        const isLow = item.current_stock <= item.min_stock && !isCritical;
        return (
          <span className={`font-bold text-sm ${isCritical ? 'text-[#B85B63]' : isLow ? 'text-[#D5A04A]' : 'text-[#171A18] dark:text-[#EFF1F0]'}`}>
            {item.current_stock} <span className="text-xs font-normal text-[#929994]">{item.unit}</span>
          </span>
        );
      },
    },
    {
      key: 'consumed',
      header: 'Consumed',
      render: (item) => (
        <span className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
          {item.consumed_stock} {item.unit}
        </span>
      ),
    },
    {
      key: 'threshold',
      header: 'Stock Status',
      render: (item) => {
        const isCritical = item.current_stock <= item.min_stock * 0.5;
        const isLow = item.current_stock <= item.min_stock && !isCritical;
        const cfg = isCritical
          ? { bg: '#F9EDEF', text: '#B85B63', label: 'CRITICAL LOW' }
          : isLow
          ? { bg: '#FEF9EC', text: '#D5A04A', label: 'LOW STOCK' }
          : { bg: '#E7F5EF', text: '#079B68', label: 'IN STOCK' };

        return (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: cfg.bg, color: cfg.text }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: 'action',
      header: 'Adjust',
      align: 'right',
      render: (item) => (
        <button
          onClick={() => {
            setStockFormData({ project_id: item.project_id, material_id: item.material_id, quantity: 0 });
            setIsModalOpen(true);
          }}
          className="text-xs text-[#079B68] font-medium hover:underline cursor-pointer"
        >
          Adjust Stock
        </button>
      ),
    },
  ];

  const inputCls = "h-9 text-sm bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors";
  const selectTriggerCls = "h-9 text-sm bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] focus:ring-[#079B68]/20 focus:border-[#079B68] transition-colors";

  return (
    <>
      <DataView
        title="Material Inventory"
        subtitle="Track site inventory, stock arrivals, and project consumption"
        defaultViewMode="grid"
        action={
          <>
            <Button
              variant="outline"
              onClick={() => router.push('/materials/master')}
              className="h-9 px-3.5 text-xs font-medium border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] dark:text-[#EFF1F0] hover:bg-[#F5F6F5] rounded-[8px] shadow-sm gap-1.5 transition-colors cursor-pointer"
            >
              <ListPlus size={14} className="text-[#079B68]" />
              Material Catalog
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/materials/requests')}
              className="h-9 px-3.5 text-xs font-medium border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] dark:text-[#EFF1F0] hover:bg-[#F5F6F5] rounded-[8px] shadow-sm gap-1.5 transition-colors cursor-pointer"
            >
              <FileText size={14} className="text-[#2563EB]" />
              Purchase Requests
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 text-xs font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] shadow-sm gap-1.5 cursor-pointer transition-colors"
            >
              <Plus size={14} strokeWidth={2.25} />
              Update Stock
            </Button>
          </>
        }
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search material stock by name…"
        filterSlot={
          <div className="w-full sm:w-56">
            <Select value={selectedProjectId} onValueChange={(val) => setSelectedProjectId(val || 'all')}>
              <SelectTrigger className={selectTriggerCls}>
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {orgProjects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        isLoading={invStatus === 'loading' || masterStatus === 'loading'}
        isEmpty={displayInventory.length === 0}
        emptyIcon={PackageOpen}
        emptyTitle="No inventory records found"
        emptyDescription={
          searchTerm
            ? `No records match "${searchTerm}".`
            : 'Allocate material quantities to projects to start tracking inventory.'
        }
        emptyActionText="Add Stock Allocation"
        onEmptyAction={() => setIsModalOpen(true)}
        tableView={
          <DataTable
            columns={columns}
            data={displayInventory}
            keyExtractor={(item) => item.id}
          />
        }
        gridView={
          <DataGrid
            data={displayInventory}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              const projName = orgProjects.find((p) => p.id === item.project_id)?.project_name || 'Project';
              return (
                <MaterialInventoryCard
                  item={item}
                  projectName={projName}
                  onAdjustStock={() => {
                    setStockFormData({ project_id: item.project_id, material_id: item.material_id, quantity: 0 });
                    setIsModalOpen(true);
                  }}
                />
              );
            }}
          />
        }
      />

      {/* Update Stock Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Update Material Stock
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleStockUpdate} className="space-y-4 pt-2">
            <div className="flex gap-1 p-1 bg-[#F5F6F5] dark:bg-white/[0.04] rounded-[8px]">
              <button
                type="button"
                onClick={() => setUpdateType('add')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  updateType === 'add'
                    ? 'bg-white dark:bg-[#232622] text-[#079B68] shadow-sm'
                    : 'text-[#929994] hover:text-[#171A18]'
                }`}
              >
                + Add Stock (Received)
              </button>
              <button
                type="button"
                onClick={() => setUpdateType('consume')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-[6px] transition-all cursor-pointer ${
                  updateType === 'consume'
                    ? 'bg-white dark:bg-[#232622] text-[#B85B63] shadow-sm'
                    : 'text-[#929994] hover:text-[#171A18]'
                }`}
              >
                &minus; Consume Stock
              </button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66]">Project *</Label>
              <Select
                value={stockFormData.project_id}
                onValueChange={(val) => setStockFormData((prev) => ({ ...prev, project_id: val || '' }))}
              >
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {orgProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66]">Material *</Label>
              <Select
                value={stockFormData.material_id}
                onValueChange={(val) => setStockFormData((prev) => ({ ...prev, material_id: val || '' }))}
              >
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select Material" />
                </SelectTrigger>
                <SelectContent>
                  {masterMaterials.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.material_name} ({m.unit})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66]">
                {updateType === 'add' ? 'Quantity Received' : 'Quantity Consumed'} *
              </Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={stockFormData.quantity || ''}
                onChange={(e) => setStockFormData((prev) => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                required
                className={inputCls}
                placeholder="0.00"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-[#E6E9E7] dark:border-white/[0.07] gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="h-8 text-xs rounded-[7px] border-[#E6E9E7] text-[#626A66] hover:bg-[#F5F6F5]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`h-8 text-xs font-medium text-white rounded-[7px] shadow-sm ${
                  updateType === 'consume' ? 'bg-[#B85B63] hover:bg-[#A34B53]' : 'bg-[#079B68] hover:bg-[#087A55]'
                }`}
              >
                {updateType === 'add' ? 'Add Stock' : 'Record Consumption'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

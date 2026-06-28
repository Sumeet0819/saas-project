'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchMaterialInventory, updateInventoryStock, createMaterialInventory } from '../../../store/slices/materialInventorySlice';
import { fetchMaterialMaster } from '../../../store/slices/materialMasterSlice';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import { Plus, Search, FileText, Package, PackageOpen, AlertTriangle, CheckCircle2, ListPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { motion } from 'framer-motion';

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
    quantity: 0
  });

  useEffect(() => {
    if (invStatus === 'idle') dispatch(fetchMaterialInventory());
    if (masterStatus === 'idle') dispatch(fetchMaterialMaster());
    if (projStatus === 'idle') dispatch(fetchProjects());
  }, [invStatus, masterStatus, projStatus, dispatch]);

  const orgProjects = useMemo(() => {
    if (!activeOrganizationId) return [];
    return projects.filter(p => p.organization_id === activeOrganizationId);
  }, [projects, activeOrganizationId]);

  const orgProjectIds = useMemo(() => new Set(orgProjects.map(p => p.id)), [orgProjects]);

  const displayInventory = useMemo(() => {
    let filtered = inventory.filter(item => orgProjectIds.has(item.project_id));
    
    if (selectedProjectId !== 'all') {
      filtered = filtered.filter(item => item.project_id === selectedProjectId);
    }
    
    return filtered.map(item => {
      const masterData = masterMaterials.find(m => m.id === item.material_id);
      return {
        ...item,
        material_name: masterData?.material_name || `Unknown (ID: ${item.material_id.substring(0,6)})`,
        unit: masterData?.unit || 'Unit',
        min_stock: masterData?.minimum_stock_level || 0
      };
    }).filter(item => item.material_name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [inventory, masterMaterials, orgProjectIds, selectedProjectId, searchTerm]);

  const handleStockUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockFormData.project_id || !stockFormData.material_id || stockFormData.quantity <= 0) return;
    
    // Find existing inventory record
    const existingRecord = inventory.find(
      i => i.project_id === stockFormData.project_id && i.material_id === stockFormData.material_id
    );

    if (existingRecord) {
      // Update existing
      const newReceived = updateType === 'add' ? existingRecord.received_stock + stockFormData.quantity : existingRecord.received_stock;
      const newConsumed = updateType === 'consume' ? existingRecord.consumed_stock + stockFormData.quantity : existingRecord.consumed_stock;
      const newCurrent = existingRecord.opening_stock + newReceived - newConsumed;
      
      await dispatch(updateInventoryStock({
        id: existingRecord.id,
        data: {
          received_stock: newReceived,
          consumed_stock: newConsumed,
          current_stock: newCurrent
        }
      }));
    } else {
      // Create new allocation
      if (updateType === 'consume') {
        alert('Cannot consume from an empty inventory allocation.');
        return;
      }
      await dispatch(createMaterialInventory({
        project_id: stockFormData.project_id,
        material_id: stockFormData.material_id,
        opening_stock: 0,
        received_stock: stockFormData.quantity,
        consumed_stock: 0,
        current_stock: stockFormData.quantity
      }));
    }

    setIsModalOpen(false);
    setStockFormData({ project_id: '', material_id: '', quantity: 0 });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-primary h-8 w-8" />
            Material Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track material stock and consumption across your projects.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
            onClick={() => router.push('/materials/master')}
          >
            <ListPlus className="mr-2 h-4 w-4 text-emerald-500" />
            Material Catalog
          </Button>
          <Button 
            variant="outline" 
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
            onClick={() => router.push('/materials/requests')}
          >
            <FileText className="mr-2 h-4 w-4 text-blue-500" />
            Purchase Orders
          </Button>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Update Stock
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl w-full focus-visible:ring-primary/20"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedProjectId} onValueChange={(val) => setSelectedProjectId(val || 'all')}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {orgProjects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {invStatus === 'loading' || masterStatus === 'loading' ? (
        <div className="flex justify-center p-24">
          <ConstructionLoader size="md" />
        </div>
      ) : (
        <div className="w-full">
          {displayInventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <PackageOpen className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No inventory records found</h3>
              <p className="text-gray-500 text-sm">Add some materials via "Update Stock".</p>
            </div>
          ) : (
            <motion.div 
              initial={{opacity: 0, y: 10}} 
              animate={{opacity: 1, y: 0}} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayInventory.map((item, i) => {
                const isCritical = item.current_stock <= (item.min_stock * 0.5); // <= 50% of min stock
                const isLow = item.current_stock <= item.min_stock && item.current_stock > (item.min_stock * 0.5); // Between 50% and 100% of min stock
                const projName = orgProjects.find(p => p.id === item.project_id)?.project_name || 'Unknown Project';

                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.id}
                  >
                    <Card className={`rounded-2xl border ${isCritical ? 'border-destructive/30 shadow-destructive/5' : isLow ? 'border-amber-500/30 shadow-amber-500/5' : 'border-gray-100 dark:border-gray-800'} shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all h-full flex flex-col overflow-hidden`}>
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className={`px-5 py-3 border-b ${isCritical ? 'bg-destructive/5 border-destructive/10' : isLow ? 'bg-amber-500/5 border-amber-500/10' : 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800'}`}>
                           <div className="text-[10px] font-bold text-primary/80 uppercase tracking-wider mb-1">
                             {projName}
                           </div>
                           <div className="flex justify-between items-start">
                             <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight pr-2">
                               {item.material_name}
                             </h3>
                             <div className={`p-1.5 rounded-lg shrink-0 ${isCritical ? 'bg-destructive/10 text-destructive' : isLow ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              {isCritical ? <AlertTriangle size={14} /> : isLow ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                             </div>
                           </div>
                        </div>
                        
                        <div className="p-5 flex gap-3 grow">
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex-1 border border-gray-100 dark:border-gray-800 text-center">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Current Stock</div>
                            <div className={`text-2xl font-black flex items-baseline justify-center gap-1 ${isCritical ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
                              {item.current_stock}
                              <span className="text-[10px] text-gray-500 font-bold">{item.unit}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex-1 border border-gray-100 dark:border-gray-800 text-center">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Consumed</div>
                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300 flex items-baseline justify-center gap-1">
                              {item.consumed_stock}
                              <span className="text-[10px] text-gray-500 font-bold">{item.unit}</span>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto bg-gray-50/50 dark:bg-gray-800/20">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                            isCritical ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                            isLow ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                            'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          }`}>
                            {isCritical ? 'CRITICAL STOCK' : isLow ? 'LOW STOCK' : 'STOCK OK'}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-400">Min: {item.min_stock} {item.unit}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}

      {/* Update Stock Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Package className="text-primary w-5 h-5" />
              Update Material Stock
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStockUpdate} className="space-y-4 py-4">
            
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
              <button 
                type="button"
                onClick={() => setUpdateType('add')}
                className={`flex-1 text-sm font-bold py-2 rounded-lg transition-all ${updateType === 'add' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
              >
                Add Stock
              </button>
              <button 
                type="button"
                onClick={() => setUpdateType('consume')}
                className={`flex-1 text-sm font-bold py-2 rounded-lg transition-all ${updateType === 'consume' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
              >
                Consume Stock
              </button>
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={stockFormData.project_id} onValueChange={(val) => setStockFormData({...stockFormData, project_id: val || ''})} required>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {orgProjects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.project_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Material</Label>
              <Select value={stockFormData.material_id} onValueChange={(val) => setStockFormData({...stockFormData, material_id: val || ''})} required>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select Material" />
                </SelectTrigger>
                <SelectContent>
                  {masterMaterials.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.material_name} ({m.unit})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{updateType === 'add' ? 'Quantity Received' : 'Quantity Consumed'}</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={stockFormData.quantity || ''}
                onChange={(e) => setStockFormData({...stockFormData, quantity: parseFloat(e.target.value) || 0})}
                required
                className="rounded-xl border-gray-200"
              />
            </div>
            
            <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className={`rounded-xl ${updateType === 'consume' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white`}>
                {updateType === 'add' ? 'Add Stock' : 'Log Consumption'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

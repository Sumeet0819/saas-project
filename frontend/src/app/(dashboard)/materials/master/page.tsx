'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchMaterialMaster, createMaterialMaster, deleteMaterialMaster, updateMaterialMaster } from '../../../../store/slices/materialMasterSlice';
import { Plus, Search, Layers, Box, Settings2, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function MaterialMasterPage() {
  const dispatch = useAppDispatch();
  const { materials, status } = useAppSelector((state) => state.materialMaster);
  const { user } = useAppSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    material_name: '',
    unit: '',
    minimum_stock_level: 0
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMaterialMaster());
    }
  }, [status, dispatch]);

  const filteredMaterials = materials.filter(m => 
    m.material_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createMaterialMaster(formData));
    setIsModalOpen(false);
    setFormData({ material_name: '', unit: '', minimum_stock_level: 0 });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material from the master catalog?')) {
      await dispatch(deleteMaterialMaster(id));
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="text-primary h-8 w-8" />
            Material Master
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Global catalog of all materials used across projects.</p>
        </div>
        
        {/* Only admins or managers should typically add to the master catalog */}
        {(user?.role === 'Admin' || user?.role === 'Project Manager') && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Material
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl w-full focus-visible:ring-primary/20"
            placeholder="Search material name or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {status === 'loading' ? (
        <div className="flex justify-center p-24">
          <ConstructionLoader size="md" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          {filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Box className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No materials found</h3>
              <p className="text-gray-500 text-sm">Create a new material to add it to the global catalog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Material Name</th>
                    <th className="py-4 px-6">Unit of Measurement</th>
                    <th className="py-4 px-6">Global Min Stock</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 text-sm">
                  {filteredMaterials.map((material, i) => (
                    <motion.tr 
                      key={material.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        {material.material_name}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                          {material.unit}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">
                        {material.minimum_stock_level}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                          <Edit size={16} />
                        </Button>
                        {(user?.role === 'Admin' || user?.role === 'Project Manager') && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-destructive" onClick={() => handleDelete(material.id)}>
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Settings2 className="text-primary w-5 h-5" />
              New Master Material
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="material_name">Material Name</Label>
              <Input
                id="material_name"
                placeholder="e.g. Portland Cement Grade 53"
                value={formData.material_name}
                onChange={(e) => setFormData({...formData, material_name: e.target.value})}
                required
                className="rounded-xl border-gray-200"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="e.g. Bags, Tons, LTR"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  required
                  className="rounded-xl border-gray-200 uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_stock">Minimum Stock</Label>
                <Input
                  id="min_stock"
                  type="number"
                  min="0"
                  value={formData.minimum_stock_level}
                  onChange={(e) => setFormData({...formData, minimum_stock_level: parseInt(e.target.value) || 0})}
                  required
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>
            
            <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90">Save Material</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

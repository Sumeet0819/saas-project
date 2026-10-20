'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchMaterialMaster, createMaterialMaster, deleteMaterialMaster } from '../../../../store/slices/materialMasterSlice';
import { Plus, Search, Box, Trash2, ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

const fade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function MaterialMasterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { materials, status } = useAppSelector((state) => state.materialMaster);
  const { user } = useAppSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    material_name: '',
    unit: '',
    minimum_stock_level: 0,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMaterialMaster());
    }
  }, [status, dispatch]);

  const filteredMaterials = (materials || []).filter(
    (m) =>
      m.material_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.material_name.trim() || !formData.unit.trim()) return;
    await dispatch(createMaterialMaster(formData));
    setIsModalOpen(false);
    setFormData({ material_name: '', unit: '', minimum_stock_level: 0 });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this item from the global material catalog?')) {
      await dispatch(deleteMaterialMaster(id));
    }
  };

  const inputCls = "h-9 text-sm bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/materials')}
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] transition-colors cursor-pointer shadow-[0_1px_2px_rgba(16,24,20,0.06)]"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">Material Catalog</h1>
            <p className="text-xs text-[#929994] mt-0.5">
              {(materials || []).length} global master material specifications
            </p>
          </div>
        </div>

        {(user?.role === 'Admin' || user?.role === 'Project Manager') && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 text-xs font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] shadow-sm gap-1.5 cursor-pointer transition-colors"
          >
            <Plus size={14} strokeWidth={2.25} />
            Add Master Material
          </Button>
        )}
      </motion.div>

      {/* Search */}
      <motion.div variants={fade} className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" strokeWidth={1.75} />
          <Input
            className={`pl-9 ${inputCls}`}
            placeholder="Search material by name or unit…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Table list */}
      {status === 'loading' ? (
        <div className="flex justify-center items-center py-24">
          <ConstructionLoader size="md" />
        </div>
      ) : filteredMaterials.length === 0 ? (
        <motion.div
          variants={fade}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-12 text-center shadow-[0_1px_4px_rgba(16,24,20,0.06)]"
        >
          <div className="w-12 h-12 bg-[#F5F6F5] dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
            <Box size={20} className="text-[#929994]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">No catalog materials found</p>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-5">
            {searchTerm ? `No results match "${searchTerm}".` : 'Add standard construction materials to make them available across all project inventories.'}
          </p>
          {(user?.role === 'Admin' || user?.role === 'Project Manager') && (
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-8 text-xs bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] cursor-pointer"
            >
              <Plus size={13} className="mr-1" /> Add Material
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={fade}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02]">
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994]">Material Name</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994]">Unit of Measure</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994]">Default Threshold</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E7] dark:divide-white/[0.05] text-sm">
                <AnimatePresence>
                  {filteredMaterials.map((material) => (
                    <motion.tr
                      key={material.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-[#F9FAF9] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-[6px] bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center shrink-0">
                            <Box size={14} className="text-[#079B68]" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[#171A18] dark:text-[#EFF1F0]">
                              {material.material_name}
                            </span>
                            <span className="block text-[11px] text-[#929994]">ID: {material.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded-[5px] bg-[#F5F6F5] dark:bg-white/[0.04] text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] uppercase tracking-wide border border-[#E6E9E7] dark:border-white/[0.08]">
                          {material.unit}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-[#626A66] dark:text-[#9BA49E]">
                        <span className="font-semibold text-[#171A18] dark:text-[#EFF1F0]">{material.minimum_stock_level}</span> {material.unit}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        {(user?.role === 'Admin' || user?.role === 'Project Manager') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-[#929994] hover:text-[#B85B63] hover:bg-[#F9EDEF] rounded-[6px] cursor-pointer"
                            onClick={() => handleDelete(material.id)}
                            title="Delete Material"
                          >
                            <Trash2 size={13} />
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Add Master Material
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Material Name <span className="text-[#B85B63]">*</span>
              </Label>
              <Input
                id="material_name"
                placeholder="e.g. Portland Cement Grade 53"
                value={formData.material_name}
                onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
                required
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                  Unit <span className="text-[#B85B63]">*</span>
                </Label>
                <Input
                  id="unit"
                  placeholder="e.g. Bags, Tons, LTR"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                  className={`${inputCls} uppercase`}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                  Minimum Stock
                </Label>
                <Input
                  id="min_stock"
                  type="number"
                  min="0"
                  value={formData.minimum_stock_level}
                  onChange={(e) => setFormData({ ...formData, minimum_stock_level: parseInt(e.target.value) || 0 })}
                  required
                  className={inputCls}
                />
              </div>
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
                className="h-8 text-xs font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] shadow-sm"
              >
                Save Material
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchMaterialRequests, createMaterialRequest, updateMaterialRequest } from '../../../../store/slices/materialRequestsSlice';
import { fetchMaterialMaster } from '../../../../store/slices/materialMasterSlice';
import { fetchProjects } from '../../../../store/slices/projectsSlice';
import { Plus, Search, ArrowLeft, ClipboardList, Clock, CheckCircle2, Truck, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { RequestStatus } from '../../../../types';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

const fade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const STATUS_CONFIG: Record<RequestStatus, { bg: string; text: string; dot: string; icon: React.ElementType }> = {
  Pending:   { bg: '#FEF9EC', text: '#D5A04A', dot: '#D5A04A', icon: Clock },
  Approved:  { bg: '#E7F5EF', text: '#079B68', dot: '#079B68', icon: CheckCircle2 },
  Ordered:   { bg: '#EBF2FF', text: '#2563EB', dot: '#2563EB', icon: ClipboardList },
  Delivered: { bg: '#F3EFFE', text: '#7C4DFF', dot: '#7C4DFF', icon: Truck },
  Cancelled: { bg: '#F9EDEF', text: '#B85B63', dot: '#B85B63', icon: XCircle },
};

export default function MaterialRequestsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { requests, status: reqStatus } = useAppSelector((state) => state.materialRequests);
  const { materials: masterMaterials, status: masterStatus } = useAppSelector((state) => state.materialMaster);
  const { projects, status: projStatus } = useAppSelector((state) => state.projects);
  const { activeOrganizationId } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    material_id: '',
    quantity_requested: 0,
  });

  useEffect(() => {
    if (reqStatus === 'idle') dispatch(fetchMaterialRequests());
    if (masterStatus === 'idle') dispatch(fetchMaterialMaster());
    if (projStatus === 'idle') dispatch(fetchProjects());
  }, [reqStatus, masterStatus, projStatus, dispatch]);

  const orgProjects = useMemo(() => {
    if (!activeOrganizationId) return projects;
    return projects.filter((p) => p.organization_id === activeOrganizationId);
  }, [projects, activeOrganizationId]);

  const orgProjectIds = useMemo(() => new Set(orgProjects.map((p) => p.id)), [orgProjects]);

  const displayRequests = useMemo(() => {
    let filtered = requests.filter((item) => orgProjectIds.has(item.project_id));

    if (selectedProjectId !== 'all') {
      filtered = filtered.filter((item) => item.project_id === selectedProjectId);
    }

    return filtered
      .map((item) => {
        const masterData = masterMaterials.find((m) => m.id === item.material_id);
        return {
          ...item,
          material_name: masterData?.material_name || `Unknown (ID: ${item.material_id?.substring(0, 6)})`,
          unit: masterData?.unit || 'Units',
        };
      })
      .filter((item) => item.material_name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [requests, masterMaterials, orgProjectIds, selectedProjectId, searchTerm]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id || !formData.material_id || formData.quantity_requested <= 0) return;

    await dispatch(
      createMaterialRequest({
        project_id: formData.project_id,
        material_id: formData.material_id,
        quantity_requested: formData.quantity_requested,
        requested_by: user?.id,
        status: 'Pending',
      })
    );

    setIsModalOpen(false);
    setFormData({ project_id: '', material_id: '', quantity_requested: 0 });
  };

  const handleStatusUpdate = async (id: string, newStatus: RequestStatus) => {
    await dispatch(
      updateMaterialRequest({
        id,
        data: { status: newStatus },
      })
    );
  };

  const inputCls = "h-9 text-sm bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors";
  const selectTriggerCls = "h-9 text-sm bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] focus:ring-[#079B68]/20 focus:border-[#079B68] transition-colors";

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
            <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">Material Requests</h1>
            <p className="text-xs text-[#929994] mt-0.5">Manage material purchase requests and delivery pipelines</p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 text-xs font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] shadow-sm gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={14} strokeWidth={2.25} />
          New Request
        </Button>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" strokeWidth={1.75} />
          <Input
            className={`pl-9 ${inputCls}`}
            placeholder="Search material request by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
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
      </motion.div>

      {/* Content */}
      {reqStatus === 'loading' || masterStatus === 'loading' ? (
        <div className="flex justify-center items-center py-24">
          <ConstructionLoader size="md" />
        </div>
      ) : displayRequests.length === 0 ? (
        <motion.div
          variants={fade}
          className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-12 text-center shadow-[0_1px_4px_rgba(16,24,20,0.06)]"
        >
          <div className="w-12 h-12 bg-[#F5F6F5] dark:bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-3">
            <ClipboardList size={20} className="text-[#929994]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">No requests found</p>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-5">
            {searchTerm ? `No requests match "${searchTerm}".` : 'Create a material requisition to start the procurement process.'}
          </p>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 text-xs bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] cursor-pointer"
          >
            <Plus size={13} className="mr-1" /> New Requisition
          </Button>
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
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994]">Material</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994]">Project</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994]">Requested Quantity</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994]">Status</th>
                  <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#929994] text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E7] dark:divide-white/[0.05] text-sm">
                <AnimatePresence>
                  {displayRequests.map((req) => {
                    const cfg = STATUS_CONFIG[req.status] || { bg: '#F5F6F5', text: '#929994', dot: '#929994', icon: Clock };
                    const StatusIcon = cfg.icon;

                    return (
                      <motion.tr
                        key={req.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-[#F9FAF9] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-3.5 font-semibold text-sm text-[#171A18] dark:text-[#EFF1F0]">
                          {req.material_name}
                        </td>

                        <td className="px-5 py-3.5 text-xs text-[#626A66] dark:text-[#9BA49E]">
                          {orgProjects.find((p) => p.id === req.project_id)?.project_name || 'Project'}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="font-bold text-sm text-[#171A18] dark:text-[#EFF1F0]">{req.quantity_requested}</span>
                          <span className="text-xs text-[#929994] ml-1">{req.unit}</span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{ background: cfg.bg, color: cfg.text }}
                          >
                            <StatusIcon size={12} strokeWidth={2} />
                            {req.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <Select
                            value={req.status}
                            onValueChange={(val) => {
                              if (val) handleStatusUpdate(req.id, val as RequestStatus);
                            }}
                          >
                            <SelectTrigger className="w-[130px] ml-auto h-7 text-xs rounded-[6px] border-[#E6E9E7] dark:border-white/[0.08]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Ordered">Ordered</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Create Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              New Material Request
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateRequest} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">Project *</Label>
              <Select
                value={formData.project_id}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, project_id: val || '' }))}
                required
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
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">Material *</Label>
              <Select
                value={formData.material_id}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, material_id: val || '' }))}
                required
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
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">Quantity Requested *</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.quantity_requested || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity_requested: parseFloat(e.target.value) || 0 }))}
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
                className="h-8 text-xs font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] shadow-sm"
              >
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

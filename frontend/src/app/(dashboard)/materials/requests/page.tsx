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
import { motion } from 'framer-motion';
import { RequestStatus } from '../../../../types';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

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
    quantity_requested: 0
  });

  useEffect(() => {
    if (reqStatus === 'idle') dispatch(fetchMaterialRequests());
    if (masterStatus === 'idle') dispatch(fetchMaterialMaster());
    if (projStatus === 'idle') dispatch(fetchProjects());
  }, [reqStatus, masterStatus, projStatus, dispatch]);

  const orgProjects = useMemo(() => {
    if (!activeOrganizationId) return [];
    return projects.filter(p => p.organization_id === activeOrganizationId);
  }, [projects, activeOrganizationId]);

  const orgProjectIds = useMemo(() => new Set(orgProjects.map(p => p.id)), [orgProjects]);

  const displayRequests = useMemo(() => {
    let filtered = requests.filter(item => orgProjectIds.has(item.project_id));
    
    if (selectedProjectId !== 'all') {
      filtered = filtered.filter(item => item.project_id === selectedProjectId);
    }
    
    return filtered.map(item => {
      const masterData = masterMaterials.find(m => m.id === item.material_id);
      return {
        ...item,
        material_name: masterData?.material_name || `Unknown (ID: ${item.material_id?.substring(0,6)})`,
        unit: masterData?.unit || 'Unit'
      };
    }).filter(item => item.material_name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [requests, masterMaterials, orgProjectIds, selectedProjectId, searchTerm]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id || !formData.material_id || formData.quantity_requested <= 0) return;
    
    await dispatch(createMaterialRequest({
      project_id: formData.project_id,
      material_id: formData.material_id,
      quantity_requested: formData.quantity_requested,
      requested_by: user?.id,
      status: 'Pending'
    }));

    setIsModalOpen(false);
    setFormData({ project_id: '', material_id: '', quantity_requested: 0 });
  };

  const handleStatusUpdate = async (id: string, newStatus: RequestStatus) => {
    await dispatch(updateMaterialRequest({
      id,
      data: { status: newStatus }
    }));
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch(status) {
      case 'Pending': return <Clock size={16} className="text-amber-500" />;
      case 'Approved': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'Ordered': return <ClipboardList size={16} className="text-blue-500" />;
      case 'Delivered': return <Truck size={16} className="text-indigo-500" />;
      case 'Cancelled': return <XCircle size={16} className="text-destructive" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: RequestStatus) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Ordered': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Delivered': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'Cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/materials')} className="text-gray-500 -ml-2">
              <ArrowLeft size={16} className="mr-1" /> Back to Inventory
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="text-blue-500 h-8 w-8" />
            Material Requests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage purchase orders and track material procurement pipeline.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl w-full focus-visible:ring-primary/20"
            placeholder="Search material name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedProjectId} onValueChange={(val) => setSelectedProjectId(val || '')}>
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

      {/* List */}
      {reqStatus === 'loading' || masterStatus === 'loading' ? (
        <div className="flex justify-center p-24">
          <ConstructionLoader size="md" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          {displayRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <ClipboardList className="text-blue-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No requests found</h3>
              <p className="text-gray-500 text-sm">Create a new request to start tracking procurement.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Material</th>
                    <th className="py-4 px-6">Project</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 text-sm">
                  {displayRequests.map((req, i) => (
                    <motion.tr 
                      key={req.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        {req.material_name}
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">
                        {orgProjects.find(p => p.id === req.project_id)?.project_name || 'Unknown'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-900 dark:text-white">{req.quantity_requested}</span>
                        <span className="text-xs text-gray-500 ml-1">{req.unit}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBadgeClass(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {req.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Select value={req.status} onValueChange={(val) => { if (val) handleStatusUpdate(req.id, val as RequestStatus) }}>
                          <SelectTrigger className="w-[140px] ml-auto h-8 text-xs font-semibold rounded-lg">
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="text-blue-500 w-5 h-5" />
              New Material Request
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateRequest} className="space-y-4 py-4">
            
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={formData.project_id} onValueChange={(val) => setFormData({...formData, project_id: val || ''})} required>
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
              <Select value={formData.material_id} onValueChange={(val) => setFormData({...formData, material_id: val || ''})} required>
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
              <Label>Quantity Requested</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.quantity_requested || ''}
                onChange={(e) => setFormData({...formData, quantity_requested: parseFloat(e.target.value) || 0})}
                required
                className="rounded-xl border-gray-200"
              />
            </div>
            
            <DialogFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

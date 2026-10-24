'use client';

import React, { useState } from 'react';
import { SiteActivity, ActivityStatus } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { updateSiteActivity, createSiteActivity } from '../../store/slices/siteActivitiesSlice';
import { CheckCircle2, Clock, AlertCircle, Plus, Search, Filter, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

interface ProjectActivitiesTabProps {
  projectId: string;
  activities: SiteActivity[];
}

const STATUS_CONFIG: Record<ActivityStatus, { bg: string; text: string; icon: React.ElementType }> = {
  Pending: { bg: '#FEF9EC', text: '#D5A04A', icon: AlertCircle },
  'In Progress': { bg: '#EBF2FF', text: '#2563EB', icon: Clock },
  Completed: { bg: '#E7F5EF', text: '#079B68', icon: CheckCircle2 },
};

export function ProjectActivitiesTab({ projectId, activities }: ProjectActivitiesTabProps) {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    activity_name: '',
    floor_number: '',
    location: '',
    quantity: '',
    unit: 'sq.m',
    status: 'In Progress' as ActivityStatus,
  });

  const handleStatusToggle = async (activity: SiteActivity) => {
    const nextStatusMap: Record<ActivityStatus, ActivityStatus> = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'In Progress',
    };
    const nextStatus = nextStatusMap[activity.status];
    await dispatch(updateSiteActivity({ id: activity.id, body: { status: nextStatus } }));
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.activity_name.trim()) return;

    setSubmitting(true);
    try {
      await dispatch(
        createSiteActivity({
          project_id: projectId,
          activity_name: formData.activity_name.trim(),
          floor_number: formData.floor_number.trim() || undefined,
          location: formData.location.trim() || undefined,
          quantity: formData.quantity ? Number(formData.quantity) : undefined,
          unit: formData.unit.trim() || undefined,
          status: formData.status,
        })
      ).unwrap();
      setFormData({
        activity_name: '',
        floor_number: '',
        location: '',
        quantity: '',
        unit: 'sq.m',
        status: 'In Progress',
      });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to create site activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = activities.filter((act) => {
    const matchesSearch =
      act.activity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.location && act.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (act.floor_number && act.floor_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || act.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const inputCls =
    'h-9 text-xs bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors';

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]" />
            <Input
              placeholder="Search tasks, floors, locations…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-9 ${inputCls}`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Pending', 'In Progress', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === s
                    ? 'bg-[#E7F5EF] text-[#079B68] dark:bg-[rgba(7,155,104,0.15)]'
                    : 'text-[#929994] hover:text-[#171A18]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors shrink-0"
        >
          <Plus size={14} strokeWidth={2.25} /> Add Task
        </Button>
      </div>

      {/* Activities Table / List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-[10px] bg-[#E7F5EF] flex items-center justify-center mx-auto mb-3">
            <Layers size={22} className="text-[#079B68]" />
          </div>
          <h4 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">No Site Tasks Found</h4>
          <p className="text-xs text-[#929994] max-w-sm mx-auto mb-4">
            {searchTerm || statusFilter !== 'All'
              ? 'No activities match your filters. Reset search to view all.'
              : 'Add floor-by-floor site activities like rebar tying, shuttering, or plastering.'}
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[7px] cursor-pointer"
          >
            Add First Site Activity
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E9E7] dark:border-white/[0.07] bg-[#F9FAF9] dark:bg-white/[0.02]">
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Activity Name</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Floor / Location</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Quantity</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">Status</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#929994] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E9E7] dark:divide-white/[0.07]">
                {filtered.map((activity) => {
                  const cfg = STATUS_CONFIG[activity.status] || STATUS_CONFIG.Pending;
                  const Icon = cfg.icon;

                  return (
                    <tr
                      key={activity.id}
                      className="hover:bg-[#F7F8F7] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
                          {activity.activity_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#626A66] dark:text-[#9BA49E]">
                        {activity.floor_number ? `Floor: ${activity.floor_number}` : ''}
                        {activity.floor_number && activity.location ? ' • ' : ''}
                        {activity.location || (activity.floor_number ? '' : 'General Site')}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-[#171A18] dark:text-[#EFF1F0]">
                        {activity.quantity ? `${activity.quantity} ${activity.unit || ''}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: cfg.bg, color: cfg.text }}
                        >
                          <Icon size={12} />
                          {activity.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusToggle(activity)}
                          className="h-7 px-2.5 text-xs text-[#079B68] hover:bg-[#E7F5EF] dark:hover:bg-[rgba(7,155,104,0.15)] rounded-[6px] cursor-pointer"
                        >
                          Toggle Status
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[12px] p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Add Site Activity / Task
            </DialogTitle>
            <p className="text-xs text-[#929994]">Define a floor-wise execution task for progress tracking.</p>
          </DialogHeader>

          <form onSubmit={handleCreateActivity} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Activity Name *</Label>
              <Input
                required
                placeholder="e.g. Column Concrete Pouring"
                value={formData.activity_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, activity_name: e.target.value }))}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Floor Number</Label>
                <Input
                  placeholder="e.g. 4th Floor"
                  value={formData.floor_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, floor_number: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Location / Grid</Label>
                <Input
                  placeholder="e.g. Wing B, Grid 4-8"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Quantity</Label>
                <Input
                  type="number"
                  placeholder="e.g. 150"
                  value={formData.quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Unit</Label>
                <Input
                  placeholder="e.g. cu.m, sq.m, tonnes"
                  value={formData.unit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: (val || 'In Progress') as ActivityStatus }))
                }
              >
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08]">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={submitting}
                className="h-9 px-4 text-xs rounded-[8px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !formData.activity_name.trim()}
                className="h-9 px-4 text-xs font-semibold bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] cursor-pointer"
              >
                {submitting ? 'Saving…' : 'Add Activity'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

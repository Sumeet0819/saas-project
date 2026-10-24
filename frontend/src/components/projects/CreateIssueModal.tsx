'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { createSiteIssue } from '../../store/slices/siteIssuesSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { IssueCategory, IssuePriority } from '../../types';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function CreateIssueModal({ isOpen, onClose, projectId }: CreateIssueModalProps) {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Safety' as IssueCategory,
    priority: 'Medium' as IssuePriority,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    try {
      await dispatch(
        createSiteIssue({
          project_id: projectId,
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          priority: formData.priority,
          status: 'Open',
        })
      ).unwrap();
      setFormData({
        title: '',
        description: '',
        category: 'Safety',
        priority: 'Medium',
      });
      onClose();
    } catch (err) {
      console.error('Failed to create issue:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'h-9 text-sm bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[8px] text-[#171A18] dark:text-[#EFF1F0] placeholder:text-[#929994] focus-visible:border-[#079B68] focus-visible:ring-[#079B68]/20 transition-colors';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08] rounded-[12px] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-[7px] bg-[#F9EDEF] flex items-center justify-center">
              <AlertTriangle size={16} className="text-[#B85B63]" />
            </div>
            <DialogTitle className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Report Site Issue / Snag
            </DialogTitle>
          </div>
          <p className="text-xs text-[#929994]">
            Log a safety concern, quality defect, or delay blocker for this site.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Issue Title <span className="text-[#B85B63]">*</span>
            </Label>
            <Input
              required
              placeholder="e.g. Missing safety railing on 4th floor slab"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: (val || 'Safety') as IssueCategory }))
                }
              >
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08]">
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Labour">Labour</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Weather">Weather</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, priority: (val || 'Medium') as IssuePriority }))
                }
              >
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1B1E1C] border-[#E6E9E7] dark:border-white/[0.08]">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Description</Label>
            <textarea
              rows={3}
              placeholder="Provide exact location, contractor gang involved, and observed risk..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className={`w-full p-2.5 ${inputCls} resize-none`}
            />
          </div>

          <DialogFooter className="pt-2 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="h-9 px-4 text-xs font-medium rounded-[8px] border-[#E6E9E7] dark:border-white/[0.08] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !formData.title.trim()}
              className="h-9 px-4 text-xs font-medium bg-[#B85B63] hover:bg-[#A34B53] text-white rounded-[8px] cursor-pointer"
            >
              {submitting ? 'Reporting…' : 'Report Issue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

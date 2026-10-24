'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { createDailyLog } from '../../store/slices/dailyLogsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClipboardList, Calendar } from 'lucide-react';

interface CreateDprModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function CreateDprModal({ isOpen, onClose, projectId }: CreateDprModalProps) {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    log_date: todayStr,
    progress_update: '',
    photo_link: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.progress_update.trim()) return;

    setSubmitting(true);
    try {
      await dispatch(
        createDailyLog({
          project_id: projectId,
          log_date: formData.log_date,
          progress_update: formData.progress_update.trim(),
          photo_link: formData.photo_link.trim() || undefined,
        })
      ).unwrap();
      setFormData({
        log_date: todayStr,
        progress_update: '',
        photo_link: '',
      });
      onClose();
    } catch (err) {
      console.error('Failed to create daily log:', err);
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
            <div className="w-8 h-8 rounded-[7px] bg-[#E7F5EF] flex items-center justify-center">
              <ClipboardList size={16} className="text-[#079B68]" />
            </div>
            <DialogTitle className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Log Daily Progress (DPR)
            </DialogTitle>
          </div>
          <p className="text-xs text-[#929994]">
            Record work execution, site conditions, and observations for today.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Report Date <span className="text-[#B85B63]">*</span>
            </Label>
            <div className="relative">
              <Input
                type="date"
                required
                value={formData.log_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, log_date: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Progress Narrative <span className="text-[#B85B63]">*</span>
            </Label>
            <textarea
              required
              rows={4}
              placeholder="e.g. Completed 4th floor column shuttering and rebar tying. 18 cu.m concrete poured. Weather clear."
              value={formData.progress_update}
              onChange={(e) => setFormData((prev) => ({ ...prev, progress_update: e.target.value }))}
              className={`w-full p-2.5 ${inputCls} resize-none`}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Site Photo Link (URL)
            </Label>
            <Input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.photo_link}
              onChange={(e) => setFormData((prev) => ({ ...prev, photo_link: e.target.value }))}
              className={inputCls}
            />
            <p className="text-[10px] text-[#929994]">Paste a hosted image URL or photo evidence link.</p>
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
              disabled={submitting || !formData.progress_update.trim()}
              className="h-9 px-4 text-xs font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] cursor-pointer"
            >
              {submitting ? 'Submitting…' : 'Submit DPR'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { Wrench, Check, Users, ShieldAlert, Archive, Layers, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConstructionDefaultsTab() {
  const [isSaving, setIsSaving] = useState(false);

  const [defaults, setDefaults] = useState({
    shiftHours: '8',
    overtimeRate: '1.5',
    gracePeriodMins: '15',
    safetyStockBufferPct: '15',
    autoReorderTrigger: true,
    defaultProjectStatus: 'Planning',
    autoArchiveDays: '90',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Construction defaults updated successfully');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
          Construction & Project Defaults
        </h2>
        <p className="text-xs text-[#929994] mt-0.5">
          Establish organization-wide baselines for daily shift hours, overtime multipliers, and inventory buffer rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workforce & Shifts */}
        <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E6E9E7] dark:border-white/[0.07]">
            <Users size={16} className="text-[#079B68]" />
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Workforce Shifts & Payroll Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="shift_hours" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Standard Shift Duration
              </Label>
              <div className="relative">
                <Input
                  id="shift_hours"
                  type="number"
                  min="4"
                  max="16"
                  value={defaults.shiftHours}
                  onChange={(e) => setDefaults((prev) => ({ ...prev, shiftHours: e.target.value }))}
                  className="h-9 text-xs pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#929994] font-medium">
                  hours
                </span>
              </div>
              <p className="text-[10px] text-[#929994]">Standard working hours before overtime begins.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="overtime_rate" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Overtime Multiplier
              </Label>
              <div className="relative">
                <Input
                  id="overtime_rate"
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="3.0"
                  value={defaults.overtimeRate}
                  onChange={(e) => setDefaults((prev) => ({ ...prev, overtimeRate: e.target.value }))}
                  className="h-9 text-xs pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#929994] font-medium">
                  ×
                </span>
              </div>
              <p className="text-[10px] text-[#929994]">Hourly wage multiplier for overtime logs.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="grace_period" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Check-in Grace Period
              </Label>
              <div className="relative">
                <Input
                  id="grace_period"
                  type="number"
                  min="0"
                  max="60"
                  value={defaults.gracePeriodMins}
                  onChange={(e) => setDefaults((prev) => ({ ...prev, gracePeriodMins: e.target.value }))}
                  className="h-9 text-xs pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#929994] font-medium">
                  mins
                </span>
              </div>
              <p className="text-[10px] text-[#929994]">Allowed delay before marking half-day.</p>
            </div>
          </div>
        </Card>

        {/* Material Stocking Rules */}
        <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E6E9E7] dark:border-white/[0.07]">
            <ShieldAlert size={16} className="text-[#079B68]" />
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Material Stock Buffer & Reordering
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="buffer_pct" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                  Default Safety Stock Buffer
                </Label>
                <div className="relative">
                  <Input
                    id="buffer_pct"
                    type="number"
                    min="5"
                    max="50"
                    value={defaults.safetyStockBufferPct}
                    onChange={(e) => setDefaults((prev) => ({ ...prev, safetyStockBufferPct: e.target.value }))}
                    className="h-9 text-xs pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#929994] font-medium">
                    %
                  </span>
                </div>
                <p className="text-[10px] text-[#929994]">Minimum stock margin maintained above planned daily usage.</p>
              </div>

              <div className="flex items-center justify-between sm:pt-4">
                <div className="space-y-0.5">
                  <Label
                    className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] cursor-pointer"
                    onClick={() => setDefaults((p) => ({ ...p, autoReorderTrigger: !p.autoReorderTrigger }))}
                  >
                    Auto-Generate Material Requests
                  </Label>
                  <p className="text-[11px] text-[#929994]">
                    Create pending purchase requisition when inventory hits critical buffer.
                  </p>
                </div>
                <Switch
                  checked={defaults.autoReorderTrigger}
                  onCheckedChange={(checked) => setDefaults((p) => ({ ...p, autoReorderTrigger: checked }))}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Project Lifecycle */}
        <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E6E9E7] dark:border-white/[0.07]">
            <Archive size={16} className="text-[#079B68]" />
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Project Lifecycle Automation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Default New Project Status
              </Label>
              <Select
                value={defaults.defaultProjectStatus}
                onValueChange={(val) => setDefaults((prev) => ({ ...prev, defaultProjectStatus: val || 'Planning' }))}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Select default status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="archive_days" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Auto-Archive Completed Projects
              </Label>
              <div className="relative">
                <Input
                  id="archive_days"
                  type="number"
                  min="30"
                  max="365"
                  value={defaults.autoArchiveDays}
                  onChange={(e) => setDefaults((prev) => ({ ...prev, autoArchiveDays: e.target.value }))}
                  className="h-9 text-xs pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#929994] font-medium">
                  days
                </span>
              </div>
              <p className="text-[10px] text-[#929994]">Move to archive after completion handover.</p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-[#079B68] hover:bg-[#068458] text-white text-xs h-8 px-4 font-semibold"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <ConstructionLoader size="sm" /> Saving...
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Check size={14} /> Save Defaults
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

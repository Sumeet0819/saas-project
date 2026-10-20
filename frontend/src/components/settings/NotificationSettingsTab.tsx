'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
import { Bell, AlertTriangle, Package, HardHat, Check, Mail, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationSettingsTab() {
  const [isSaving, setIsSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    lowStockAlerts: true,
    deliveryStatusUpdates: true,
    dailyLogReminder: true,
    criticalIssueAlerts: true,
    attendanceAlerts: false,
    emailDigest: 'daily',
    inAppBadges: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Notification preferences saved successfully');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
          Notifications & Alerts
        </h2>
        <p className="text-xs text-[#929994] mt-0.5">
          Configure real-time alerts for low inventory stock, daily log submissions, and site safety issues.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Materials & Inventory Section */}
        <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E6E9E7] dark:border-white/[0.07]">
            <Package size={16} className="text-[#079B68]" />
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Materials & Inventory Alerts
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] cursor-pointer" onClick={() => handleToggle('lowStockAlerts')}>
                  Low Stock Threshold Alerts
                </Label>
                <p className="text-[11px] text-[#929994]">
                  Send immediate warning when any site material drops below its minimum buffer quantity.
                </p>
              </div>
              <Switch
                checked={preferences.lowStockAlerts}
                onCheckedChange={() => handleToggle('lowStockAlerts')}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F5F6F5] dark:border-white/[0.04]">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] cursor-pointer" onClick={() => handleToggle('deliveryStatusUpdates')}>
                  Supplier Delivery Updates
                </Label>
                <p className="text-[11px] text-[#929994]">
                  Notify project managers when supplier deliveries change to In Transit or Delivered.
                </p>
              </div>
              <Switch
                checked={preferences.deliveryStatusUpdates}
                onCheckedChange={() => handleToggle('deliveryStatusUpdates')}
              />
            </div>
          </div>
        </Card>

        {/* Site Operations & Daily Logs Section */}
        <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E6E9E7] dark:border-white/[0.07]">
            <HardHat size={16} className="text-[#079B68]" />
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Site Operations & Safety
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] cursor-pointer" onClick={() => handleToggle('criticalIssueAlerts')}>
                  Critical Site Issue Escalations
                </Label>
                <p className="text-[11px] text-[#929994]">
                  High-priority push alert when a safety or structural site issue is tagged as Critical.
                </p>
              </div>
              <Switch
                checked={preferences.criticalIssueAlerts}
                onCheckedChange={() => handleToggle('criticalIssueAlerts')}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F5F6F5] dark:border-white/[0.04]">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] cursor-pointer" onClick={() => handleToggle('dailyLogReminder')}>
                  Daily Site Log Reminders (6:00 PM)
                </Label>
                <p className="text-[11px] text-[#929994]">
                  Remind site engineers to submit daily labor progress, machinery hours, and photo uploads.
                </p>
              </div>
              <Switch
                checked={preferences.dailyLogReminder}
                onCheckedChange={() => handleToggle('dailyLogReminder')}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F5F6F5] dark:border-white/[0.04]">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] cursor-pointer" onClick={() => handleToggle('attendanceAlerts')}>
                  Workforce Attendance Variance
                </Label>
                <p className="text-[11px] text-[#929994]">
                  Alert when morning site attendance is more than 20% lower than yesterday's workforce.
                </p>
              </div>
              <Switch
                checked={preferences.attendanceAlerts}
                onCheckedChange={() => handleToggle('attendanceAlerts')}
              />
            </div>
          </div>
        </Card>

        {/* Email & Delivery Channels */}
        <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E6E9E7] dark:border-white/[0.07]">
            <Mail size={16} className="text-[#079B68]" />
            <h3 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              Delivery Channels & Frequency
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Email Notification Summary
              </Label>
              <Select
                value={preferences.emailDigest}
                onValueChange={(val) => setPreferences((prev) => ({ ...prev, emailDigest: val || '' }))}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Select email frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Real-Time (Instant emails)</SelectItem>
                  <SelectItem value="daily">Daily Morning Digest (8:00 AM)</SelectItem>
                  <SelectItem value="weekly">Weekly Executive Summary</SelectItem>
                  <SelectItem value="disabled">Do Not Send Emails</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between sm:pt-4">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] cursor-pointer" onClick={() => handleToggle('inAppBadges')}>
                  In-App Notification Bell
                </Label>
                <p className="text-[11px] text-[#929994]">
                  Show unread alert badge in header navigation.
                </p>
              </div>
              <Switch
                checked={preferences.inAppBadges}
                onCheckedChange={() => handleToggle('inAppBadges')}
              />
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
                <Check size={14} /> Save Preferences
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

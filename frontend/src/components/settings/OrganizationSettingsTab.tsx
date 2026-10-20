'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateOrganization, fetchOrganizations } from '@/store/slices/organizationsSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { Building2, Check, FileText, MapPin, Phone, Mail, Globe, Coins, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizationSettingsTab() {
  const dispatch = useAppDispatch();
  const { organizations, status } = useAppSelector((state) => state.organizations);
  const { activeOrganizationId } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const currentOrg =
    organizations.find((org) => org.id === activeOrganizationId) ||
    organizations.find((o) => o.id === user?.organization_id) ||
    organizations[0];

  const [formData, setFormData] = useState({
    name: '',
    gst_number: '',
    address: '',
    phone: '',
    email: '',
    logo: '',
    currency: 'INR',
    unitSystem: 'Metric',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (currentOrg) {
      setFormData((prev) => ({
        ...prev,
        name: currentOrg.name || '',
        gst_number: currentOrg.gst_number || '',
        address: currentOrg.address || '',
        phone: currentOrg.phone || '',
        email: currentOrg.email || '',
        logo: currentOrg.logo || '',
      }));
    }
  }, [currentOrg]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Organization name is required');
      return;
    }

    if (!currentOrg?.id) {
      toast.error('No organization selected');
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        updateOrganization({
          id: currentOrg.id,
          body: {
            name: formData.name,
            gst_number: formData.gst_number,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            logo: formData.logo,
          },
        })
      ).unwrap();

      toast.success('Organization details updated successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update organization');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
          Organization & Company
        </h2>
        <p className="text-xs text-[#929994] mt-0.5">
          Manage your company profile, tax registration, headquarters address, and construction units.
        </p>
      </div>

      <Card className="p-6 bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_3px_rgba(16,24,20,0.04)]">
        {/* Company Header */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-[#E6E9E7] dark:border-white/[0.07]">
          <div className="w-14 h-14 rounded-[10px] bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] border border-[#079B68]/20 flex items-center justify-center shrink-0">
            {formData.logo ? (
              <img src={formData.logo} alt={formData.name} className="w-12 h-12 object-contain rounded-[8px]" />
            ) : (
              <Building2 size={24} className="text-[#079B68]" strokeWidth={1.75} />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#171A18] dark:text-[#EFF1F0]">
              {formData.name || 'Civil Enterprise'}
            </h3>
            <p className="text-xs text-[#929994] flex items-center gap-2 mt-0.5">
              <span>GST: {formData.gst_number || 'Unregistered'}</span>
              <span>·</span>
              <span>{formData.address ? formData.address.split(',')[0] : 'Headquarters'}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="company_name" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Company Legal Name <span className="text-[#B85B63]">*</span>
              </Label>
              <Input
                id="company_name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Apex Construction Pvt. Ltd."
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gst_number" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                GST / Tax Registration Number
              </Label>
              <Input
                id="gst_number"
                value={formData.gst_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, gst_number: e.target.value.toUpperCase() }))}
                placeholder="27AABCU9603R1ZM"
                className="h-9 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="biz_email" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Official Business Email
              </Label>
              <div className="relative">
                <Input
                  id="biz_email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@apexconstruction.com"
                  className="h-9 text-xs pl-8"
                />
                <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#929994]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biz_phone" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
                Business Contact Phone
              </Label>
              <div className="relative">
                <Input
                  id="biz_phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 22 2456 7890"
                  className="h-9 text-xs pl-8"
                />
                <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#929994]" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="biz_address" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
              Registered Office Address
            </Label>
            <div className="relative">
              <Input
                id="biz_address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Plot 42, Civil Lines Industrial Area, Mumbai 400001"
                className="h-9 text-xs pl-8"
              />
              <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#929994]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="biz_logo" className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E]">
              Company Logo URL
            </Label>
            <div className="relative">
              <Input
                id="biz_logo"
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
                placeholder="https://example.com/logo.png"
                className="h-9 text-xs pl-8"
              />
              <Globe size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#929994]" />
            </div>
          </div>

          {/* Regional Standards: Currency & Measurement */}
          <div className="pt-4 border-t border-[#E6E9E7] dark:border-white/[0.07] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E] flex items-center gap-1.5">
                <Coins size={13} className="text-[#079B68]" /> Financial Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, currency: val || '' }))}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
                  <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">€ EUR (Euro)</SelectItem>
                  <SelectItem value="GBP">£ GBP (British Pound)</SelectItem>
                  <SelectItem value="AED">AED (UAE Dirham)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-[#929994]">Used for project budgets and material purchase orders.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#626A66] dark:text-[#9BA49E] flex items-center gap-1.5">
                <Ruler size={13} className="text-[#079B68]" /> Unit System
              </Label>
              <Select
                value={formData.unitSystem}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, unitSystem: val || '' }))}
              >
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue placeholder="Select measurement units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Metric">Metric (meters, m², m³, kg, MT)</SelectItem>
                  <SelectItem value="Imperial">Imperial (feet, sq.ft, cu.yd, lbs)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-[#929994]">Defines material units and site quantity reports.</p>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 flex justify-end gap-2 border-t border-[#E6E9E7] dark:border-white/[0.07]">
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
                  <Check size={14} /> Save Organization
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

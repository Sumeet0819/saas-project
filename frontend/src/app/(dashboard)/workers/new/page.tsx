'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createWorker } from '../../../../store/slices/workersSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';

export default function NewWorkerPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);
  const { status: workerStatus } = useSelector((state: RootState) => state.workers);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  const [formData, setFormData] = useState({
    worker_name: '',
    phone: '',
    trade: '',
    daily_wage: '',
    contractor_name: '',
    joining_date: '',
    is_active: true,
    organization_id: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as any).checked;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      daily_wage: formData.daily_wage ? parseFloat(formData.daily_wage) : undefined,
    };
    
    try {
      await dispatch(createWorker(payload as any)).unwrap();
      router.push('/workers');
    } catch (err) {
      console.error('Failed to create worker:', err);
    }
  };

  const isLoading = workerStatus === 'loading';

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto w-full p-4 md:p-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Worker</h1>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Worker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="worker_name">Full Name *</Label>
                <Input
                  id="worker_name"
                  name="worker_name"
                  value={formData.worker_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="trade">Trade / Role *</Label>
                <Input
                  id="trade"
                  name="trade"
                  value={formData.trade}
                  onChange={handleChange}
                  placeholder="e.g. Mason, Carpenter"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="daily_wage">Daily Wage</Label>
                <Input
                  id="daily_wage"
                  name="daily_wage"
                  type="number"
                  step="0.01"
                  value={formData.daily_wage}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="contractor_name">Contractor Name</Label>
                <Input
                  id="contractor_name"
                  name="contractor_name"
                  value={formData.contractor_name}
                  onChange={handleChange}
                  placeholder="If subcontracted"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="joining_date">Joining Date</Label>
                <Input
                  id="joining_date"
                  name="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="organization_id">Organization</Label>
                <Select value={formData.organization_id} onValueChange={(val) => setFormData(prev => ({ ...prev, organization_id: val || '' }))}>
                  <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <SelectValue placeholder="Select Organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations?.map((org) => (
                      <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 md:col-span-2 mt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_active">Worker is active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !formData.worker_name || !formData.trade}>
                {isLoading ? 'Saving...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Worker
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

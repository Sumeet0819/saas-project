'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, HardHat, Phone, Calendar, Building2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWorkerById } from '../../../../store/slices/workersSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function WorkerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const workerId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentWorker: worker, status: workerStatus, error } = useSelector((state: RootState) => state.workers);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  useEffect(() => {
    dispatch(fetchWorkerById(workerId));
  }, [workerId, dispatch]);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  const org = organizations.find(o => o.id === worker?.organization_id);

  if (workerStatus === 'loading') {
    return (
      <div className="flex justify-center p-12">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="text-destructive p-4 text-center">
        Failed to load worker details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px] mx-auto w-full p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/workers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border-2 border-border shadow-sm">
              <HardHat size={32} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{worker.worker_name}</h1>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border bg-blue-500/10 text-blue-500 border-blue-500/20">
                  {worker.trade}
                </span>
                {!worker.is_active && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border bg-red-500/10 text-red-500 border-red-500/20">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Joined {worker.joining_date ? new Date(worker.joining_date).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push(`/workers/${worker.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Worker Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Phone</span>
                <span className="font-medium">{worker.phone || 'No phone provided'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <span className="font-bold text-muted-foreground">$</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Daily Wage</span>
                <span className="font-medium">{worker.daily_wage ? `$${worker.daily_wage}` : 'Not set'}</span>
              </div>
            </div>
            {worker.contractor_name && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium uppercase">Contractor</span>
                  <span className="font-medium">{worker.contractor_name}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent>
            {worker.organization_id ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                   {org?.logo ? (
                     <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-xl" />
                   ) : (
                     <Building2 size={20} className="text-primary" />
                   )}
                </div>
                <div>
                  <h3 className="font-bold text-base">{org ? org.name : 'Loading...'}</h3>
                  <p className="text-xs text-muted-foreground">Employed by</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground p-4 bg-primary/5 rounded-lg border border-border flex items-center gap-2">
                <Building2 size={16} /> No organization assigned
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

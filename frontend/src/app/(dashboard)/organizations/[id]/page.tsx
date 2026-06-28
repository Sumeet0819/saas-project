'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Building2, MapPin, Phone, Mail, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchOrganizationById } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentOrganization: org, status, error } = useSelector((state: RootState) => state.organizations);

  useEffect(() => {
    dispatch(fetchOrganizationById(orgId));
  }, [orgId, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center p-12">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="text-destructive p-4 text-center">
        Failed to load organization details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px] mx-auto w-full p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/organizations')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building2 size={24} className="text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{org.name}</h1>
              <p className="text-sm text-muted-foreground">Joined {new Date(org.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push(`/organizations/${org.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{org.email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{org.phone || 'No phone provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{org.address || 'No address provided'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">GST Number</span>
                <span className="font-medium">{org.gst_number || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

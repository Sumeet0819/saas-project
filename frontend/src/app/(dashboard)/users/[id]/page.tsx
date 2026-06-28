'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, User as UserIcon, Mail, Phone, Shield, Edit, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchUserById } from '../../../../store/slices/usersSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentUser: user, status: userStatus, error } = useSelector((state: RootState) => state.users);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  const org = organizations.find(o => o.id === user?.organization_id);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Project Manager': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Site Engineer': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Contractor': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Supplier': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (userStatus === 'loading') {
    return (
      <div className="flex justify-center p-12">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-destructive p-4 text-center">
        Failed to load user details.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px] mx-auto w-full p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 border-border shadow-sm">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={32} className="text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.full_name}</h1>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-flex items-center gap-1 ${getRoleColor(user.role)}`}>
                  <Shield size={10} />
                  {user.role}
                </span>
                {!user.is_active && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border bg-red-500/10 text-red-500 border-red-500/20">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push(`/users/${user.id}/edit`)}>
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
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase">Phone</span>
                <span className="font-medium">{user.phone || 'No phone provided'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent>
            {user.organization_id ? (
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
                  <p className="text-xs text-muted-foreground">Main Organization</p>
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

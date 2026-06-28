'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchUserById, updateUser } from '../../../../../store/slices/usersSlice';
import { fetchOrganizations } from '../../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../../store/store';
import { UserRole } from '../../../../../types';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentUser: user, status: userStatus } = useSelector((state: RootState) => state.users);
  const { organizations, status: orgStatus } = useSelector((state: RootState) => state.organizations);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'Site Engineer' as UserRole,
    organization_id: '',
    profile_photo: '',
    is_active: true,
  });

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    if (orgStatus === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [orgStatus, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'Site Engineer',
        organization_id: user.organization_id || '',
        profile_photo: user.profile_photo || '',
        is_active: user.is_active,
      });
    }
  }, [user]);

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
    try {
      await dispatch(updateUser({ id: userId, body: formData })).unwrap();
      router.push(`/users/${userId}`);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  if (userStatus === 'loading' && !user) {
    return (
      <div className="flex justify-center p-12">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[800px] mx-auto w-full p-4 md:p-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit User</h1>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData(prev => ({ ...prev, role: val as UserRole }))} required>
                  <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Site Engineer">Site Engineer</SelectItem>
                    <SelectItem value="Contractor">Contractor</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="flex flex-col gap-2 md:col-span-2">
                <Label htmlFor="profile_photo">Profile Photo URL</Label>
                <Input
                  id="profile_photo"
                  name="profile_photo"
                  value={formData.profile_photo}
                  onChange={handleChange}
                />
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
                <Label htmlFor="is_active">User is active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={userStatus === 'loading' || !formData.full_name || !formData.email}>
                {userStatus === 'loading' ? 'Saving...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
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

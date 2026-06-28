'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Building2, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchOrganizations } from '../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { Organization } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function OrganizationsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { organizations, status, error } = useSelector((state: RootState) => state.organizations);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrganizations());
    }
  }, [status, dispatch]);

  const isLoading = status === 'loading';

  const filteredOrgs = organizations?.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Organizations</h1>
        <Button onClick={() => router.push('/organizations/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Organization
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-white dark:bg-card border-border"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <ConstructionLoader size="md" />
        </div>
      ) : error ? (
        <div className="text-destructive p-4 text-center">
          Failed to load organizations. Please try again.
        </div>
      ) : filteredOrgs.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border">
          No organizations found matching your search.
        </div>
      ) : (
        <div className="mt-2 w-full overflow-x-auto bg-white dark:bg-card rounded-2xl border border-border shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50 dark:bg-gray-900/50 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">GST Number</th>
                <th className="p-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border">
              <AnimatePresence>
                {filteredOrgs.map((org: Organization) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={org.id}
                    onClick={() => router.push(`/organizations/${org.id}`)}
                    className="group cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                          {org.logo ? (
                            <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Building2 size={18} className="text-primary" />
                          )}
                        </div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{org.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-foreground">
                      <div className="flex flex-col">
                        <span className="text-sm">{org.email || '-'}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone size={12} /> {org.phone || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5 line-clamp-1"><MapPin size={14} /> {org.address || '-'}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {org.gst_number || '-'}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(org.created_at).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

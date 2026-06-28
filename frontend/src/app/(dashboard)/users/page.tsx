'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, User as UserIcon, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error } = useSelector((state: RootState) => state.users);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const filteredUsers = users?.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
        <Button onClick={() => router.push('/users/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-white dark:bg-card border-border"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {status === 'loading' ? (
        <div className="flex justify-center p-12">
          <ConstructionLoader size="md" />
        </div>
      ) : status === 'failed' ? (
        <div className="text-destructive p-4 text-center">
          {error || 'Failed to load users.'}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center p-12 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border">
          No users found.
        </div>
      ) : (
        <div className="mt-2 w-full overflow-x-auto bg-white dark:bg-card rounded-2xl border border-border shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-gray-50/50 dark:bg-gray-900/50 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={user.id}
                    onClick={() => router.push(`/users/${user.id}`)}
                    className="group cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                          {user.profile_photo ? (
                            <img src={user.profile_photo} alt={user.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={18} className="text-primary" />
                          )}
                        </div>
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{user.full_name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-foreground">
                      <span className="text-sm flex items-center gap-1.5"><Mail size={12} className="text-muted-foreground" /> {user.email}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border inline-flex items-center gap-1 ${getRoleColor(user.role)}`}>
                        <Shield size={10} />
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${user.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
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

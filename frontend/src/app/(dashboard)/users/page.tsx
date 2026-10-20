'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, User as UserIcon, Shield, Mail, Phone, Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchUsers } from '../../../store/slices/usersSlice';
import { RootState, AppDispatch } from '../../../store/store';
import { User } from '../../../types';
import { DataView, DataTable, DataGrid, UserCard, Column } from '@/components/common/dataview';

const ROLES = ['All', 'Admin', 'Project Manager', 'Site Engineer', 'Contractor', 'Supplier'];

const ROLE_CONFIG: Record<string, { bg: string; text: string }> = {
  Admin:             { bg: '#F3EFFE', text: '#7C4DFF' },
  'Project Manager': { bg: '#EBF2FF', text: '#2563EB' },
  'Site Engineer':   { bg: '#E7F5EF', text: '#079B68' },
  Contractor:        { bg: '#FEF9EC', text: '#D5A04A' },
  Supplier:          { bg: '#F9EDEF', text: '#B85B63' },
};

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, error } = useSelector((state: RootState) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRole, setActiveRole] = useState('All');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const filteredUsers = useMemo(() => {
    return (users || []).filter((user) => {
      const matchSearch =
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = activeRole === 'All' || user.role === activeRole;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, activeRole]);

  const counts = useMemo(() => {
    return ROLES.reduce<Record<string, number>>((acc, r) => {
      acc[r] = r === 'All' ? (users || []).length : (users || []).filter((u) => u.role === r).length;
      return acc;
    }, {});
  }, [users]);

  const filterTabs = useMemo(() => {
    return ROLES.map((r) => ({
      key: r,
      label: r,
      count: counts[r] ?? 0,
    }));
  }, [counts]);

  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] flex items-center justify-center shrink-0 overflow-hidden border border-[#079B68]/15">
            {user.profile_photo ? (
              <img src={user.profile_photo} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-xs text-[#079B68]">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <span className="font-semibold text-sm text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
              {user.full_name}
            </span>
            <span className="block text-[11px] text-[#929994]">ID: {user.id.slice(0, 8)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (user) => (
        <div className="flex flex-col gap-0.5 text-xs text-[#626A66] dark:text-[#9BA49E]">
          <span className="flex items-center gap-1.5">
            <Mail size={12} className="text-[#929994]" /> {user.email}
          </span>
          {user.phone && (
            <span className="flex items-center gap-1.5 text-[#929994]">
              <Phone size={12} /> {user.phone}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => {
        const roleCfg = ROLE_CONFIG[user.role] || { bg: '#F5F6F5', text: '#929994' };
        return (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: roleCfg.bg, color: roleCfg.text }}
          >
            <Shield size={10} />
            {user.role}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            user.is_active ? 'bg-[#E7F5EF] text-[#079B68]' : 'bg-[#F9EDEF] text-[#B85B63]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-[#079B68]' : 'bg-[#B85B63]'}`} />
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'Registered',
      render: (user) => (
        <span className="text-xs text-[#929994] whitespace-nowrap flex items-center gap-1.5">
          <Calendar size={12} />
          {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      align: 'right',
      render: () => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] text-[#929994] group-hover:text-[#079B68] group-hover:bg-[#E7F5EF] dark:group-hover:bg-[rgba(7,155,104,0.15)] transition-colors">
          <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      ),
    },
  ];

  return (
    <DataView
      title="Team & Users"
      subtitle={`${(users || []).length} registered team members and platform accounts`}
      action={
        <Button
          onClick={() => router.push('/users/new')}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] shadow-sm gap-1.5 cursor-pointer transition-colors"
        >
          <Plus size={15} strokeWidth={2.25} />
          New User
        </Button>
      }
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search users by name, email, or role…"
      filterTabs={filterTabs}
      activeFilterTab={activeRole}
      onFilterTabChange={setActiveRole}
      isLoading={status === 'loading'}
      error={error}
      onRetry={() => dispatch(fetchUsers())}
      isEmpty={filteredUsers.length === 0}
      emptyIcon={UserIcon}
      emptyTitle="No users found"
      emptyDescription={
        searchTerm || activeRole !== 'All'
          ? 'No team accounts match your filter criteria.'
          : 'Invite engineers, managers, and contractors to your project management workspace.'
      }
      emptyActionText={searchTerm || activeRole !== 'All' ? 'Reset Filters' : 'New User'}
      onEmptyAction={() => {
        if (searchTerm || activeRole !== 'All') {
          setSearchTerm('');
          setActiveRole('All');
        } else {
          router.push('/users/new');
        }
      }}
      tableView={
        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          onRowClick={(u) => router.push(`/users/${u.id}`)}
        />
      }
      gridView={
        <DataGrid
          data={filteredUsers}
          keyExtractor={(u) => u.id}
          renderItem={(u) => <UserCard user={u} />}
        />
      }
    />
  );
}

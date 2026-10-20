'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, User as UserIcon, Mail, Phone, Shield, Edit, Building2, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchUserById } from '../../../../store/slices/usersSlice';
import { fetchOrganizations } from '../../../../store/slices/organizationsSlice';
import { RootState, AppDispatch } from '../../../../store/store';
import { ConstructionLoader } from '@/components/ui/ConstructionLoader';
import { motion, Variants } from 'framer-motion';

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const ROLE_CONFIG: Record<string, { bg: string; text: string }> = {
  Admin:             { bg: '#F3EFFE', text: '#7C4DFF' },
  'Project Manager': { bg: '#EBF2FF', text: '#2563EB' },
  'Site Engineer':   { bg: '#E7F5EF', text: '#079B68' },
  Contractor:        { bg: '#FEF9EC', text: '#D5A04A' },
  Supplier:          { bg: '#F9EDEF', text: '#B85B63' },
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#E6E9E7] dark:border-white/[0.07] last:border-0">
      <div className="w-8 h-8 rounded-[7px] bg-[#F5F6F5] dark:bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-[#929994]" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#929994] mb-0.5">{label}</p>
        <p className="text-sm font-medium text-[#171A18] dark:text-[#EFF1F0] truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={fade}
      className="bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] shadow-[0_1px_4px_rgba(16,24,20,0.06)] overflow-hidden"
    >
      <div className="px-5 py-3.5 border-b border-[#E6E9E7] dark:border-white/[0.07]">
        <h2 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">{title}</h2>
      </div>
      <div className="px-5 py-1">{children}</div>
    </motion.div>
  );
}

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

  const org = organizations.find((o) => o.id === user?.organization_id);

  if (userStatus === 'loading') {
    return (
      <div className="flex justify-center items-center py-24">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-14 h-14 bg-[#F9EDEF] rounded-[12px] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-[#B85B63]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">User not found</p>
        <p className="text-xs text-[#929994] mb-4">We could not locate this team member profile.</p>
        <Button
          onClick={() => router.push('/users')}
          className="bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] h-9 text-sm cursor-pointer"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  const roleCfg = ROLE_CONFIG[user.role] || { bg: '#F5F6F5', text: '#929994' };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1000px] mx-auto w-full">
      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/users')}
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] transition-colors cursor-pointer shadow-[0_1px_2px_rgba(16,24,20,0.06)]"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-full flex items-center justify-center shrink-0 border border-[#079B68]/15 overflow-hidden">
              {user.profile_photo ? (
                <img src={user.profile_photo} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-semibold text-sm text-[#079B68]">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">{user.full_name}</h1>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: roleCfg.bg, color: roleCfg.text }}
                >
                  <Shield size={10} />
                  {user.role}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    user.is_active ? 'bg-[#E7F5EF] text-[#079B68]' : 'bg-[#F9EDEF] text-[#B85B63]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-[#079B68]' : 'bg-[#B85B63]'}`} />
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-[#929994] mt-0.5">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/users/${user.id}/edit`)}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <Edit size={14} strokeWidth={2} /> Edit Profile
        </Button>
      </motion.div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Contact Information">
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
          <InfoRow icon={Phone} label="Phone Number" value={user.phone || ''} />
          <InfoRow icon={Calendar} label="Date Registered" value={new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
        </SectionCard>

        <SectionCard title="Role & Organization">
          <InfoRow icon={Shield} label="Access Role" value={user.role} />
          <InfoRow icon={Building2} label="Organization Affiliation" value={org ? org.name : (user.organization_id ? 'Loading...' : 'None Assigned')} />
        </SectionCard>
      </div>
    </motion.div>
  );
}

'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, HardHat, Phone, Calendar, Building2, Edit, DollarSign, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchWorkerById } from '../../../../store/slices/workersSlice';
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

  const org = organizations.find((o) => o.id === worker?.organization_id);

  if (workerStatus === 'loading') {
    return (
      <div className="flex justify-center items-center py-24">
        <ConstructionLoader size="md" />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-14 h-14 bg-[#F9EDEF] rounded-[12px] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-[#B85B63]" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0] mb-1">Worker record not found</p>
        <p className="text-xs text-[#929994] mb-4">We could not load this worker profile.</p>
        <Button
          onClick={() => router.push('/workers')}
          className="bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] h-9 text-sm cursor-pointer"
        >
          Back to Workers
        </Button>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1000px] mx-auto w-full">
      {/* Header */}
      <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/workers')}
            className="w-8 h-8 flex items-center justify-center rounded-[7px] border border-[#E6E9E7] dark:border-white/[0.08] bg-white dark:bg-[#1B1E1C] text-[#626A66] hover:bg-[#F5F6F5] hover:text-[#171A18] transition-colors cursor-pointer shadow-[0_1px_2px_rgba(16,24,20,0.06)]"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] rounded-full flex items-center justify-center shrink-0 border border-[#079B68]/15">
              <HardHat size={20} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">{worker.worker_name}</h1>
                <span className="inline-flex px-2 py-0.5 rounded-[5px] bg-[#F5F6F5] dark:bg-white/[0.04] text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0] border border-[#E6E9E7] dark:border-white/[0.08]">
                  {worker.trade}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    worker.is_active ? 'bg-[#E7F5EF] text-[#079B68]' : 'bg-[#F9EDEF] text-[#B85B63]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${worker.is_active ? 'bg-[#079B68]' : 'bg-[#B85B63]'}`} />
                  {worker.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-[#929994] mt-0.5">
                Joined {worker.joining_date ? new Date(worker.joining_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/workers/${worker.id}/edit`)}
          className="h-9 px-4 text-sm font-medium bg-[#079B68] hover:bg-[#087A55] text-white rounded-[8px] gap-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <Edit size={14} strokeWidth={2} /> Edit Worker
        </Button>
      </motion.div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Contact & Compensation">
          <InfoRow icon={Phone} label="Phone Number" value={worker.phone || ''} />
          <InfoRow icon={DollarSign} label="Daily Wage Rate" value={worker.daily_wage ? `Rs. ${worker.daily_wage.toLocaleString()}` : ''} />
          <InfoRow icon={Calendar} label="Date of Joining" value={worker.joining_date ? new Date(worker.joining_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''} />
        </SectionCard>

        <SectionCard title="Contractor & Organization">
          <InfoRow icon={Building2} label="Contractor Agency" value={worker.contractor_name || 'Direct Hire'} />
          <InfoRow icon={ShieldCheck} label="Organization" value={org ? org.name : (worker.organization_id ? 'Loading...' : 'None Assigned')} />
          <InfoRow icon={HardHat} label="Trade Specialization" value={worker.trade} />
        </SectionCard>
      </div>
    </motion.div>
  );
}

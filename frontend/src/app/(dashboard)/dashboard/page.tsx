'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchProjects } from '../../../store/slices/projectsSlice';
import { fetchWorkers } from '../../../store/slices/workersSlice';
import {
  Building2, Users, AlertTriangle, Box,
  ChevronDown, Briefcase, HardHat,
  Activity, Truck, ShieldCheck, CheckCircle, Clock,
  CloudRain, Wind, Thermometer, CalendarClock, CreditCard,
  UserCheck, PackageMinus, ClipboardList, Target, MoreHorizontal,
  TrendingUp, TrendingDown, Info
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const BRAND = '#079B68';
const BRAND_SOFT = '#E7F5EF';
const BRAND_DEEP = '#087A55';
const NEGATIVE = '#B85B63';
const BORDER = '#E6E9E7';

const cashFlowData = [
  { name: 'Jan', revenue: 4000, expense: 2400 },
  { name: 'Feb', revenue: 3000, expense: 1398 },
  { name: 'Mar', revenue: 2000, expense: 9800 },
  { name: 'Apr', revenue: 2780, expense: 3908 },
  { name: 'May', revenue: 1890, expense: 4800 },
  { name: 'Jun', revenue: 2390, expense: 3800 },
  { name: 'Jul', revenue: 3490, expense: 4300 },
];

const fade: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fade}
      className={`bg-white dark:bg-[#1B1E1C] border border-[#E6E9E7] dark:border-white/[0.08] rounded-[10px] p-5 shadow-[0_1px_4px_rgba(16,24,20,0.06)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-1">
      <h2 className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">{title}</h2>
      {subtitle && <p className="text-xs text-[#929994] mt-0.5">{subtitle}</p>}
    </div>
  );
}

function TrendBadge({ value, positive }: { value: string; positive: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: positive ? '#E7F5EF' : '#F9EDEF',
        color: positive ? '#269B75' : '#B85B63',
      }}
    >
      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {value}
    </span>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeOrganizationId } = useAppSelector((state) => state.ui);
  const { projects, status: projectsStatus } = useAppSelector((state) => state.projects);
  const { workers, status: workersStatus } = useAppSelector((state) => state.workers);

  React.useEffect(() => {
    if (projectsStatus === 'idle') dispatch(fetchProjects());
    if (workersStatus === 'idle') dispatch(fetchWorkers());
  }, [projectsStatus, workersStatus, dispatch]);

  const orgProjects = React.useMemo(
    () => (activeOrganizationId ? projects.filter((p) => p.organization_id === activeOrganizationId) : []),
    [projects, activeOrganizationId]
  );
  const orgWorkers = React.useMemo(
    () => (activeOrganizationId ? workers.filter((w) => w.organization_id === activeOrganizationId) : []),
    [workers, activeOrganizationId]
  );

  const activeProjectsCount = orgProjects.filter((p) => p.status === 'Active').length;
  const totalWorkforce = orgWorkers.length;
  const totalW = totalWorkforce || 30;
  const concreteCount = Math.round(totalW * 0.4);
  const steelCount = Math.round(totalW * 0.3);
  const generalCount = Math.max(0, totalW - concreteCount - steelCount);

  const presentCount = Math.max(1, Math.round(totalW * 0.93));
  const absentCount = Math.max(0, totalW - presentCount);
  const presentPct = Math.round((presentCount / totalW) * 100);

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  }).format(new Date());

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1600px] mx-auto w-full">
      {/* Page heading */}
      <motion.div variants={fade} className="mb-6">
        <p className="text-xs text-[#929994] mb-0.5">{currentDate}</p>
        <h1 className="text-xl font-semibold text-[#171A18] dark:text-[#EFF1F0] tracking-tight">
          Project Report
        </h1>
      </motion.div>

      {/* ── Minimal KPI row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5 items-stretch">
        {/* Card 1: Primary KPI - Active Projects */}
        <motion.div
          variants={fade}
          className="relative overflow-hidden rounded-[10px] p-5 text-white flex flex-col justify-between shadow-sm h-full"
          style={{ background: 'linear-gradient(135deg, #079B68 0%, #087A55 100%)' }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-[7px] flex items-center justify-center">
              <Briefcase size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
              <TrendingUp size={10} /> +12.4%
            </span>
          </div>
          <div>
            <p className="text-xs text-white/80 font-medium mb-1">Active Projects</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none text-white">{activeProjectsCount}</span>
              <span className="text-[11px] text-white/70">vs last month</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Total Workforce */}
        <Card className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[7px] flex items-center justify-center">
              <Users size={16} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
            <TrendBadge value="+5.2%" positive={true} />
          </div>
          <div>
            <p className="text-xs text-[#929994] font-medium mb-1">Total Workforce</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none text-[#171A18] dark:text-[#EFF1F0]">
                {totalWorkforce}
              </span>
              <span className="text-[11px] text-[#929994]">vs last month</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Critical Issues */}
        <Card className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-[#F9EDEF] dark:bg-[rgba(184,91,99,0.12)] rounded-[7px] flex items-center justify-center">
              <AlertTriangle size={16} className="text-[#B85B63]" strokeWidth={1.75} />
            </div>
            <TrendBadge value="-2.1%" positive={false} />
          </div>
          <div>
            <p className="text-xs text-[#929994] font-medium mb-1">Critical Issues</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none text-[#171A18] dark:text-[#EFF1F0]">
                7
              </span>
              <span className="text-[11px] text-[#929994]">vs last month</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Material Deliveries */}
        <Card className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[7px] flex items-center justify-center">
              <Truck size={16} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
            <TrendBadge value="+18.3%" positive={true} />
          </div>
          <div>
            <p className="text-xs text-[#929994] font-medium mb-1">Material Deliveries</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none text-[#171A18] dark:text-[#EFF1F0]">
                124
              </span>
              <span className="text-[11px] text-[#929994]">vs last month</span>
            </div>
          </div>
        </Card>

        {/* Card 5: Safety */}
        <Card className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[7px] flex items-center justify-center">
              <ShieldCheck size={16} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] text-[#079B68]">
              Safe
            </span>
          </div>
          <div>
            <p className="text-xs text-[#929994] font-medium mb-1">Safety Record</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none text-[#171A18] dark:text-[#EFF1F0]">
                42
              </span>
              <span className="text-[11px] text-[#929994]">days incident-free</span>
            </div>
          </div>
        </Card>

        {/* Card 6: Weather & Conditions */}
        <Card className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="w-8 h-8 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[7px] flex items-center justify-center">
              <CloudRain size={16} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-medium text-[#626A66] dark:text-[#9BA49E]">
              12 km/h
            </span>
          </div>
          <div>
            <p className="text-xs text-[#929994] font-medium mb-1">Site Conditions</p>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold leading-none text-[#171A18] dark:text-[#EFF1F0]">
                18°
              </span>
              <span className="text-[11px] text-[#929994]">H 22° · L 14°</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">

        {/* Budget vs Actual Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-start mb-5">
            <div>
              <SectionTitle title="Budget vs Actual Cost" />
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-[11px] text-[#626A66]">
                  <span className="w-2 h-2 rounded-full bg-[#079B68]" /> Actual
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#626A66]">
                  <span className="w-2 h-2 rounded-full bg-[#D8EFE5]" /> Budget
                </span>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-[#626A66] bg-[#F5F6F5] dark:bg-white/[0.04] border border-[#E6E9E7] dark:border-white/[0.08] px-2.5 py-1 rounded-full hover:bg-[#F0F2F1] transition-colors cursor-pointer">
              Year <ChevronDown size={12} />
            </button>
          </div>
          <div className="h-[180px] w-full flex items-end justify-between px-1 gap-2">
            {[
              { label: 'Jan', actual: 80, budget: 100 },
              { label: 'Feb', actual: 65, budget: 85 },
              { label: 'Mar', actual: 40, budget: 60 },
              { label: 'Apr', actual: 110, budget: 90 },
              { label: 'May', actual: 75, budget: 80 },
              { label: 'Jun', actual: 50, budget: 70 },
              { label: 'Jul', actual: 85, budget: 100 },
            ].map((month, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-1.5 group">
                <div className="flex items-end justify-center gap-1 w-full h-[144px]">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${month.actual}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 }}
                    className="w-1/2 max-w-[14px] rounded-full cursor-pointer transition-opacity group-hover:opacity-80"
                    style={{ background: BRAND }}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${month.budget}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 + 0.15 }}
                    className="w-1/2 max-w-[14px] rounded-full cursor-pointer transition-opacity group-hover:opacity-80"
                    style={{ background: '#D8EFE5' }}
                  />
                </div>
                <span className="text-[10px] font-medium text-[#929994]">{month.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Cash Flow */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <SectionTitle title="Cash Flow" subtitle="Revenue vs Expenses (YTD)" />
            </div>
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <CreditCard size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>
          <div className="h-[190px] w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NEGATIVE} stopOpacity={0.20} />
                    <stop offset="95%" stopColor={NEGATIVE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0EF" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#929994' }} dy={8} />
                <YAxis hide domain={['auto', 'auto']} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '9px', border: '1px solid #E6E9E7', boxShadow: '0 4px 16px rgba(16,24,20,0.08)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke={BRAND} strokeWidth={2} fillOpacity={1} fill="url(#gRevenue)" />
                <Area type="monotone" dataKey="expense" stroke={NEGATIVE} strokeWidth={2} fillOpacity={1} fill="url(#gExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Workforce */}
        <Card className="col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <SectionTitle title="Workforce" subtitle="Trade distribution" />
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <Users size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>

          <div className="flex items-center gap-3.5 my-auto py-1">
            {/* Slender Multi-Segment Ring Chart (Refined, no thick pipe look) */}
            <div className="relative w-[84px] h-[84px] shrink-0">
              <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                {/* Background circle track */}
                <circle cx="44" cy="44" r="34" fill="none" stroke="#F1F3F2" strokeWidth="4.5" className="dark:stroke-white/[0.06]" />

                {/* Segment 1: Concrete (40%) */}
                <motion.circle
                  cx="44" cy="44" r="34" fill="none" stroke="#079B68" strokeWidth="4.5" strokeLinecap="round"
                  strokeDasharray="76.5 213.63" strokeDashoffset="-2.25"
                  initial={{ strokeDasharray: "0 213.63" }}
                  animate={{ strokeDasharray: "76.5 213.63" }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />

                {/* Segment 2: Steel (30%) */}
                <motion.circle
                  cx="44" cy="44" r="34" fill="none" stroke="#2DD4BF" strokeWidth="4.5" strokeLinecap="round"
                  strokeDasharray="55.1 213.63" strokeDashoffset="-87.7"
                  initial={{ strokeDasharray: "0 213.63" }}
                  animate={{ strokeDasharray: "55.1 213.63" }}
                  transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                />

                {/* Segment 3: General (30%) */}
                <motion.circle
                  cx="44" cy="44" r="34" fill="none" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round"
                  className="dark:stroke-white/30"
                  strokeDasharray="55.1 213.63" strokeDashoffset="-151.8"
                  initial={{ strokeDasharray: "0 213.63" }}
                  animate={{ strokeDasharray: "55.1 213.63" }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold tracking-tight text-[#171A18] dark:text-[#EFF1F0] leading-none">
                  {totalW}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#929994] font-medium mt-1">
                  Workers
                </span>
              </div>
            </div>

            {/* Structured Trade Breakdown */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#079B68] shrink-0" />
                  <span className="text-[#626A66] dark:text-[#9BA49E] font-medium truncate">Concrete</span>
                </div>
                <div className="flex items-baseline gap-1 shrink-0 ml-1">
                  <span className="font-semibold text-[#171A18] dark:text-[#EFF1F0]">{concreteCount}</span>
                  <span className="text-[10px] text-[#929994]">40%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] shrink-0" />
                  <span className="text-[#626A66] dark:text-[#9BA49E] font-medium truncate">Steel</span>
                </div>
                <div className="flex items-baseline gap-1 shrink-0 ml-1">
                  <span className="font-semibold text-[#171A18] dark:text-[#EFF1F0]">{steelCount}</span>
                  <span className="text-[10px] text-[#929994]">30%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#CBD5E1] dark:bg-white/30 shrink-0" />
                  <span className="text-[#626A66] dark:text-[#9BA49E] font-medium truncate">General</span>
                </div>
                <div className="flex items-baseline gap-1 shrink-0 ml-1">
                  <span className="font-semibold text-[#171A18] dark:text-[#EFF1F0]">{generalCount}</span>
                  <span className="text-[10px] text-[#929994]">30%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Equipment */}
        <Card className="col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <SectionTitle title="Equipment" subtitle="Machinery status" />
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <Truck size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>
          <div className="space-y-3 pt-1">
            {[
              { label: 'Excavators', pct: 85 },
              { label: 'Cranes', pct: 60 },
              { label: 'Dump Trucks', pct: 92 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-[#626A66] dark:text-[#9BA49E]">{item.label}</span>
                  <span className="font-semibold text-[#171A18] dark:text-[#EFF1F0]">{item.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#EEF0EF] dark:bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: BRAND }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Milestones */}
        <Card className="col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <SectionTitle title="Milestones" subtitle="Next 7 days" />
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <CalendarClock size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>
          <div className="space-y-3 pt-1 relative pl-3">
            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[#E6E9E7] dark:bg-white/[0.08]" />
            {[
              { when: 'Tomorrow', label: 'Alpha Sign-off', color: BRAND },
              { when: 'Friday', label: 'Steel Delivery', color: '#49C795' },
              { when: 'Monday', label: 'Phase 2 Start', color: '#D8DEDA' },
            ].map((ms) => (
              <div key={ms.label} className="relative pl-4">
                <span
                  className="absolute left-[-2px] top-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-[#1B1E1C]"
                  style={{ background: ms.color }}
                />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#929994] mb-0.5">
                  {ms.when}
                </p>
                <p className="text-xs font-medium text-[#171A18] dark:text-[#EFF1F0] truncate">{ms.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Attendance */}
        <Card className="col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <SectionTitle title="Attendance" subtitle="Daily workforce" />
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <UserCheck size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>
          <div className="space-y-3 pt-1">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-[#171A18] dark:text-[#EFF1F0]">{presentPct}%</span>
                <span className="text-[10px] font-semibold text-[#079B68] ml-2 uppercase tracking-wider bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.15)] px-2 py-0.5 rounded-full">
                  Present
                </span>
              </div>
              <span className="text-xs text-[#929994] font-medium">
                {presentCount} / {totalW} on site
              </span>
            </div>

            <div className="h-1.5 w-full bg-[#EEF0EF] dark:bg-white/[0.06] rounded-full overflow-hidden flex">
              <motion.div initial={{ width: 0 }} animate={{ width: `${presentPct}%` }} transition={{ duration: 0.9, delay: 0.2 }}
                className="h-full rounded-l-full" style={{ background: BRAND }} />
              <motion.div initial={{ width: 0 }} animate={{ width: `${100 - presentPct}%` }} transition={{ duration: 0.9, delay: 0.3 }}
                className="h-full rounded-r-full" style={{ background: NEGATIVE }} />
            </div>

            <div className="flex justify-between text-xs text-[#626A66] dark:text-[#9BA49E] pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: NEGATIVE }} /> {absentCount} Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D8EFE5]" /> 4 Overtime
              </span>
            </div>
          </div>
        </Card>

        {/* Inventory Alerts */}
        <Card className="col-span-1" style={{ borderColor: 'rgba(184,91,99,0.15)' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <SectionTitle title="Inventory Alerts" />
              <p className="text-xs text-[#B85B63] font-medium">Below minimum stock</p>
            </div>
            <div className="relative w-7 h-7 bg-[#F9EDEF] rounded-[6px] flex items-center justify-center">
              <PackageMinus size={14} className="text-[#B85B63]" strokeWidth={1.75} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#B85B63] rounded-full animate-pulse" />
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="bg-[#F9EDEF] border border-[#B85B63]/15 rounded-[8px] p-3 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Cement (Grade 53)</p>
                <p className="text-[10px] text-[#B85B63]/80">Min: 500 Bags</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#B85B63]">120</p>
                <p className="text-[9px] uppercase font-bold text-[#B85B63]/70">In Stock</p>
              </div>
            </div>
            <div className="bg-[#E7F5EF] border border-[#079B68]/15 rounded-[8px] p-3 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-[#171A18] dark:text-[#EFF1F0]">Steel Rebar (12mm)</p>
                <p className="text-[10px] text-[#079B68]/80">Min: 10 Tons</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[#079B68]">8.5</p>
                <p className="text-[9px] uppercase font-bold text-[#079B68]/70">In Stock</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Material Requests */}
        <Card className="col-span-1">
          <div className="flex justify-between items-start mb-4">
            <SectionTitle title="Requests" subtitle="Material procurement" />
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <ClipboardList size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { count: 12, pct: 40, label: 'Pending' },
              { count: 8, pct: 60, label: 'Ordered' },
              { count: 24, pct: 85, label: 'Delivered' },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-7 text-right text-xs font-semibold text-[#079B68]">{item.count}</span>
                <div className="flex-1 h-1.5 bg-[#EEF0EF] dark:bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.9, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: BRAND, opacity: 0.4 + i * 0.3 }}
                  />
                </div>
                <span className="w-16 text-[10px] font-semibold text-[#929994] uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Task Progress */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <SectionTitle title="Task Progress" subtitle="Active site activities" />
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <Target size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EEF0EF" strokeWidth="10" />
                <motion.circle cx="50" cy="50" r="40" fill="none" stroke={BRAND} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - 251.2 * 0.68 }} transition={{ duration: 1.3, ease: 'easeOut' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#171A18] dark:text-[#EFF1F0]">68%</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#929994]">Done</span>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 w-full sm:w-auto">
              {[
                { val: '42', label: 'Pending tasks', color: '#929994' },
                { val: '18', label: 'In Progress', color: '#079B68' },
                { val: '128', label: 'Completed', color: BRAND },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <div>
                    <p className="text-sm font-semibold text-[#171A18] dark:text-[#EFF1F0]">{s.val}</p>
                    <p className="text-[10px] text-[#929994]">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <div className="flex justify-between items-start mb-4">
            <SectionTitle title="Recent Activity" subtitle="Latest project updates" />
            <div className="w-7 h-7 bg-[#E7F5EF] dark:bg-[rgba(7,155,104,0.12)] rounded-[6px] flex items-center justify-center">
              <Activity size={14} className="text-[#079B68]" strokeWidth={1.75} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E9E7] dark:border-white/[0.07]">
                  {['Status', 'Activity', 'Project', 'Time'].map((h) => (
                    <th key={h} className="pb-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#929994]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { activity: 'Concrete poured', project: 'Alpha', time: '2 hours ago', status: 'done' },
                  { activity: 'Blueprint approval', project: 'Beta', time: '5 hours ago', status: 'done' },
                  { activity: 'Material delivered', project: 'Gamma', time: '1 day ago', status: 'done' },
                ].map((row) => (
                  <tr
                    key={row.activity}
                    className="border-b border-[#F5F6F5] dark:border-white/[0.04] hover:bg-[#F7F8F7] dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-3">
                      <CheckCircle size={14} className="text-[#079B68]" strokeWidth={1.75} />
                    </td>
                    <td className="py-3 px-3 text-sm font-medium text-[#171A18] dark:text-[#EFF1F0] group-hover:text-[#079B68] transition-colors">
                      {row.activity}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-[#F5F6F5] dark:bg-white/[0.06] text-[#626A66] dark:text-[#9BA49E] px-2 py-0.5 rounded-full text-[11px] font-medium">
                        {row.project}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs text-[#929994]">
                        <Clock size={11} /> {row.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </motion.div>
  );
}

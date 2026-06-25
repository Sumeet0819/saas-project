'use client';

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { 
  Building2, Users, AlertTriangle, Box, 
  ChevronDown, ArrowUp, Briefcase, HardHat,
  Activity, Truck, ShieldCheck, CheckCircle, Clock,
  CloudRain, Wind, Thermometer, CalendarClock, CreditCard,
  UserCheck, PackageMinus, ClipboardList, Target
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const cashFlowData = [
  { name: 'Jan', revenue: 4000, expense: 2400 },
  { name: 'Feb', revenue: 3000, expense: 1398 },
  { name: 'Mar', revenue: 2000, expense: 9800 },
  { name: 'Apr', revenue: 2780, expense: 3908 },
  { name: 'May', revenue: 1890, expense: 4800 },
  { name: 'Jun', revenue: 2390, expense: 3800 },
  { name: 'Jul', revenue: 3490, expense: 4300 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const currentDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col max-w-[1600px] mx-auto w-full"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 pl-2">
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900 mb-1">Project Report</h1>
        <p className="text-sm text-gray-500 font-medium">{currentDate}</p>
      </motion.div>

      {/* Main 4-Column Grid for ALL Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
        
        {/* Primary Blue Card */}
        <motion.div variants={itemVariants} whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(37,99,235,0.4)" }} className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-[0_10px_40px_rgba(37,99,235,0.3)] flex flex-col justify-between group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-indigo-400 opacity-20 blur-xl"></div>
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Briefcase size={20} strokeWidth={2.5} className="text-white" />
            </div>
            <div className="px-2.5 py-1 bg-white/20 rounded-full text-[11px] font-bold backdrop-blur-md border border-white/10">
              +12.4%
            </div>
          </div>
          <div className="relative z-10">
            <div className="text-xs text-blue-100 font-medium mb-1">Total Active Projects</div>
            <div className="flex items-end gap-2">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-[28px] font-bold leading-none tracking-tight">12</motion.div>
              <div className="text-[10px] text-blue-200 mb-1 font-medium">vs last month</div>
            </div>
          </div>
        </motion.div>

        {/* White Card 1 */}
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
              <Users size={20} strokeWidth={2.5} className="text-emerald-600" />
            </div>
            <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold">
              +5.2%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Total Workforce</div>
            <div className="flex items-end gap-2">
              <div className="text-[28px] font-bold leading-none tracking-tight text-gray-900">348</div>
              <div className="text-[10px] text-gray-400 mb-1 font-medium">vs last month</div>
            </div>
          </div>
        </motion.div>

        {/* White Card 2 */}
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} strokeWidth={2.5} className="text-red-600" />
            </div>
            <div className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[11px] font-bold">
              -2.1%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Critical Issues</div>
            <div className="flex items-end gap-2">
              <div className="text-[28px] font-bold leading-none tracking-tight text-gray-900">7</div>
              <div className="text-[10px] text-gray-400 mb-1 font-medium">vs last month</div>
            </div>
          </div>
        </motion.div>

        {/* White Card 3 */}
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
              <Box size={20} strokeWidth={2.5} className="text-amber-600" />
            </div>
            <div className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold">
              +18.3%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Material Deliveries</div>
            <div className="flex items-end gap-2">
              <div className="text-[28px] font-bold leading-none tracking-tight text-gray-900">124</div>
              <div className="text-[10px] text-gray-400 mb-1 font-medium">vs last month</div>
            </div>
          </div>
        </motion.div>

        {/* Bar Chart Card (Spans 2 columns to make it readable, or 1 column if extremely compact. Let's try 2 cols so it's not totally squished) */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Budget vs Actual Cost</h2>
              <div className="text-xs text-gray-500 font-medium flex items-center gap-3">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> Actual</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Budget</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
              Year <ChevronDown size={14} strokeWidth={2.5} className="text-gray-500" />
            </button>
          </div>
          
          <div className="h-[200px] w-full flex items-end justify-between px-2 gap-2">
            {[
              { label: 'Jan', actual: 80, budget: 100 },
              { label: 'Feb', actual: 65, budget: 85 },
              { label: 'Mar', actual: 40, budget: 60 },
              { label: 'Apr', actual: 110, budget: 90 },
              { label: 'May', actual: 75, budget: 80 },
              { label: 'Jun', actual: 50, budget: 70 },
              { label: 'Jul', actual: 85, budget: 100 },
            ].map((month, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2 group relative">
                <div className="flex items-end justify-center gap-1 w-full h-[160px]">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${month.actual}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-1/2 max-w-[16px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-full transition-all group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] relative cursor-pointer" 
                  >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap z-10 font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-400"></div> ${month.actual}k Actual</span>
                        <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-600"></div> ${month.budget}k Budget</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${month.budget}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.2 }}
                    className="w-1/2 max-w-[16px] bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full transition-all group-hover:shadow-[0_0_10px_rgba(56,189,248,0.5)] cursor-pointer" 
                  ></motion.div>
                </div>
                <span className="text-[10px] font-semibold text-gray-400">{month.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cash Flow Widget */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Cash Flow</h2>
              <p className="text-xs text-gray-500 font-medium">Revenue vs Expenses (YTD)</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <CreditCard size={20} />
            </div>
          </div>

          <div className="flex-1 w-full h-[200px] -ml-2 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis hide domain={['auto', 'auto']} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  labelStyle={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart Card */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center">
          <div className="flex justify-between items-start w-full mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Workforce</h2>
              <p className="text-xs text-gray-500 font-medium">Distribution</p>
            </div>
          </div>

          <div className="relative w-36 h-36 mb-6 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
              <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" strokeDasharray="263.9" initial={{ strokeDashoffset: 263.9 }} animate={{ strokeDashoffset: 263.9 - (263.9 * 0.7) }} transition={{ duration: 1.5, ease: "easeOut" }} />
              
              <circle cx="50" cy="50" r="34" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
              <motion.circle cx="50" cy="50" r="34" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="213.6" initial={{ strokeDashoffset: 213.6 }} animate={{ strokeDashoffset: 213.6 - (213.6 * 0.6) }} transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }} />
              
              <circle cx="50" cy="50" r="26" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
              <motion.circle cx="50" cy="50" r="26" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" strokeDasharray="163.4" initial={{ strokeDashoffset: 163.4 }} animate={{ strokeDashoffset: 163.4 - (163.4 * 0.4) }} transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">348</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Workers</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center"><Building2 size={10} className="text-blue-600" /></div>
                Concrete
              </div>
              <span className="text-xs font-bold text-gray-900">120</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center"><HardHat size={10} className="text-red-600" /></div>
                Steel
              </div>
              <span className="text-xs font-bold text-gray-900">85</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center"><Users size={10} className="text-gray-600" /></div>
                General
              </div>
              <span className="text-xs font-bold text-gray-900">143</span>
            </div>
          </div>
        </motion.div>


        {/* Equipment Utilization Widget */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Equipment</h2>
              <p className="text-xs text-gray-500 font-medium">Machinery status</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Truck size={20} className="text-indigo-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-700">Excavators</span>
                <span className="text-gray-900">85%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-indigo-500 rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-700">Cranes</span>
                <span className="text-gray-900">60%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-blue-500 rounded-full"></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-700">Dump Trucks</span>
                <span className="text-gray-900">92%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-emerald-500 rounded-full"></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Safety & Incidents Widget */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Safety</h2>
              <p className="text-xs text-gray-500 font-medium">Site incidents</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} className="text-emerald-600" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-2 relative">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bg-emerald-100 w-20 h-20 rounded-full opacity-50 blur-xl"></motion.div>
            <div className="text-4xl font-black text-gray-900 mb-2 relative z-10">42</div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-full relative z-10">Days Zero Incidents</div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs font-medium">
            <span className="text-gray-500">Minor this month</span>
            <span className="text-gray-900 font-bold">2</span>
          </div>
        </motion.div>

        {/* Weather & Site Conditions Widget */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Conditions</h2>
              <p className="text-xs text-gray-500 font-medium">Weather impact</p>
            </div>
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
              <CloudRain size={20} />
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="text-4xl font-black text-gray-900 tracking-tighter">18&deg;</div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700"><Thermometer size={12} className="text-gray-400" /> H 22&deg; / L 14&deg;</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700"><Wind size={12} className="text-gray-400" /> 12 km/h</div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2 border border-amber-100 relative z-10">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-amber-900 mb-0.5">Delay Warning</p>
              <p className="text-[10px] font-medium text-amber-700 leading-tight">Rain expected at 14:00. Pouring may be delayed.</p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Milestones Timeline */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Milestones</h2>
              <p className="text-xs text-gray-500 font-medium">Next 7 days</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
              <CalendarClock size={20} />
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-around relative pl-1">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100 rounded-full"></div>
            
            <div className="relative pl-6 pb-3">
              <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white shadow-sm"></div>
              <p className="text-[10px] font-bold text-indigo-500 mb-0.5">TOMORROW</p>
              <p className="text-xs font-bold text-gray-900">Alpha Sign-off</p>
            </div>
            
            <div className="relative pl-6 pb-3">
              <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white shadow-sm"></div>
              <p className="text-[10px] font-bold text-emerald-500 mb-0.5">FRIDAY</p>
              <p className="text-xs font-bold text-gray-900">Steel Delivery</p>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-gray-300 ring-2 ring-white"></div>
              <p className="text-[10px] font-bold text-gray-400 mb-0.5">MONDAY</p>
              <p className="text-xs font-bold text-gray-600">Phase 2 Start</p>
            </div>
          </div>
        </motion.div>

        {/* Daily Attendance Overview */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Attendance</h2>
              <p className="text-xs text-gray-500 font-medium">Daily workforce</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
              <UserCheck size={20} />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-black text-gray-900">94%</span>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider ml-2">Present</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-700">327</span>
                <span className="text-xs text-gray-500 block">/ 348 Total</span>
              </div>
            </div>
            
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
              <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-indigo-500"></motion.div>
              <motion.div initial={{ width: 0 }} animate={{ width: '6%' }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-red-400"></motion.div>
            </div>

            <div className="flex justify-between text-xs font-medium pt-2 border-t border-gray-50">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400"></div> 21 Absent</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"></div> 42 Overtime</span>
            </div>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-red-50 shadow-[0_4px_24px_rgba(239,68,68,0.05)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Inventory Alerts</h2>
              <p className="text-xs text-red-500 font-medium">Below minimum stock</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 relative">
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              <PackageMinus size={20} />
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-900">Cement (Grade 53)</p>
                <p className="text-[10px] text-red-600 font-medium">Min: 500 Bags</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-red-600">120</p>
                <p className="text-[9px] text-red-400 uppercase font-bold">In Stock</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-900">Steel Rebar (12mm)</p>
                <p className="text-[10px] text-amber-600 font-medium">Min: 10 Tons</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-amber-600">8.5</p>
                <p className="text-[9px] text-amber-400 uppercase font-bold">In Stock</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Material Requests Pipeline */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Requests</h2>
              <p className="text-xs text-gray-500 font-medium">Material procurement</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ClipboardList size={20} />
            </div>
          </div>
          
          <div className="flex flex-col justify-around flex-1 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 text-right text-xs font-bold text-amber-500">12</div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1 }} className="h-full bg-amber-400 rounded-full"></motion.div>
              </div>
              <div className="w-16 text-[10px] font-bold text-gray-500 uppercase">Pending</div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 text-right text-xs font-bold text-blue-500">8</div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, delay: 0.1 }} className="h-full bg-blue-500 rounded-full"></motion.div>
              </div>
              <div className="w-16 text-[10px] font-bold text-gray-500 uppercase">Ordered</div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 text-right text-xs font-bold text-emerald-500">24</div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-emerald-500 rounded-full"></motion.div>
              </div>
              <div className="w-16 text-[10px] font-bold text-gray-500 uppercase">Delivered</div>
            </div>
          </div>
        </motion.div>

        {/* Site Activities Progress */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center">
          <div className="flex justify-between items-start w-full mb-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Task Progress</h2>
              <p className="text-xs text-gray-500 font-medium">Active site activities</p>
            </div>
            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
              <Target size={20} />
            </div>
          </div>

          <div className="relative w-32 h-32 flex-shrink-0 mt-2">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
              <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }} animate={{ strokeDashoffset: 251.2 - (251.2 * 0.68) }} transition={{ duration: 1.5, ease: "easeOut" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900">68%</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Completed</span>
            </div>
          </div>

          <div className="w-full flex justify-between mt-4 px-2">
             <div className="text-center">
               <p className="text-sm font-bold text-gray-900">42</p>
               <p className="text-[10px] font-semibold text-gray-500 uppercase">Pending</p>
             </div>
             <div className="text-center">
               <p className="text-sm font-bold text-sky-600">18</p>
               <p className="text-[10px] font-semibold text-sky-600/70 uppercase">In Progress</p>
             </div>
             <div className="text-center">
               <p className="text-sm font-bold text-emerald-600">128</p>
               <p className="text-[10px] font-semibold text-emerald-600/70 uppercase">Done</p>
             </div>
          </div>
        </motion.div>

        {/* Recent Activity Widget */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
           <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-0.5">Recent Activity</h2>
              <p className="text-xs text-gray-500 font-medium">Latest project updates</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12 w-full justify-between mt-2">
            <motion.div whileHover={{ y: -2 }} className="flex items-start gap-3 transition-transform cursor-pointer">
              <div className="mt-0.5"><CheckCircle size={16} className="text-emerald-500" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Concrete poured</p>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5"><Clock size={12} /> 2 hours ago &middot; Alpha</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="flex items-start gap-3 transition-transform cursor-pointer">
              <div className="mt-0.5"><CheckCircle size={16} className="text-emerald-500" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Blueprint approval</p>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5"><Clock size={12} /> 5 hours ago &middot; Beta</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="flex items-start gap-3 transition-transform cursor-pointer">
              <div className="mt-0.5"><CheckCircle size={16} className="text-emerald-500" /></div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Material delivered</p>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5"><Clock size={12} /> 1 day ago &middot; Gamma</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus, Search, UserCheck, HardHat, Phone, DollarSign, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetWorkersQuery } from '../../../store/api/workersApi';
import { Worker } from '../../../types';
import { motion } from 'framer-motion';

export default function WorkersPage() {
  const { data: workers, isLoading, error } = useGetWorkersQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredWorkers = workers?.filter((w) => 
    w.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.trade.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <HardHat className="text-primary h-8 w-8" />
            Workforce & Attendance
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage site workers, trades, and daily attendance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="w-full md:w-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <UserCheck className="mr-2 h-4 w-4 text-emerald-500" />
            Mark Attendance
          </Button>
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Worker
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 w-full md:w-auto flex-grow max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl w-full focus-visible:ring-primary/20"
              placeholder="Search workers by name or trade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-48">
            <Input
              type="date"
              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus-visible:ring-primary/20"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <Card className="rounded-2xl border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-destructive p-8 text-center bg-destructive/5 m-4 rounded-xl border border-destructive/20">
              <p className="font-bold">Failed to load workers.</p>
              <p className="text-sm mt-1 text-destructive/80">Please try again later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Worker Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contractor</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Wage</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredWorkers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-16 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <HardHat className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="font-medium text-gray-900 dark:text-white">No workers found</p>
                          <p className="text-sm">Try adjusting your search criteria or add a new worker.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredWorkers.map((worker: Worker, i: number) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={worker.id} 
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {worker.worker_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{worker.worker_name}</span>
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded w-fit mt-1">{worker.trade}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="h-3 w-3 mr-2 text-gray-400" />
                            {worker.phone || <span className="text-gray-400 italic">Not provided</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Briefcase className="h-3 w-3 mr-2 text-gray-400" />
                            {worker.contractor_name || 'Direct Hire'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-0.5" />
                            {worker.daily_wage || 0} <span className="text-xs text-gray-400 font-normal ml-1">/ day</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {worker.is_active ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            Edit
                          </Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

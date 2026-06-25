'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, ArrowLeft, FileText, Package, Calendar, Hash, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetRequestsQuery } from '../../../../store/api/materialsApi';
import { MaterialRequest } from '../../../../types';
import { motion } from 'framer-motion';

export default function MaterialRequestsPage() {
  const router = useRouter();
  const { data: requests, isLoading, error } = useGetRequestsQuery({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests?.filter((req) =>
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusDisplay = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved': return { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: <CheckCircle2 size={12} className="mr-1" /> };
      case 'pending': return { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: <Clock size={12} className="mr-1" /> };
      case 'ordered': return { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: <Truck size={12} className="mr-1" /> };
      case 'delivered': return { color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', icon: <Package size={12} className="mr-1" /> };
      case 'cancelled': return { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: <XCircle size={12} className="mr-1" /> };
      default: return { color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700', icon: null };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}  
            className="w-fit pl-0 text-muted-foreground hover:text-foreground hover:bg-transparent -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Materials
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="text-blue-500 h-8 w-8" />
              Purchase Orders & Requests
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track material requests across all projects.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 md:mt-12">
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] mt-2">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl w-full focus-visible:ring-primary/20"
            placeholder="Search requests by ID or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              <p className="font-bold">Failed to load material requests.</p>
              <p className="text-sm mt-1 text-destructive/80">Please check your connection and try again.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Material ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-16 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-12 w-12 text-gray-300 mb-3" />
                          <p className="font-medium text-gray-900 dark:text-white">No requests found</p>
                          <p className="text-sm">Try adjusting your search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req: MaterialRequest, i: number) => {
                      const statusConfig = getStatusDisplay(req.status);
                      return (
                        <motion.tr 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={req.id} 
                          className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Hash className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-bold font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {req.id.substring(0, 8)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1.5 rounded-md">
                              PRJ-{req.project_id.substring(0, 5)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {req.material_id?.substring(0, 8) || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-base font-black text-gray-900 dark:text-white">
                              {req.quantity_requested}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${statusConfig.color}`}>
                              {statusConfig.icon}
                              {req.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                              <Calendar className="h-4 w-4 mr-2 opacity-70" />
                              {new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Review
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })
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

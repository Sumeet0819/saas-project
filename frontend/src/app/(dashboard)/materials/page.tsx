'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText, Package, PackageOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetInventoryQuery } from '../../../store/api/materialsApi';
import { MaterialInventory } from '../../../types';
import { motion } from 'framer-motion';

export default function MaterialsPage() {
  const router = useRouter();
  const { data: inventory, isLoading, error } = useGetInventoryQuery({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering by material ID since we don't have joined material_name in the raw UI model yet
  const filteredInventory = inventory?.filter((item) =>
    item.material_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-primary h-8 w-8" />
            Material Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track material stock, consumption, and requests.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="w-full md:w-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
            onClick={() => router.push('/materials/requests')}
          >
            <FileText className="mr-2 h-4 w-4 text-blue-500" />
            Purchase Orders
          </Button>
          <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Update Stock
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl w-full focus-visible:ring-primary/20"
            placeholder="Search materials by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center p-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-destructive p-8 text-center bg-destructive/5 rounded-2xl border border-destructive/20 max-w-md mx-auto mt-12">
          <p className="font-bold">Failed to load inventory.</p>
          <p className="text-sm mt-1 text-destructive/80">Please check your connection and try again.</p>
        </div>
      ) : (
        <div className="w-full">
          {filteredInventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <PackageOpen className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No inventory records found</h3>
              <p className="text-gray-500 text-sm">Add some materials or update your search filter.</p>
            </div>
          ) : (
            <motion.div 
              initial={{opacity: 0, y: 10}} 
              animate={{opacity: 1, y: 0}} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredInventory.map((item: MaterialInventory, i: number) => {
                const isCritical = item.current_stock <= 50;
                const isLow = item.current_stock > 50 && item.current_stock <= 100;
                const isOk = item.current_stock > 100;

                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.id}
                  >
                    <Card className={`rounded-2xl border ${isCritical ? 'border-destructive/30 shadow-destructive/5' : isLow ? 'border-amber-500/30 shadow-amber-500/5' : 'border-gray-100 dark:border-gray-800'} shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all h-full flex flex-col`}>
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                              MAT-{item.material_id.substring(0, 4)}
                            </span>
                            <span className="text-[10px] font-bold text-primary/80 bg-primary/10 px-2 py-0.5 rounded w-fit mt-1 uppercase tracking-wider">
                              PRJ: {item.project_id.substring(0, 6)}
                            </span>
                          </div>
                          
                          <div className={`p-2 rounded-xl ${isCritical ? 'bg-destructive/10 text-destructive' : isLow ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {isCritical ? <AlertTriangle size={18} /> : isLow ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mb-4 flex-grow">
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex-1 border border-gray-100 dark:border-gray-800">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Current Stock</div>
                            <div className={`text-2xl font-black ${isCritical ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
                              {item.current_stock}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex-1 border border-gray-100 dark:border-gray-800">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Consumed</div>
                            <div className="text-xl font-bold text-gray-700 dark:text-gray-300">
                              {item.consumed_stock}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                            isCritical ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                            isLow ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                            'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          }`}>
                            {isCritical ? 'CRITICAL STOCK' : isLow ? 'LOW STOCK' : 'STOCK OK'}
                          </span>
                          <Button variant="ghost" size="sm" className="h-8">Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

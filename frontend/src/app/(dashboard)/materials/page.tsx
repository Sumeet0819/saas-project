'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetInventoryQuery } from '../../../store/api/materialsApi';
import { MaterialInventory } from '../../../types';

export default function MaterialsPage() {
  const router = useRouter();
  const { data: inventory, isLoading, error } = useGetInventoryQuery({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering by material ID since we don't have joined material_name in the raw UI model yet
  const filteredInventory = inventory?.filter((item) =>
    item.material_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="materials-page">
      <div className="page-header">
        <h1>Material Inventory</h1>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            
            onClick={() => router.push('/materials/requests')}
          >
            Purchase Orders
          </Button>
          <Button 
            variant="default" 
            
          >
            Update Stock
          </Button>
        </div>
      </div>

      <div className="materials-controls">
        <Input
          className="search-input"
          placeholder="Search materials..."
          
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
        </div>
      ) : error ? (
        <div className="text-[var(--status-danger)] p-4 text-center">
          Failed to load inventory. Please try again.
        </div>
      ) : (
        <div className="materials-grid">
          {filteredInventory.length === 0 ? (
            <div className="col-span-full text-center p-12 text-[var(--text-secondary)]">
              No inventory records found.
            </div>
          ) : (
            filteredInventory.map((item: MaterialInventory) => (
              <Card key={item.id} className="material-card">
                <CardContent className="p-5">
                  <div className="material-header">
                    <span className="material-name">Material {item.material_id.substring(0, 6)}</span>
                    <span className="project-badge">Proj: {item.project_id.substring(0, 6)}</span>
                  </div>
                  
                  <div className="stock-stats">
                    <div className="stat-box">
                      <span className="stat-label">Current Stock</span>
                      <span className={`stat-value ${item.current_stock < 100 ? 'danger' : ''}`}>
                        {item.current_stock}
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Consumed</span>
                      <span className="stat-value">{item.consumed_stock}</span>
                    </div>
                  </div>

                  <div className="material-footer">
                    <span className={`status-text ${item.current_stock > 100 ? 'ok' : item.current_stock > 50 ? 'low' : 'critical'}`}>
                      {item.current_stock > 100 ? 'Stock OK' : item.current_stock > 50 ? 'Low Stock' : 'Critical Stock'}
                    </span>
                    <Button variant="ghost" size="sm">Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Plus, Search, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetWorkersQuery } from '../../../store/api/workersApi';
import { Worker } from '../../../types';

export default function WorkersPage() {
  const { data: workers, isLoading, error } = useGetWorkersQuery();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers?.filter((w) => 
    w.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.trade.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="workers-page">
      <div className="page-header">
        <h1>Workforce & Attendance</h1>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            
          >
            Mark Attendance
          </Button>
          <Button 
            variant="default" 
            
          >
            Add Worker
          </Button>
        </div>
      </div>

      <div className="workers-controls">
        <Input
          className="search-input"
          placeholder="Search workers by name or trade..."
          
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Input
          type="date"
          className="filter-input"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
            </div>
          ) : error ? (
            <div className="text-[var(--status-danger)] p-4 text-center">
              Failed to load workers. Please try again.
            </div>
          ) : (
            <div className="workers-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Worker Info</th>
                    <th>Phone</th>
                    <th>Contractor</th>
                    <th>Daily Wage</th>
                    <th>Today's Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-[var(--text-secondary)]">
                        No workers found.
                      </td>
                    </tr>
                  ) : (
                    filteredWorkers.map((worker: Worker) => (
                      <tr key={worker.id}>
                        <td>
                          <div className="worker-name-cell">
                            <span className="worker-name">{worker.worker_name}</span>
                            <span className="worker-trade">{worker.trade}</span>
                          </div>
                        </td>
                        <td>{worker.phone || 'N/A'}</td>
                        <td>{worker.contractor_name || 'Direct'}</td>
                        <td>${worker.daily_wage || 0}/day</td>
                        <td>
                          {/* Mocking attendance status for UI */}
                          <span className={`attendance-badge ${worker.is_active ? 'present' : 'absent'}`}>
                            {worker.is_active ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
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

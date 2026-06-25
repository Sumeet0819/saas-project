'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetRequestsQuery } from '../../../../store/api/materialsApi';
import { MaterialRequest } from '../../../../types';

export default function MaterialRequestsPage() {
  const router = useRouter();
  const { data: requests, isLoading, error } = useGetRequestsQuery({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = requests?.filter((req) =>
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="requests-page">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}  className="px-0">
            Back
          </Button>
          <h1>Purchase Orders & Requests</h1>
        </div>
        <Button 
          variant="default" 
          
        >
          New Request
        </Button>
      </div>

      <div className="requests-controls">
        <Input
          className="search-input"
          placeholder="Search requests by ID or status..."
          
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              Failed to load material requests. Please try again.
            </div>
          ) : (
            <div className="requests-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Project</th>
                    <th>Material ID</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-[var(--text-secondary)]">
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req: MaterialRequest) => (
                      <tr key={req.id}>
                        <td><span className="request-id-cell">{req.id.substring(0, 8)}</span></td>
                        <td>{req.project_id.substring(0, 8)}...</td>
                        <td>{req.material_id?.substring(0, 8) || 'N/A'}</td>
                        <td>{req.quantity_requested}</td>
                        <td>
                          <span className={`status-badge ${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td>{new Date(req.created_at).toLocaleDateString()}</td>
                        <td>
                          <Button variant="ghost" size="sm">Review</Button>
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

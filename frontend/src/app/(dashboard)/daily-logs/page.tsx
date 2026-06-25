'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Image as ImageIcon, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetDailyLogsQuery } from '../../../store/api/logsApi';
import { DailyLog } from '../../../types';

export default function DailyLogsPage() {
  const { data: logs, isLoading, error } = useGetDailyLogsQuery({});
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app, we would join project data or fetch it,
  // but for the UI mockup we can just display the project ID or mocked data.
  const filteredLogs = logs?.filter((log) => 
    log.progress_update?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="daily-logs-page">
      <div className="page-header">
        <h1>Daily Logs</h1>
        <Button 
          variant="default" 
          
        >
          New Log
        </Button>
      </div>

      <div className="logs-controls">
        <Input
          className="filter-input"
          placeholder="Search updates..."
          
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Input
          type="date"
          className="filter-input"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
        </div>
      ) : error ? (
        <div className="text-[var(--status-danger)] p-4 text-center">
          Failed to load daily logs. Please try again.
        </div>
      ) : (
        <div className="logs-grid">
          {filteredLogs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-[var(--text-secondary)]">
                No daily logs found. Create one to get started.
              </CardContent>
            </Card>
          ) : (
            filteredLogs.map((log: DailyLog) => (
              <Card key={log.id} className="log-card">
                <CardContent className="p-6">
                  <div className="log-header">
                    <span className="log-project">Project: {log.project_id.substring(0, 8)}...</span>
                    <span className="log-date">
                      <Calendar size={14} />
                      {new Date(log.log_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="log-content">
                    {log.progress_update || 'No progress update provided.'}
                  </div>

                  <div className="log-footer">
                    {log.photo_link ? (
                      <button className="log-photos-btn">
                        <ImageIcon size={16} />
                        View Attachment
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--text-tertiary)]">No photos attached</span>
                    )}
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

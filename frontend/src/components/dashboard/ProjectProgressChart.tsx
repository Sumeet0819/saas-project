'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Skyline Tower', planned: 85, actual: 78 },
  { name: 'Riverfront Condo', planned: 40, actual: 42 },
  { name: 'Tech Park', planned: 90, actual: 95 },
  { name: 'Metro Station', planned: 25, actual: 20 },
  { name: 'City Hospital', planned: 60, actual: 55 },
];

export default function ProjectProgressChart() {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }} 
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
          <Bar dataKey="planned" name="Planned %" fill="var(--text-tertiary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" name="Actual %" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

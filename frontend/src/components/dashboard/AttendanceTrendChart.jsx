import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from '../ui/ChartContainer.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { FiTrendingUp } from 'react-icons/fi';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-elevated dark:border-border-dark dark:bg-surface-dark">
      <p className="mb-1 font-medium text-slate-600 dark:text-slate-300">{label}</p>
      <p className="text-brand-600 dark:text-brand-400">{payload[0].value}% attendance</p>
    </div>
  );
};

const AttendanceTrendChart = ({ data = [] }) => (
  <ChartContainer title="Attendance Trend" subtitle="Last 7 days">
    {data.length === 0 ? (
      <EmptyState icon={FiTrendingUp} title="No attendance marked yet" description="Trend appears once attendance is recorded" />
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, top: 8 }}>
          <defs>
            <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3D5AFE" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3D5AFE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="percentage" stroke="#3D5AFE" strokeWidth={2.5} fill="url(#attendanceFill)" dot={{ r: 3, fill: '#3D5AFE' }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </ChartContainer>
);

export default AttendanceTrendChart;

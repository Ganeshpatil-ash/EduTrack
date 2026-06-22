import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FiCheckCircle, FiXCircle, FiTrendingUp, FiZap } from 'react-icons/fi';
import { Card, CardBody } from '../ui/Card.jsx';

const StatTile = ({ icon: Icon, label, value, tone }) => (
  <Card hover className="p-4">
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-display font-bold text-slate-900 dark:text-slate-50">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  </Card>
);

const AttendanceStats = ({ summary }) => {
  const { total, present, absent, pct, streak } = summary;
  const pieData = [
    { name: 'Present', value: present || 0, color: '#16A34A' },
    { name: 'Absent', value: absent || 0, color: '#E11D48' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatTile icon={FiCheckCircle} label="Present" value={present} tone="bg-success-bg text-success dark:bg-success-bg-dark dark:text-success-dark" />
      <StatTile icon={FiXCircle} label="Absent" value={absent} tone="bg-danger-bg text-danger dark:bg-danger-bg-dark dark:text-danger-dark" />
      <StatTile icon={FiTrendingUp} label="Attendance Rate" value={`${pct}%`} tone="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300" />
      <StatTile icon={FiZap} label="Current Streak" value={`${streak} day${streak === 1 ? '' : 's'}`} tone="bg-accent-50 text-accent-600 dark:bg-accent-700/20 dark:text-accent-300" />

      <Card className="flex items-center justify-center p-2 sm:col-span-2 lg:col-span-1">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height={88}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={24} outerRadius={38} paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="px-2 text-center text-xs text-slate-400">No data yet</p>
        )}
      </Card>
    </div>
  );
};

export default AttendanceStats;

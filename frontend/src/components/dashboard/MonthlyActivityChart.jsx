import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../ui/ChartContainer.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { FiActivity } from 'react-icons/fi';

const MonthlyActivityChart = ({ data = [] }) => {
  const hasData = data.some((d) => d.students || d.courses || d.attendance);
  return (
    <ChartContainer title="Monthly Activity" subtitle="New records created, last 6 months">
      {!hasData ? (
        <EmptyState icon={FiActivity} title="No activity recorded yet" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-100 dark:stroke-slate-800" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="students" name="Students" stackId="a" fill="#5B74FF" radius={[0, 0, 0, 0]} />
            <Bar dataKey="courses" name="Courses" stackId="a" fill="#F5A623" radius={[0, 0, 0, 0]} />
            <Bar dataKey="attendance" name="Attendance" stackId="a" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default MonthlyActivityChart;

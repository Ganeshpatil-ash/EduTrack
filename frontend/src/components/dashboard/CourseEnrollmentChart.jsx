import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from '../ui/ChartContainer.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { FiBookOpen } from 'react-icons/fi';

const COLORS = ['#5B74FF', '#F5A623', '#0EA5E9', '#22C55E', '#FB7185', '#A78BFA', '#5B74FF', '#F5A623'];

const CourseEnrollmentChart = ({ data = [] }) => (
  <ChartContainer title="Course Enrollment" subtitle="Distinct students per course (by attendance)">
    {data.length === 0 ? (
      <EmptyState icon={FiBookOpen} title="No enrollment data" description="Mark attendance to populate this chart" />
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-100 dark:stroke-slate-800" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="courseCode" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            formatter={(value, _, p) => [`${value} students`, p.payload.courseName]}
          />
          <Bar dataKey="students" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </ChartContainer>
);

export default CourseEnrollmentChart;

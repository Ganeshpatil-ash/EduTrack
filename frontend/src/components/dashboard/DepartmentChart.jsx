import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartContainer from '../ui/ChartContainer.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { FiPieChart } from 'react-icons/fi';

const COLORS = ['#5B74FF', '#F5A623', '#0EA5E9', '#22C55E', '#FB7185', '#A78BFA'];

const DepartmentChart = ({ data = [] }) => {
  const chartData = data.map((d) => ({ name: d._id || 'Unassigned', value: d.count }));
  return (
    <ChartContainer title="Students by Department" subtitle="Current enrollment split">
      {chartData.length === 0 ? (
        <EmptyState icon={FiPieChart} title="No students yet" description="Add students to see the breakdown" />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default DepartmentChart;

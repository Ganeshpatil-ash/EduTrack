import React from 'react';

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

const DashboardCard = ({ title, value, icon: Icon, color = 'blue', suffix = '' }) => {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {value}
          {suffix}
        </p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorMap[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default DashboardCard;

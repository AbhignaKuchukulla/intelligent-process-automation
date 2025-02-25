import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
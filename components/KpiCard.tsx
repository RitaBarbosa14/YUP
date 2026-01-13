
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  colorClass?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, icon, colorClass = "text-orange-600" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
  );
};

export default KpiCard;

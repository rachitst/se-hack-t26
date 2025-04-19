import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  className = '',
}) => {
  const isPositive = change && change > 0;
  const changeValue = Math.abs(change || 0);

  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <div className="card p-6 relative z-10">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white z-0" />
        
        {/* Icon with background effect */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary-50 text-primary-600 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
                {icon}
              </div>
              <h3 className="text-sm font-medium text-slate-600">{title}</h3>
            </div>
            {change !== undefined && (
              <div className={`flex items-center space-x-1 text-sm ${
                isPositive ? 'text-success-600' : 'text-error-600'
              }`}>
                {isPositive ? (
                  <ArrowUp size={16} className="flex-shrink-0" />
                ) : (
                  <ArrowDown size={16} className="flex-shrink-0" />
                )}
                <span className="font-medium">{changeValue}%</span>
              </div>
            )}
          </div>

          {/* Value and label */}
          <div className="space-y-2">
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            {changeLabel && (
              <p className="text-xs text-slate-500">{changeLabel}</p>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary-50/20 to-transparent transform translate-x-12 group-hover:translate-x-0 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </div>
    </div>
  );
};

export default StatCard;
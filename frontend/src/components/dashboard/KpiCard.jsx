import React from 'react';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';
import { Card } from '../ui/Card.jsx';
import AnimatedCounter from '../ui/AnimatedCounter.jsx';
import { cn } from '../../lib/utils';

const trendStyles = {
  up: 'text-success bg-success-bg dark:bg-success-bg-dark dark:text-success-dark',
  down: 'text-danger bg-danger-bg dark:bg-danger-bg-dark dark:text-danger-dark',
  flat: 'text-slate-400 bg-surface-alt dark:bg-surface-alt-dark',
};
const trendIcon = { up: FiArrowUp, down: FiArrowDown, flat: FiMinus };

const KpiCard = ({ icon: Icon, label, value, suffix = '', trend, tone = 'brand' }) => {
  const TrendIcon = trend ? trendIcon[trend.direction] : null;
  const tones = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300',
    accent: 'bg-accent-50 text-accent-600 dark:bg-accent-700/20 dark:text-accent-300',
    success: 'bg-success-bg text-success dark:bg-success-bg-dark dark:text-success-dark',
    info: 'bg-info-bg text-info dark:bg-info-bg-dark dark:text-info-dark',
  };

  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{label}</p>
          <p className="mt-2 font-display text-[28px] font-bold leading-none text-slate-900 dark:text-slate-50">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
        </div>
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn('inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold', trendStyles[trend.direction])}>
            <TrendIcon className="h-2.5 w-2.5" /> {trend.deltaPct}%
          </span>
          <span className="text-[11px] text-slate-400">{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

export default KpiCard;

import React from 'react';
import { cn } from '../../lib/utils';

const tones = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-700/20 dark:text-accent-300',
  success: 'bg-success-bg text-success dark:bg-success-bg-dark dark:text-success-dark',
  danger: 'bg-danger-bg text-danger dark:bg-danger-bg-dark dark:text-danger-dark',
  warning: 'bg-warning-bg text-warning dark:bg-warning-bg-dark dark:text-warning-dark',
  info: 'bg-info-bg text-info dark:bg-info-bg-dark dark:text-info-dark',
  neutral: 'bg-surface-alt text-slate-600 dark:bg-surface-alt-dark dark:text-slate-300',
};

const Badge = ({ tone = 'neutral', className, children, icon: Icon, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
      tones[tone],
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-3 w-3" />}
    {children}
  </span>
);

export default Badge;

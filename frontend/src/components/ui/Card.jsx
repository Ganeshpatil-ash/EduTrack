import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Card = ({ className, hover = false, as: Comp = motion.div, ...props }) => (
  <Comp
    className={cn(
      'rounded-xl border border-border bg-surface shadow-soft transition-all duration-200 dark:border-border-dark dark:bg-surface-dark',
      hover && 'hover:-translate-y-0.5 hover:shadow-elevated dark:hover:shadow-elevated-dark',
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-between px-5 pt-5', className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('font-display text-[15px] font-semibold text-slate-900 dark:text-slate-50', className)} {...props} />
);

export const CardBody = ({ className, ...props }) => (
  <div className={cn('p-5', className)} {...props} />
);

export default Card;

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 border-b border-border dark:border-border-dark">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={cn(
          'relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors',
          active === tab.value ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
        )}
      >
        {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
        {tab.label}
        {active === tab.value && (
          <motion.div layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600 dark:bg-brand-400" />
        )}
      </button>
    ))}
  </div>
);

export default Tabs;

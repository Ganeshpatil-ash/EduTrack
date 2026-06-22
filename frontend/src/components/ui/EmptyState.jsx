import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center"
  >
    {Icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt dark:bg-surface-alt-dark">
        <Icon className="h-5 w-5 text-slate-400" />
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
    {action}
  </motion.div>
);

export default EmptyState;

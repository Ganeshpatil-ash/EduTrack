import React from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { cn } from '../../lib/utils';

export const Table = ({ className, children }) => (
  <div className="overflow-x-auto">
    <table className={cn('w-full text-sm', className)}>{children}</table>
  </div>
);

export const Thead = ({ children }) => (
  <thead className="bg-surface-alt dark:bg-surface-alt-dark">
    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children}
    </tr>
  </thead>
);

export const Th = ({ children, sortable, sortDir, onSort, className, ...props }) => (
  <th className={cn('px-4 py-3 first:rounded-tl-lg last:rounded-tr-lg', className)} {...props}>
    {sortable ? (
      <button onClick={onSort} className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200">
        {children}
        <span className="flex flex-col -space-y-1 text-[8px]">
          <FiChevronUp className={cn(sortDir === 'asc' ? 'text-brand-600' : 'text-slate-300 dark:text-slate-600')} />
          <FiChevronDown className={cn(sortDir === 'desc' ? 'text-brand-600' : 'text-slate-300 dark:text-slate-600')} />
        </span>
      </button>
    ) : (
      children
    )}
  </th>
);

export const Tbody = ({ children }) => (
  <tbody className="divide-y divide-border dark:divide-border-dark">{children}</tbody>
);

export const Tr = ({ className, ...props }) => (
  <tr className={cn('group transition-colors hover:bg-surface-alt/60 dark:hover:bg-surface-alt-dark/60', className)} {...props} />
);

export const Td = ({ className, ...props }) => (
  <td className={cn('px-4 py-3 align-middle text-slate-700 dark:text-slate-300', className)} {...props} />
);

export default Table;

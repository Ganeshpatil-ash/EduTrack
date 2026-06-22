import React from 'react';
import { cn } from '../../lib/utils';

export const Label = ({ className, required, children, ...props }) => (
  <label className={cn('mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300', className)} {...props}>
    {children} {required && <span className="text-danger">*</span>}
  </label>
);

export const Input = React.forwardRef(({ className, icon: Icon, error, ...props }, ref) => (
  <div className="relative">
    {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-surface px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-brand-500 dark:bg-surface-dark dark:text-slate-100',
        Icon && 'pl-9',
        error ? 'border-danger' : 'border-border dark:border-border-dark',
        className
      )}
      {...props}
    />
  </div>
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-brand-500 dark:bg-surface-dark dark:text-slate-100',
      error ? 'border-danger' : 'border-border dark:border-border-dark',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-10 w-full rounded-lg border bg-surface px-3 text-sm text-slate-900 transition-colors duration-150 focus:border-brand-500 dark:bg-surface-dark dark:text-slate-100',
      error ? 'border-danger' : 'border-border dark:border-border-dark',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

export const ErrorText = ({ children }) =>
  children ? <p className="mt-1 text-xs text-danger">{children}</p> : null;

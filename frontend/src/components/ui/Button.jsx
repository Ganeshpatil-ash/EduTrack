import React from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-soft disabled:bg-brand-300',
  secondary:
    'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-surface-alt dark:hover:bg-surface-alt-dark',
  ghost: 'text-slate-600 dark:text-slate-300 hover:bg-surface-alt dark:hover:bg-surface-alt-dark',
  danger: 'bg-danger text-white hover:bg-danger/90 disabled:bg-danger/40',
  outlineDanger:
    'border border-danger/30 text-danger hover:bg-danger-bg dark:hover:bg-danger-bg-dark',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-[38px] px-3.5 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9',
};

const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <FiLoader className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  )
);
Button.displayName = 'Button';

export default Button;

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Dropdown = ({ trigger, children, align = 'right', className }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-30 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-surface py-1.5 shadow-elevated dark:border-border-dark dark:bg-surface-dark dark:shadow-elevated-dark',
              align === 'right' ? 'right-0' : 'left-0',
              className
            )}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ icon: Icon, children, danger, ...props }) => (
  <button
    className={cn(
      'flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors',
      danger ? 'text-danger hover:bg-danger-bg dark:hover:bg-danger-bg-dark' : 'text-slate-700 hover:bg-surface-alt dark:text-slate-200 dark:hover:bg-surface-alt-dark'
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);

export default Dropdown;

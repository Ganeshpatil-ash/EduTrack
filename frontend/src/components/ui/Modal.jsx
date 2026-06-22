import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { cn } from '../../lib/utils';

const Modal = ({ open, onClose, title, description, children, size = 'md', footer }) => {
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className={cn(
              'relative w-full max-h-[88vh] overflow-y-auto rounded-2xl border border-border bg-surface shadow-elevated dark:border-border-dark dark:bg-surface-dark dark:shadow-elevated-dark',
              widths[size]
            )}
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between border-b border-border px-6 py-4 dark:border-border-dark">
                <div>
                  {title && <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-50">{title}</h3>}
                  {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-surface-alt hover:text-slate-600 dark:hover:bg-surface-alt-dark"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="px-6 py-5">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-border px-6 py-4 dark:border-border-dark">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;

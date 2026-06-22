import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from './Button.jsx';

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-border px-1 pt-3 dark:border-border-dark">
      <p className="text-xs text-slate-400">
        Page <span className="font-medium text-slate-600 dark:text-slate-300">{page}</span> of {pages} &middot; {total} total
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <FiChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
          <FiChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

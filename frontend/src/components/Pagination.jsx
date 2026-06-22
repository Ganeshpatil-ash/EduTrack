import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-1 py-3">
      <p className="text-xs text-gray-500">
        Page {page} of {pages} &middot; {total} total
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-secondary px-2.5 py-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="btn-secondary px-2.5 py-1.5 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

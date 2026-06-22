import React from 'react';
import { cn } from '../../lib/utils';

const Skeleton = ({ className }) => (
  <div className={cn('relative overflow-hidden rounded-md bg-surface-alt dark:bg-surface-alt-dark', className)}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-4 py-3">
    <Skeleton className="h-8 w-8 rounded-full" />
    <Skeleton className="h-3.5 w-32" />
    <Skeleton className="h-3.5 w-24" />
    <Skeleton className="ml-auto h-3.5 w-16" />
  </div>
);

export const SkeletonCard = () => (
  <div className="rounded-xl border border-border bg-surface p-5 dark:border-border-dark dark:bg-surface-dark">
    <Skeleton className="mb-3 h-3 w-20" />
    <Skeleton className="mb-1 h-7 w-16" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export default Skeleton;

import React from 'react';
import { cn } from '../../lib/utils';
import { initials } from '../../lib/utils';

const sizes = { sm: 'h-7 w-7 text-[11px]', md: 'h-9 w-9 text-xs', lg: 'h-14 w-14 text-base', xl: 'h-24 w-24 text-2xl' };

const palette = ['bg-brand-100 text-brand-700', 'bg-accent-100 text-accent-700', 'bg-info-bg text-info', 'bg-success-bg text-success'];

const Avatar = ({ name = '', src, size = 'md', className }) => {
  const colorIndex = name.charCodeAt(0) ? name.charCodeAt(0) % palette.length : 0;
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-surface dark:ring-surface-dark', sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-display font-semibold',
        sizes[size],
        palette[colorIndex],
        className
      )}
    >
      {initials(name) || '?'}
    </div>
  );
};

export default Avatar;

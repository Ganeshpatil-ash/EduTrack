import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn, formatDate } from '../../lib/utils';

const RATE_COLORS = [
  'bg-surface-alt dark:bg-surface-alt-dark',
  'bg-accent-100 dark:bg-accent-700/20',
  'bg-accent-300/80 dark:bg-accent-600/50',
  'bg-accent-500 dark:bg-accent-500',
  'bg-accent-600 dark:bg-accent-300',
];

const STATUS_COLORS = {
  0: 'bg-surface-alt dark:bg-surface-alt-dark',
  1: 'bg-danger/70 dark:bg-danger-dark/60',
  4: 'bg-success/80 dark:bg-success-dark/70',
};

/**
 * GitHub-contribution-style grid. mode='rate' renders an amber intensity
 * scale (aggregate daily engagement); mode='status' renders green/red for
 * a single student's Present/Absent days.
 */
const AttendanceHeatmap = ({ data = [], mode = 'rate', compact = false }) => {
  const [hovered, setHovered] = useState(null);

  const weeks = useMemo(() => {
    const padded = [...data];
    const firstDow = new Date(padded[0]?.date).getDay();
    for (let i = 0; i < firstDow; i++) padded.unshift(null);
    const result = [];
    for (let i = 0; i < padded.length; i += 7) result.push(padded.slice(i, i + 7));
    return result;
  }, [data]);

  const cellSize = compact ? 'h-2.5 w-2.5' : 'h-3 w-3';

  return (
    <div className="relative">
      <div className="flex gap-[3px] overflow-x-auto pb-1 scrollbar-thin">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => {
              if (!day) return <div key={di} className={cellSize} />;
              const color = mode === 'status'
                ? STATUS_COLORS[day.level] || STATUS_COLORS[0]
                : RATE_COLORS[day.level] || RATE_COLORS[0];
              return (
                <motion.div
                  key={di}
                  whileHover={{ scale: 1.4 }}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  className={cn(cellSize, 'cursor-pointer rounded-[3px] transition-colors', color)}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-2 flex h-5 items-center text-xs text-slate-400">
        {hovered ? (
          <span>
            <span className="font-medium text-slate-600 dark:text-slate-300">{formatDate(hovered.date)}</span>
            {mode === 'status'
              ? hovered.status ? ` — ${hovered.status}` : ' — No record'
              : hovered.count ? ` — ${Math.round((hovered.rate || 0) * 100)}% present (${hovered.count} marked)` : ' — No record'}
          </span>
        ) : (
          !compact && <span>Hover a day for details</span>
        )}
      </div>
    </div>
  );
};

export default AttendanceHeatmap;

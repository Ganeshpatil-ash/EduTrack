import React from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiBookOpen, FiCheckSquare, FiActivity } from 'react-icons/fi';
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { timeAgo } from '../../lib/utils';

const ICONS = { student: FiUserPlus, course: FiBookOpen, attendance: FiCheckSquare };
const TONES = {
  student: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300',
  course: 'bg-accent-50 text-accent-600 dark:bg-accent-700/20 dark:text-accent-300',
  attendance: 'bg-info-bg text-info dark:bg-info-bg-dark dark:text-info-dark',
};

const ActivityTimeline = ({ activities = [] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardBody>
      {activities.length === 0 ? (
        <EmptyState icon={FiActivity} title="Nothing has happened yet" description="New students, courses and attendance will show up here" />
      ) : (
        <ol className="relative space-y-5 pl-1">
          <div className="absolute bottom-2 left-[18px] top-2 w-px bg-border dark:bg-border-dark" />
          {activities.map((a, i) => {
            const Icon = ICONS[a.type] || FiActivity;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative flex items-start gap-3.5"
              >
                <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-surface dark:ring-surface-dark ${TONES[a.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 pt-1.5">
                  <p className="text-sm text-slate-700 dark:text-slate-200">{a.message}</p>
                  <p className="text-xs text-slate-400">{timeAgo(a.date)}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      )}
    </CardBody>
  </Card>
);

export default ActivityTimeline;

import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiUser, FiUsers, FiAward } from 'react-icons/fi';
import { Card } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

const GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-accent-500 to-accent-700',
  'from-info to-brand-600',
  'from-success to-brand-600',
];

const CourseCard = ({ course, enrolledCount = 0, onEdit, onDelete, index = 0 }) => {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="group overflow-hidden">
        <div className={`relative h-20 bg-gradient-to-br ${gradient} px-5 py-4`}>
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 right-8 h-14 w-14 rounded-full bg-white/10" />
          <p className="data-mono text-xs font-medium text-white/80">{course.courseCode}</p>
          <p className="mt-0.5 truncate font-display text-base font-bold text-white">{course.courseName}</p>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FiUser className="h-3.5 w-3.5" /> Instructor</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{course.instructorName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FiAward className="h-3.5 w-3.5" /> Credits</span>
            <Badge tone="accent">{course.credits} credits</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><FiUsers className="h-3.5 w-3.5" /> Students</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{enrolledCount}</span>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3 dark:border-border-dark">
            <Badge tone="brand">Semester {course.semester}</Badge>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => onEdit(course)} className="rounded-md p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30">
                <FiEdit2 className="h-4 w-4" />
              </button>
              <button onClick={() => onDelete(course._id)} className="rounded-md p-1.5 text-slate-400 hover:bg-danger-bg hover:text-danger dark:hover:bg-danger-bg-dark">
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;

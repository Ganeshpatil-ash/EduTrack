import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const LABELS = {
  dashboard: 'Dashboard',
  students: 'Students',
  add: 'Add Student',
  edit: 'Edit',
  courses: 'Courses',
  attendance: 'Attendance',
  reports: 'Reports',
  settings: 'Settings',
  profile: 'Profile',
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const params = useParams();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="hidden items-center gap-1.5 text-sm text-slate-400 sm:flex">
      <Link to="/dashboard" className="flex items-center hover:text-slate-600 dark:hover:text-slate-300">
        <FiHome className="h-3.5 w-3.5" />
      </Link>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const isId = Object.values(params).includes(seg);
        const label = isId ? 'Details' : LABELS[seg] || seg;
        const to = '/' + segments.slice(0, i + 1).join('/');
        return (
          <React.Fragment key={to}>
            <FiChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />
            {isLast ? (
              <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
            ) : (
              <Link to={to} className="hover:text-slate-600 dark:hover:text-slate-300">{label}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiUsers, FiBookOpen, FiCheckSquare, FiBarChart2, FiSettings,
  FiChevronsLeft, FiChevronsRight, FiX,
} from 'react-icons/fi';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/students', label: 'Students', icon: FiUsers },
  { to: '/courses', label: 'Courses', icon: FiBookOpen },
  { to: '/attendance', label: 'Attendance', icon: FiCheckSquare },
  { to: '/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) => {
  const content = (
    <>
      <div className={cn('flex h-16 items-center gap-2.5 px-5', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white">
          ET
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap font-display text-[15px] font-bold text-slate-900 dark:text-slate-50"
            >
              EduTrack
            </motion.span>
          )}
        </AnimatePresence>
        <button onClick={onCloseMobile} className="ml-auto rounded-md p-1 lg:hidden">
          <FiX className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onCloseMobile}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/25 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-surface-alt hover:text-slate-900 dark:text-slate-400 dark:hover:bg-surface-alt-dark dark:hover:text-slate-100'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-brand-600"
                  />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-border p-3 dark:border-border-dark lg:block">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-slate-500 hover:bg-surface-alt dark:text-slate-400 dark:hover:bg-surface-alt-dark"
        >
          {collapsed ? <FiChevronsRight className="h-4 w-4" /> : (<><FiChevronsLeft className="h-4 w-4" /> Collapse</>)}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="sticky top-0 hidden h-screen flex-col border-r border-border bg-surface dark:border-border-dark dark:bg-surface-dark lg:flex"
      >
        {content}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface dark:border-border-dark dark:bg-surface-dark lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

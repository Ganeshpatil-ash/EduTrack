import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiSearch, FiBell, FiSun, FiMoon, FiChevronDown, FiUser, FiSettings, FiLogOut, FiUserPlus, FiCheckSquare, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useDashboardStatsQuery } from '../../api/queries.js';
import api from '../../api/axios.js';
import Avatar from '../ui/Avatar.jsx';
import Dropdown, { DropdownItem } from '../ui/Dropdown.jsx';
import Breadcrumbs from './Breadcrumbs.jsx';
import { timeAgo, cn } from '../../lib/utils.js';

const activityIcon = { student: FiUserPlus, course: FiBookOpen, attendance: FiCheckSquare };

const Topbar = ({ onOpenMobile }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { data: stats } = useDashboardStatsQuery();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ students: [], courses: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults({ students: [], courses: [] }); return; }
    const timeout = setTimeout(async () => {
      try {
        const [s, c] = await Promise.all([
          api.get('/students', { params: { search: query, limit: 5 } }),
          api.get('/courses', { params: { search: query, limit: 5 } }),
        ]);
        setResults({ students: s.data.data, courses: c.data.data });
      } catch { /* silent */ }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/80 sm:px-6">
      <button onClick={onOpenMobile} className="rounded-md p-2 hover:bg-surface-alt dark:hover:bg-surface-alt-dark lg:hidden">
        <FiMenu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </button>

      <Breadcrumbs />

      {/* Search */}
      <div className="relative ml-auto w-full max-w-xs" ref={searchRef}>
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search students, courses..."
          className="h-9 w-full rounded-lg border border-border bg-surface-alt pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-500 dark:border-border-dark dark:bg-surface-alt-dark"
        />
        <AnimatePresence>
          {searchOpen && query.trim().length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-surface py-2 shadow-elevated dark:border-border-dark dark:bg-surface-dark dark:shadow-elevated-dark"
            >
              {results.students.length === 0 && results.courses.length === 0 && (
                <p className="px-4 py-3 text-xs text-slate-400">No results for &ldquo;{query}&rdquo;</p>
              )}
              {results.students.length > 0 && (
                <div className="mb-1">
                  <p className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Students</p>
                  {results.students.map((s) => (
                    <button key={s._id} onClick={() => { navigate(`/students/${s._id}`); setSearchOpen(false); setQuery(''); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm hover:bg-surface-alt dark:hover:bg-surface-alt-dark">
                      <Avatar name={s.name} size="sm" />
                      <span className="truncate">{s.name}</span>
                      <span className="ml-auto data-mono text-[11px] text-slate-400">{s.rollNumber}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.courses.length > 0 && (
                <div>
                  <p className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Courses</p>
                  {results.courses.map((c) => (
                    <button key={c._id} onClick={() => { navigate('/courses'); setSearchOpen(false); setQuery(''); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm hover:bg-surface-alt dark:hover:bg-surface-alt-dark">
                      <FiBookOpen className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{c.courseName}</span>
                      <span className="ml-auto data-mono text-[11px] text-slate-400">{c.courseCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <Dropdown
        trigger={
          <button className="relative rounded-lg p-2 hover:bg-surface-alt dark:hover:bg-surface-alt-dark">
            <FiBell className="h-[18px] w-[18px] text-slate-600 dark:text-slate-300" />
            {stats?.recentActivities?.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
            )}
          </button>
        }
      >
        <div className="border-b border-border px-4 py-2.5 dark:border-border-dark">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Recent Activity</p>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {stats?.recentActivities?.length ? stats.recentActivities.map((a, i) => {
            const Icon = activityIcon[a.type] || FiBell;
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-alt dark:hover:bg-surface-alt-dark">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-slate-700 dark:text-slate-200">{a.message}</p>
                  <p className="text-[10px] text-slate-400">{timeAgo(a.date)}</p>
                </div>
              </div>
            );
          }) : <p className="px-4 py-6 text-center text-xs text-slate-400">No activity yet</p>}
        </div>
      </Dropdown>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="rounded-lg p-2 text-slate-600 hover:bg-surface-alt dark:text-slate-300 dark:hover:bg-surface-alt-dark"
        title="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            {theme === 'dark' ? <FiSun className="h-[18px] w-[18px]" /> : <FiMoon className="h-[18px] w-[18px]" />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Profile */}
      <Dropdown
        trigger={
          <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-surface-alt dark:hover:bg-surface-alt-dark">
            <Avatar name={user?.name} size="sm" />
            <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">{user?.name?.split(' ')[0]}</span>
            <FiChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        }
      >
        <div className="border-b border-border px-4 py-3 dark:border-border-dark">
          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{user?.name}</p>
          <p className="truncate text-xs text-slate-400">{user?.email}</p>
        </div>
        <DropdownItem icon={FiUser} onClick={() => navigate('/profile')}>My Profile</DropdownItem>
        <DropdownItem icon={FiSettings} onClick={() => navigate('/settings')}>Settings</DropdownItem>
        <DropdownItem icon={FiLogOut} danger onClick={handleLogout}>Log out</DropdownItem>
      </Dropdown>
    </header>
  );
};

export default Topbar;

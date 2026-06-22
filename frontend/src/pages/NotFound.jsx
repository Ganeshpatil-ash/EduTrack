import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCompass } from 'react-icons/fi';
import Button from '../components/ui/Button.jsx';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center dark:bg-canvas-dark">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
      <FiCompass className="h-7 w-7" />
    </motion.div>
    <h1 className="font-display text-2xl font-bold">404 — Page not found</h1>
    <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
    <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
  </div>
);

export default NotFound;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiArrowRight, FiUsers, FiCheckSquare, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import { Input, Label, ErrorText } from '../components/ui/Input.jsx';

const FEATURES = [
  { icon: FiUsers, text: 'Manage thousands of student records effortlessly' },
  { icon: FiCheckSquare, text: 'Track daily attendance with a single click' },
  { icon: FiBarChart2, text: 'Real-time analytics across every department' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas dark:bg-canvas-dark">
      {/* Branding panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-accent-500/20" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-display text-sm font-bold text-brand-700">ET</div>
          <span className="font-display text-lg font-bold text-white">EduTrack</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-bold leading-tight text-white">
            Student management,<br /> built like a modern SaaS.
          </h1>
          <p className="mt-4 max-w-md text-sm text-brand-100">
            EduTrack gives your institution one fast, beautiful place to manage students,
            courses, and attendance.
          </p>

          <div className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white"><Icon className="h-4 w-4" /></div>
                <p className="text-sm text-brand-50">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-brand-200">&copy; {new Date().getFullYear()} EduTrack. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white">ET</div>
            <span className="font-display text-lg font-bold">EduTrack</span>
          </div>

          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to manage your institution</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-4">
            <div>
              <Label required>Email address</Label>
              <Input icon={FiMail} type="email" placeholder="admin@edutrack.com" error={errors.email}
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
              <ErrorText>{errors.email?.message}</ErrorText>
            </div>
            <div>
              <Label required>Password</Label>
              <Input icon={FiLock} type="password" placeholder="••••••••" error={errors.password}
                {...register('password', { required: 'Password is required' })} />
              <ErrorText>{errors.password?.message}</ErrorText>
            </div>
            <Button type="submit" loading={submitting} className="w-full" size="lg">
              Sign in <FiArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account? <Link to="/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

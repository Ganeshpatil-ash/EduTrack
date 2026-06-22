import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiArrowRight, FiShield, FiZap, FiLayers } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import { Input, Label, ErrorText } from '../components/ui/Input.jsx';

const FEATURES = [
  { icon: FiShield, text: 'Secure JWT authentication out of the box' },
  { icon: FiZap, text: 'Fast, responsive dashboards on any device' },
  { icon: FiLayers, text: 'One clean system for every department' },
];

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas dark:bg-canvas-dark">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-slate-900 via-brand-900 to-brand-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-accent-500/15" />
        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-display text-sm font-bold text-brand-700">ET</div>
          <span className="font-display text-lg font-bold text-white">EduTrack</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-bold leading-tight text-white">
            Set up your institution<br /> in minutes.
          </h1>
          <p className="mt-4 max-w-md text-sm text-brand-100">
            Create your administrator account and start managing students, courses,
            and attendance today.
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

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-display text-sm font-bold text-white">ET</div>
            <span className="font-display text-lg font-bold">EduTrack</span>
          </div>

          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start managing students with EduTrack</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-4">
            <div>
              <Label required>Full Name</Label>
              <Input icon={FiUser} placeholder="Jane Doe" error={errors.name} {...register('name', { required: 'Name is required' })} />
              <ErrorText>{errors.name?.message}</ErrorText>
            </div>
            <div>
              <Label required>Email address</Label>
              <Input icon={FiMail} type="email" placeholder="admin@edutrack.com" error={errors.email}
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
              <ErrorText>{errors.email?.message}</ErrorText>
            </div>
            <div>
              <Label required>Password</Label>
              <Input icon={FiLock} type="password" placeholder="At least 6 characters" error={errors.password}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
              <ErrorText>{errors.password?.message}</ErrorText>
            </div>
            <div>
              <Label required>Confirm Password</Label>
              <Input icon={FiLock} type="password" placeholder="Re-enter your password" error={errors.confirmPassword}
                {...register('confirmPassword', { required: 'Please confirm your password', validate: (v) => v === password || 'Passwords do not match' })} />
              <ErrorText>{errors.confirmPassword?.message}</ErrorText>
            </div>
            <Button type="submit" loading={submitting} className="w-full" size="lg">
              Create account <FiArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiSave, FiUser, FiSun, FiMoon, FiMonitor, FiSliders } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useUpdateProfile } from '../api/queries.js';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card.jsx';
import { Input, Label, ErrorText } from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: FiSun },
  { value: 'dark', label: 'Dark', icon: FiMoon },
];

const DEFAULT_PREFS = { density: 'comfortable', defaultPageSize: '10' };

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const updateProfile = useUpdateProfile();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { name: user?.name, email: user?.email, password: '' } });

  const [prefs, setPrefs] = useState(() => {
    try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem('edutrack_prefs') || '{}') }; }
    catch { return DEFAULT_PREFS; }
  });

  useEffect(() => { localStorage.setItem('edutrack_prefs', JSON.stringify(prefs)); }, [prefs]);

  const onSubmitProfile = async (formData) => {
    const payload = { name: formData.name, email: formData.email };
    if (formData.password) payload.password = formData.password;
    try {
      const { data } = await updateProfile.mutateAsync(payload);
      updateUser(data.data);
      toast.success('Profile updated successfully');
    } catch { /* toast handled */ }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Manage your account and appearance preferences</p>
      </div>

      <Card>
        <CardHeader><CardTitle><FiUser className="mr-2 inline h-4 w-4" /> Account</CardTitle></CardHeader>
        <CardBody className="pt-2">
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4" noValidate>
            <div>
              <Label required>Full Name</Label>
              <Input error={errors.name} {...register('name', { required: 'Name is required' })} />
              <ErrorText>{errors.name?.message}</ErrorText>
            </div>
            <div>
              <Label required>Email Address</Label>
              <Input type="email" error={errors.email} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
              <ErrorText>{errors.email?.message}</ErrorText>
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" placeholder="Leave blank to keep current password" {...register('password', { minLength: { value: 6, message: 'At least 6 characters' } })} />
              <ErrorText>{errors.password?.message}</ErrorText>
            </div>
            <Button type="submit" loading={updateProfile.isPending}><FiSave className="h-4 w-4" /> Save Changes</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle><FiMonitor className="mr-2 inline h-4 w-4" /> Appearance</CardTitle></CardHeader>
        <CardBody className="pt-2">
          <Label>Theme</Label>
          <div className="grid grid-cols-2 gap-3">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setTheme(value)} type="button"
                className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${theme === value ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/25 dark:text-brand-300' : 'border-border text-slate-600 hover:bg-surface-alt dark:border-border-dark dark:text-slate-300 dark:hover:bg-surface-alt-dark'}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle><FiSliders className="mr-2 inline h-4 w-4" /> Preferences</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-2">
          <p className="text-xs text-slate-400">Stored locally on this device — not synced to your account.</p>
          <div>
            <Label>Table Density</Label>
            <div className="grid grid-cols-2 gap-3">
              {['comfortable', 'compact'].map((d) => (
                <button key={d} type="button" onClick={() => setPrefs((p) => ({ ...p, density: d }))}
                  className={`rounded-xl border p-3 text-sm font-medium capitalize transition-colors ${prefs.density === d ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/25 dark:text-brand-300' : 'border-border text-slate-600 hover:bg-surface-alt dark:border-border-dark dark:text-slate-300 dark:hover:bg-surface-alt-dark'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Default Page Size</Label>
            <div className="grid grid-cols-3 gap-3">
              {['10', '25', '50'].map((n) => (
                <button key={n} type="button" onClick={() => setPrefs((p) => ({ ...p, defaultPageSize: n }))}
                  className={`rounded-xl border p-3 text-sm font-medium transition-colors ${prefs.defaultPageSize === n ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/25 dark:text-brand-300' : 'border-border text-slate-600 hover:bg-surface-alt dark:border-border-dark dark:text-slate-300 dark:hover:bg-surface-alt-dark'}`}>
                  {n} rows
                </button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;

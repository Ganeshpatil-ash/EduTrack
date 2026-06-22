import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from './axios';
import { isoDate } from '../lib/utils';

/* ----------------------------- Students ----------------------------- */

export const useStudentsQuery = (params = {}) =>
  useQuery({
    queryKey: ['students', params],
    queryFn: async () => (await api.get('/students', { params })).data,
    keepPreviousData: true,
  });

export const useAllStudentsQuery = () =>
  useQuery({
    queryKey: ['students', 'all'],
    queryFn: async () => (await api.get('/students', { params: { limit: 1000 } })).data.data,
    staleTime: 60_000,
  });

export const useStudentQuery = (id) =>
  useQuery({
    queryKey: ['student', id],
    queryFn: async () => (await api.get(`/students/${id}`)).data.data,
    enabled: !!id,
  });

export const useCreateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post('/students', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Student added successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add student'),
  });
};

export const useUpdateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.put(`/students/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update student'),
  });
};

export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/students/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Student removed');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete student'),
  });
};

/* ------------------------------ Courses ------------------------------ */

export const useCoursesQuery = (params = {}) =>
  useQuery({
    queryKey: ['courses', params],
    queryFn: async () => (await api.get('/courses', { params })).data,
    keepPreviousData: true,
  });

export const useAllCoursesQuery = () =>
  useQuery({
    queryKey: ['courses', 'all'],
    queryFn: async () => (await api.get('/courses', { params: { limit: 1000 } })).data.data,
    staleTime: 60_000,
  });

export const useCreateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post('/courses', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Course created successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create course'),
  });
};

export const useUpdateCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.put(`/courses/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update course'),
  });
};

export const useDeleteCourse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/courses/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Course removed');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete course'),
  });
};

/* ---------------------------- Attendance ---------------------------- */

export const useAttendanceQuery = (params = {}) =>
  useQuery({
    queryKey: ['attendance', params],
    queryFn: async () => (await api.get('/attendance', { params })).data,
    keepPreviousData: true,
  });

export const useAllAttendanceQuery = (params = {}) =>
  useQuery({
    queryKey: ['attendance', 'all', params],
    queryFn: async () =>
      (await api.get('/attendance', { params: { ...params, limit: 2000 } })).data.data,
    staleTime: 60_000,
  });

export const useMarkAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post('/attendance', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save attendance'),
  });
};

export const useUpdateAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.put(`/attendance/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Attendance updated');
    },
    onError: () => toast.error('Failed to update attendance'),
  });
};

export const useDeleteAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/attendance/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Record deleted');
    },
    onError: () => toast.error('Failed to delete record'),
  });
};

/* ----------------------------- Dashboard ----------------------------- */

export const useDashboardStatsQuery = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data.data,
  });

/** Today vs. yesterday attendance, computed from real attendance records. */
export const useTodayAttendanceQuery = () =>
  useQuery({
    queryKey: ['attendance-today'],
    queryFn: async () => {
      const today = isoDate();
      const yesterday = isoDate(Date.now() - 86400000);
      const [todayRes, yestRes] = await Promise.all([
        api.get('/attendance', { params: { date: today, limit: 2000 } }),
        api.get('/attendance', { params: { date: yesterday, limit: 2000 } }),
      ]);
      const calc = (records) => {
        const total = records.length;
        const present = records.filter((r) => r.status === 'Present').length;
        return { total, present, pct: total ? Math.round((present / total) * 100) : 0 };
      };
      return { today: calc(todayRes.data.data), yesterday: calc(yestRes.data.data) };
    },
  });

/* ----------------------------- Profile ----------------------------- */

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (payload) => api.put('/auth/profile', payload),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update profile'),
  });
};

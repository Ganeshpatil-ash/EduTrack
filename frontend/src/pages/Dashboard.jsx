import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';
import {
  useDashboardStatsQuery, useAllStudentsQuery, useAllCoursesQuery,
  useAllAttendanceQuery, useTodayAttendanceQuery,
} from '../api/queries.js';
import { computeMonthlyActivity, computeCourseEnrollment, computeGrowthTrend, computeHeatmapData } from '../lib/analytics.js';
import KpiCard from '../components/dashboard/KpiCard.jsx';
import AttendanceTrendChart from '../components/dashboard/AttendanceTrendChart.jsx';
import DepartmentChart from '../components/dashboard/DepartmentChart.jsx';
import CourseEnrollmentChart from '../components/dashboard/CourseEnrollmentChart.jsx';
import MonthlyActivityChart from '../components/dashboard/MonthlyActivityChart.jsx';
import ActivityTimeline from '../components/dashboard/ActivityTimeline.jsx';
import AttendanceHeatmap from '../components/attendance/AttendanceHeatmap.jsx';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: students = [] } = useAllStudentsQuery();
  const { data: courses = [] } = useAllCoursesQuery();
  const { data: attendance = [] } = useAllAttendanceQuery();
  const { data: todayAttendance } = useTodayAttendanceQuery();

  const studentTrend = useMemo(() => ({ ...computeGrowthTrend(students), label: 'vs last 30 days' }), [students]);
  const courseTrend = useMemo(() => ({ ...computeGrowthTrend(courses), label: 'vs last 30 days' }), [courses]);

  const attendanceRateTrend = useMemo(() => {
    const trend = stats?.attendanceTrend || [];
    if (trend.length < 2) return null;
    const mid = Math.floor(trend.length / 2);
    const avg = (arr) => arr.reduce((s, d) => s + (d.total ? d.present / d.total : 0), 0) / (arr.length || 1);
    const first = avg(trend.slice(0, mid)) * 100;
    const second = avg(trend.slice(mid)) * 100;
    const delta = Math.round(second - first);
    return { deltaPct: Math.abs(delta), direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat', label: 'within this week' };
  }, [stats]);

  const todayTrend = useMemo(() => {
    if (!todayAttendance) return null;
    const delta = todayAttendance.today.pct - todayAttendance.yesterday.pct;
    return { deltaPct: Math.abs(delta), direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat', label: 'vs yesterday' };
  }, [todayAttendance]);

  const monthlyActivity = useMemo(() => computeMonthlyActivity(students, courses, attendance), [students, courses, attendance]);
  const courseEnrollment = useMemo(() => computeCourseEnrollment(courses, attendance), [courses, attendance]);
  const heatmapData = useMemo(() => computeHeatmapData(attendance, { weeks: 12, mode: 'rate' }), [attendance]);

  const trendChartData = useMemo(
    () => (stats?.attendanceTrend || []).map((d) => ({
      date: d._id.slice(5),
      percentage: d.total ? Number(((d.present / d.total) * 100).toFixed(1)) : 0,
    })),
    [stats]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Good to see you, {user?.name?.split(' ')[0]}</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Here&apos;s what&apos;s happening across your institution today.</p>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={FiUsers} label="Total Students" value={stats?.totalStudents || 0} trend={studentTrend} tone="brand" />
          <KpiCard icon={FiBookOpen} label="Total Courses" value={stats?.totalCourses || 0} trend={courseTrend} tone="accent" />
          <KpiCard icon={FiCheckSquare} label="Today's Attendance" value={todayAttendance?.today.pct || 0} suffix="%" trend={todayTrend} tone="info" />
          <KpiCard icon={FiTrendingUp} label="Attendance Rate" value={stats?.attendancePercentage || 0} suffix="%" trend={attendanceRateTrend} tone="success" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AttendanceTrendChart data={trendChartData} />
        <DepartmentChart data={stats?.studentsByDepartment || []} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CourseEnrollmentChart data={courseEnrollment} />
        <MonthlyActivityChart data={monthlyActivity} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Institution Pulse</CardTitle>
              <p className="mt-0.5 text-xs text-slate-400">Daily attendance intensity, last 12 weeks</p>
            </div>
          </CardHeader>
          <CardBody>
            <AttendanceHeatmap data={heatmapData} mode="rate" />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <span>Less</span>
              {['bg-surface-alt dark:bg-surface-alt-dark', 'bg-accent-100', 'bg-accent-300/80', 'bg-accent-500', 'bg-accent-600'].map((c, i) => (
                <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${c}`} />
              ))}
              <span>More</span>
            </div>
          </CardBody>
        </Card>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-1">
          <ActivityTimeline activities={stats?.recentActivities || []} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

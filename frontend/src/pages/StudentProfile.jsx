import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiHash,
  FiGrid, FiCheckSquare, FiBookOpen, FiTrendingUp, FiAward, FiZap,
} from 'react-icons/fi';
import { useStudentQuery, useAllAttendanceQuery, useAllCoursesQuery } from '../api/queries.js';
import { computeHeatmapData, computeAttendanceSummary } from '../lib/analytics.js';
import Avatar from '../components/ui/Avatar.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import AttendanceHeatmap from '../components/attendance/AttendanceHeatmap.jsx';
import AttendanceStats from '../components/attendance/AttendanceStats.jsx';
import { formatDate } from '../lib/utils.js';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-slate-400 dark:bg-surface-alt-dark">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{value || '—'}</p>
    </div>
  </div>
);

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  const { data: student, isLoading } = useStudentQuery(id);
  const { data: allAttendance = [] } = useAllAttendanceQuery();
  const { data: allCourses = [] } = useAllCoursesQuery();

  const attendance = useMemo(
    () => allAttendance.filter((a) => (a.studentId?._id || a.studentId) === id),
    [allAttendance, id]
  );
  const summary = useMemo(() => computeAttendanceSummary(attendance), [attendance]);
  const heatmapData = useMemo(() => computeHeatmapData(attendance, { weeks: 14, mode: 'status' }), [attendance]);

  const courseStats = useMemo(() => {
    const byCourse = new Map();
    attendance.forEach((a) => {
      const cid = a.courseId?._id || a.courseId;
      if (!byCourse.has(cid)) byCourse.set(cid, { total: 0, present: 0, course: a.courseId });
      const entry = byCourse.get(cid);
      entry.total++;
      if (a.status === 'Present') entry.present++;
    });
    return Array.from(byCourse.entries()).map(([cid, v]) => ({
      id: cid,
      course: typeof v.course === 'object' ? v.course : allCourses.find((c) => c._id === cid),
      pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
      total: v.total,
    }));
  }, [attendance, allCourses]);

  if (isLoading) {
    return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>;
  }
  if (!student) return null;

  const tabs = [
    { value: 'overview', label: 'Overview', icon: FiGrid },
    { value: 'attendance', label: 'Attendance', icon: FiCheckSquare },
    { value: 'courses', label: 'Courses', icon: FiBookOpen },
    { value: 'performance', label: 'Performance', icon: FiTrendingUp },
  ];

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/students')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <FiArrowLeft className="h-4 w-4" /> Back to Students
      </button>

      {/* Profile header */}
      <Card>
        <CardBody className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar name={student.name} src={student.profileImage} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold">{student.name}</h1>
              <Badge tone="brand" icon={FiHash}>{student.rollNumber}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{student.department} &middot; Semester {student.semester}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><FiMail className="h-3.5 w-3.5" /> {student.email}</span>
              <span className="flex items-center gap-1.5"><FiPhone className="h-3.5 w-3.5" /> {student.phone}</span>
              <span className="flex items-center gap-1.5"><FiCalendar className="h-3.5 w-3.5" /> {formatDate(student.dateOfBirth)}</span>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate(`/students/edit/${student._id}`)}>
            <FiEdit2 className="h-4 w-4" /> Edit Profile
          </Button>
        </CardBody>
      </Card>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        {tab === 'overview' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardBody className="divide-y divide-border pt-0 dark:divide-border-dark">
                <InfoRow icon={FiMapPin} label="Address" value={student.address} />
                <InfoRow icon={FiBookOpen} label="Department" value={student.department} />
                <InfoRow icon={FiGrid} label="Semester" value={`Semester ${student.semester}`} />
                <InfoRow icon={FiCalendar} label="Joined" value={formatDate(student.createdAt)} />
              </CardBody>
            </Card>
            <div className="space-y-5 lg:col-span-2">
              <AttendanceStats summary={summary} />
              <Card>
                <CardHeader><CardTitle>Attendance Streak</CardTitle></CardHeader>
                <CardBody className="pt-2">
                  <AttendanceHeatmap data={heatmapData} mode="status" />
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {tab === 'attendance' && (
          <div className="space-y-5">
            <AttendanceStats summary={summary} />
            <Card>
              <CardHeader><CardTitle>Full Attendance History</CardTitle></CardHeader>
              <CardBody className="pt-2">
                <AttendanceHeatmap data={heatmapData} mode="status" />
              </CardBody>
            </Card>
          </div>
        )}

        {tab === 'courses' && (
          <Card>
            <CardHeader><CardTitle>Enrolled Courses</CardTitle><p className="text-xs text-slate-400">Based on attendance records</p></CardHeader>
            <CardBody className="pt-2">
              {courseStats.length === 0 ? (
                <EmptyState icon={FiBookOpen} title="No course activity yet" description="Courses appear here once attendance is marked" />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {courseStats.map((cs) => (
                    <div key={cs.id} className="flex items-center justify-between rounded-xl border border-border p-4 dark:border-border-dark">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{cs.course?.courseName || 'Unknown course'}</p>
                        <p className="data-mono text-xs text-slate-400">{cs.course?.courseCode}</p>
                      </div>
                      <Badge tone={cs.pct >= 85 ? 'success' : cs.pct >= 70 ? 'warning' : 'danger'}>{cs.pct}%</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {tab === 'performance' && (
          <Card>
            <CardHeader><CardTitle>Performance Snapshot</CardTitle></CardHeader>
            <CardBody className="pt-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-4 text-center dark:border-border-dark">
                  <FiAward className="mx-auto mb-2 h-5 w-5 text-accent-500" />
                  <p className="text-xl font-bold">{summary.pct}%</p>
                  <p className="text-xs text-slate-400">Overall attendance</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center dark:border-border-dark">
                  <FiZap className="mx-auto mb-2 h-5 w-5 text-accent-500" />
                  <p className="text-xl font-bold">{summary.streak}</p>
                  <p className="text-xs text-slate-400">Day streak</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-center dark:border-border-dark">
                  <FiBookOpen className="mx-auto mb-2 h-5 w-5 text-brand-500" />
                  <p className="text-xl font-bold">{courseStats.length}</p>
                  <p className="text-xs text-slate-400">Active courses</p>
                </div>
              </div>
              <p className="mt-5 text-xs text-slate-400">
                Grade and assessment records aren&apos;t part of the current data model — this view reflects
                attendance-derived engagement only.
              </p>
            </CardBody>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default StudentProfile;

import React, { useState, useEffect, useMemo } from 'react';
import { FiCheckCircle, FiXCircle, FiSave, FiUsers, FiCalendar } from 'react-icons/fi';
import {
  useAllStudentsQuery, useAllCoursesQuery, useAttendanceQuery, useAllAttendanceQuery,
  useMarkAttendance, useUpdateAttendance, useDeleteAttendance,
} from '../api/queries.js';
import { computeHeatmapData, computeAttendanceSummary } from '../lib/analytics.js';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { Select } from '../components/ui/Input.jsx';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/ui/Table.jsx';
import { SkeletonRow } from '../components/ui/Skeleton.jsx';
import AttendanceHeatmap from '../components/attendance/AttendanceHeatmap.jsx';
import AttendanceStats from '../components/attendance/AttendanceStats.jsx';
import { isoDate, formatDate } from '../lib/utils.js';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { data: students = [] } = useAllStudentsQuery();
  const { data: courses = [] } = useAllCoursesQuery();
  const { data: allAttendance = [] } = useAllAttendanceQuery();

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(isoDate());
  const [statusMap, setStatusMap] = useState({});
  const [filterCourse, setFilterCourse] = useState('');
  const [page, setPage] = useState(1);

  const markAttendance = useMarkAttendance();
  const updateAttendance = useUpdateAttendance();
  const deleteAttendance = useDeleteAttendance();

  const { data: recordsData, isLoading: recordsLoading } = useAttendanceQuery({ courseId: filterCourse || undefined, page, limit: 8 });
  const records = recordsData?.data || [];
  const meta = { page: recordsData?.page || 1, pages: recordsData?.pages || 1, total: recordsData?.total || 0 };

  const summary = useMemo(() => computeAttendanceSummary(allAttendance.filter((a) => !filterCourse || (a.courseId?._id || a.courseId) === filterCourse)), [allAttendance, filterCourse]);
  const heatmapData = useMemo(
    () => computeHeatmapData(allAttendance.filter((a) => !filterCourse || (a.courseId?._id || a.courseId) === filterCourse), { weeks: 18, mode: 'rate' }),
    [allAttendance, filterCourse]
  );

  const toggleStatus = (studentId) => setStatusMap((p) => ({ ...p, [studentId]: p[studentId] === 'Present' ? 'Absent' : 'Present' }));
  const markAll = (status) => setStatusMap(Object.fromEntries(students.map((s) => [s._id, status])));

  const handleSave = async () => {
    if (!selectedCourse) return toast.error('Select a course first');
    const records = students.filter((s) => statusMap[s._id]).map((s) => ({ studentId: s._id, courseId: selectedCourse, date: selectedDate, status: statusMap[s._id] }));
    if (records.length === 0) return toast.error('Mark at least one student');
    try {
      await markAttendance.mutateAsync({ records });
      toast.success(`Attendance saved for ${records.length} student(s)`);
      setStatusMap({});
    } catch { /* toast in mutation */ }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Mark daily attendance and review historical records</p>
      </div>

      <AttendanceStats summary={summary} />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Attendance Streak</CardTitle>
            <p className="mt-0.5 text-xs text-slate-400">Last 18 weeks {filterCourse && '· filtered by course'}</p>
          </div>
          <div className="w-56">
            <Select value={filterCourse} onChange={(e) => { setPage(1); setFilterCourse(e.target.value); }}>
              <option value="">All Courses</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.courseCode} - {c.courseName}</option>)}
            </Select>
          </div>
        </CardHeader>
        <CardBody>
          <AttendanceHeatmap data={heatmapData} mode="rate" />
        </CardBody>
      </Card>

      {/* Mark attendance */}
      <Card>
        <CardHeader><CardTitle>Mark Attendance</CardTitle></CardHeader>
        <CardBody className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.courseCode} - {c.courseName}</option>)}
            </Select>
            <input type="date" value={selectedDate} max={isoDate()} onChange={(e) => setSelectedDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm dark:border-border-dark dark:bg-surface-dark" />
            <Button variant="secondary" onClick={() => markAll('Present')}><FiCheckCircle className="h-4 w-4 text-success" /> Mark all present</Button>
            <Button variant="secondary" onClick={() => markAll('Absent')}><FiXCircle className="h-4 w-4 text-danger" /> Mark all absent</Button>
          </div>

          {students.length === 0 ? (
            <EmptyState icon={FiUsers} title="No students yet" description="Add students before marking attendance" />
          ) : (
            <div className="max-h-72 overflow-y-auto rounded-xl border border-border scrollbar-thin dark:border-border-dark">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface-alt dark:bg-surface-alt-dark">
                  <tr className="text-left text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    <th className="px-4 py-2.5">Student</th><th className="px-4 py-2.5">Roll No.</th><th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td className="px-4 py-2"><div className="flex items-center gap-2.5"><Avatar name={s.name} size="sm" /><span className="font-medium text-slate-800 dark:text-slate-100">{s.name}</span></div></td>
                      <td className="data-mono px-4 py-2 text-slate-400">{s.rollNumber}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => toggleStatus(s._id)} className="inline-block">
                          <Badge tone={statusMap[s._id] === 'Present' ? 'success' : statusMap[s._id] === 'Absent' ? 'danger' : 'neutral'}
                            icon={statusMap[s._id] === 'Present' ? FiCheckCircle : statusMap[s._id] === 'Absent' ? FiXCircle : undefined}>
                            {statusMap[s._id] || 'Not marked'}
                          </Badge>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Button onClick={handleSave} loading={markAttendance.isPending}><FiSave className="h-4 w-4" /> Save Attendance</Button>
        </CardBody>
      </Card>

      {/* Records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardBody className="pt-2">
          {recordsLoading ? (
            <div className="divide-y divide-border dark:divide-border-dark">{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : records.length === 0 ? (
            <EmptyState icon={FiCalendar} title="No attendance records" description="Records will appear once attendance is marked" />
          ) : (
            <Table>
              <Thead>
                <Th>Date</Th><Th>Student</Th><Th>Course</Th><Th>Status</Th><Th className="text-right">Actions</Th>
              </Thead>
              <Tbody>
                {records.map((r) => (
                  <Tr key={r._id}>
                    <Td>{formatDate(r.date)}</Td>
                    <Td className="font-medium text-slate-800 dark:text-slate-100">{r.studentId?.name || 'Unknown'} <span className="data-mono text-xs text-slate-400">{r.studentId?.rollNumber}</span></Td>
                    <Td>{r.courseId?.courseName || 'Unknown'}</Td>
                    <Td>
                      <button onClick={() => updateAttendance.mutate({ id: r._id, payload: { status: r.status === 'Present' ? 'Absent' : 'Present' } })}>
                        <Badge tone={r.status === 'Present' ? 'success' : 'danger'} icon={r.status === 'Present' ? FiCheckCircle : FiXCircle}>{r.status}</Badge>
                      </button>
                    </Td>
                    <Td className="text-right">
                      <button onClick={() => { if (window.confirm('Delete this record?')) deleteAttendance.mutate(r._id); }} className="rounded-md p-1.5 text-slate-400 hover:bg-danger-bg hover:text-danger dark:hover:bg-danger-bg-dark">
                        <FiXCircle className="h-4 w-4" />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <div className="mt-2"><Pagination page={meta.page} pages={meta.pages} total={meta.total} onPageChange={setPage} /></div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Attendance;

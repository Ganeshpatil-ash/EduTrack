import React, { useMemo, useState } from 'react';
import { FiDownload, FiUsers, FiBookOpen, FiCheckSquare } from 'react-icons/fi';
import { useAllStudentsQuery, useAllCoursesQuery, useAllAttendanceQuery } from '../api/queries.js';
import { computeCourseEnrollment, computeMonthlyActivity } from '../lib/analytics.js';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui/Card.jsx';
import { Select } from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import DepartmentChart from '../components/dashboard/DepartmentChart.jsx';
import CourseEnrollmentChart from '../components/dashboard/CourseEnrollmentChart.jsx';
import MonthlyActivityChart from '../components/dashboard/MonthlyActivityChart.jsx';
import { downloadCSV } from '../lib/utils.js';

const Reports = () => {
  const { data: students = [] } = useAllStudentsQuery();
  const { data: courses = [] } = useAllCoursesQuery();
  const { data: attendance = [] } = useAllAttendanceQuery();
  const [department, setDepartment] = useState('');

  const filteredStudents = useMemo(
    () => (department ? students.filter((s) => s.department === department) : students),
    [students, department]
  );

  const departmentBreakdown = useMemo(() => {
    const map = {};
    filteredStudents.forEach((s) => { map[s.department] = (map[s.department] || 0) + 1; });
    return Object.entries(map).map(([_id, count]) => ({ _id, count }));
  }, [filteredStudents]);

  const courseEnrollment = useMemo(() => computeCourseEnrollment(courses, attendance), [courses, attendance]);
  const monthlyActivity = useMemo(() => computeMonthlyActivity(students, courses, attendance), [students, courses, attendance]);

  const departments = useMemo(() => [...new Set(students.map((s) => s.department))], [students]);

  const exportStudents = () => downloadCSV('students-report.csv', filteredStudents.map((s) => ({
    Name: s.name, RollNumber: s.rollNumber, Department: s.department, Semester: s.semester, Email: s.email, Phone: s.phone,
  })));

  const exportAttendance = () => downloadCSV('attendance-report.csv', attendance.map((a) => ({
    Date: new Date(a.date).toISOString().slice(0, 10),
    Student: a.studentId?.name || '', Course: a.courseId?.courseName || '', Status: a.status,
  })));

  const exportCourses = () => downloadCSV('courses-report.csv', courses.map((c) => ({
    Code: c.courseCode, Name: c.courseName, Instructor: c.instructorName, Credits: c.credits, Semester: c.semester,
  })));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Cross-entity breakdowns and CSV exports</p>
        </div>
        <div className="w-56">
          <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"><FiUsers className="h-[18px] w-[18px]" /></div>
            <Button size="sm" variant="secondary" onClick={exportStudents}><FiDownload className="h-3.5 w-3.5" /> Export</Button>
          </div>
          <p className="mt-3 font-display text-2xl font-bold">{filteredStudents.length}</p>
          <p className="text-xs text-slate-400">Students {department && `in ${department}`}</p>
        </Card>
        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600 dark:bg-accent-700/20 dark:text-accent-300"><FiBookOpen className="h-[18px] w-[18px]" /></div>
            <Button size="sm" variant="secondary" onClick={exportCourses}><FiDownload className="h-3.5 w-3.5" /> Export</Button>
          </div>
          <p className="mt-3 font-display text-2xl font-bold">{courses.length}</p>
          <p className="text-xs text-slate-400">Total courses</p>
        </Card>
        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info-bg text-info dark:bg-info-bg-dark"><FiCheckSquare className="h-[18px] w-[18px]" /></div>
            <Button size="sm" variant="secondary" onClick={exportAttendance}><FiDownload className="h-3.5 w-3.5" /> Export</Button>
          </div>
          <p className="mt-3 font-display text-2xl font-bold">{attendance.length}</p>
          <p className="text-xs text-slate-400">Attendance records</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DepartmentChart data={departmentBreakdown} />
        <CourseEnrollmentChart data={courseEnrollment} />
      </div>
      <MonthlyActivityChart data={monthlyActivity} />
    </div>
  );
};

export default Reports;

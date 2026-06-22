import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiDownload, FiTrash2, FiSliders, FiX } from 'react-icons/fi';
import { useStudentsQuery, useDeleteStudent, useAllAttendanceQuery } from '../api/queries.js';
import StudentDataGrid from '../components/students/StudentDataGrid.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { Input, Select } from '../components/ui/Input.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { downloadCSV } from '../lib/utils.js';

const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Mathematics'];

const Students = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setPage(1), [debouncedSearch, department, semester]);

  const params = useMemo(
    () => ({ search: debouncedSearch || undefined, department: department || undefined, semester: semester || undefined, sortBy, order, page, limit: 10 }),
    [debouncedSearch, department, semester, sortBy, order, page]
  );

  const { data, isLoading, isFetching } = useStudentsQuery(params);
  const { data: attendance = [] } = useAllAttendanceQuery();
  const deleteStudent = useDeleteStudent();

  const attendanceMap = useMemo(() => {
    const map = {};
    attendance.forEach((a) => {
      const id = a.studentId?._id || a.studentId;
      if (!id) return;
      if (!map[id]) map[id] = { present: 0, total: 0 };
      map[id].total++;
      if (a.status === 'Present') map[id].present++;
    });
    Object.keys(map).forEach((id) => { map[id].pct = Math.round((map[id].present / map[id].total) * 100); });
    return map;
  }, [attendance]);

  const students = data?.data || [];
  const meta = { page: data?.page || 1, pages: data?.pages || 1, total: data?.total || 0 };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    await deleteStudent.mutateAsync(id);
    setSelected((s) => s.filter((i) => i !== id));
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} selected student(s)? This cannot be undone.`)) return;
    await Promise.all(selected.map((id) => deleteStudent.mutateAsync(id)));
    setSelected([]);
  };

  const handleExport = () => {
    const rows = students.map((s) => ({
      RollNumber: s.rollNumber, Name: s.name, Email: s.email, Phone: s.phone,
      Department: s.department, Semester: s.semester, AttendancePct: attendanceMap[s._id]?.pct ?? '',
    }));
    downloadCSV(`students-page-${meta.page}.csv`, rows);
  };

  const toggleSelect = (id) => setSelected((s) => (s.includes(id) ? s.filter((i) => i !== id) : [...s, id]));
  const toggleSelectAll = () => setSelected((s) => (students.every((st) => s.includes(st._id)) ? s.filter((id) => !students.find((st) => st._id === id)) : [...new Set([...s, ...students.map((st) => st._id)])]));

  const clearFilters = () => { setSearch(''); setDepartment(''); setSemester(''); };
  const hasFilters = search || department || semester;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{meta.total} students enrolled</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}><FiDownload className="h-4 w-4" /> Export CSV</Button>
          <Button onClick={() => navigate('/students/add')}><FiPlus className="h-4 w-4" /> Add Student</Button>
        </div>
      </div>

      <Card>
        <CardBody className="border-b border-border pb-4 dark:border-border-dark">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Input icon={FiSearch} placeholder="Search by name, email, roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="">All Semesters</option>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Semester {s}</option>)}
            </Select>
            <div className="flex items-center gap-2">
              <FiSliders className="h-4 w-4 shrink-0 text-slate-400" />
              <Select value={`${sortBy}-${order}`} onChange={(e) => { const [f, o] = e.target.value.split('-'); setSortBy(f); setOrder(o); }}>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rollNumber-asc">Roll No.</option>
                <option value="semester-asc">Semester</option>
                <option value="createdAt-desc">Newest</option>
              </Select>
            </div>
          </div>
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                onClick={clearFilters}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400"
              >
                <FiX className="h-3 w-3" /> Clear filters
              </motion.button>
            )}
          </AnimatePresence>
        </CardBody>

        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between border-b border-border bg-brand-50 px-5 py-2.5 text-sm dark:border-border-dark dark:bg-brand-900/20"
            >
              <span className="font-medium text-brand-700 dark:text-brand-300">{selected.length} selected</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>
                <Button size="sm" variant="outlineDanger" onClick={handleBulkDelete}><FiTrash2 className="h-3.5 w-3.5" /> Delete</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <StudentDataGrid
          students={students}
          loading={isLoading}
          sortBy={sortBy}
          order={order}
          onSort={(f, o) => { setSortBy(f); setOrder(o); }}
          selected={selected}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          attendanceMap={attendanceMap}
          onDelete={handleDelete}
        />
        <CardBody className="pt-0">
          <Pagination page={meta.page} pages={meta.pages} total={meta.total} onPageChange={setPage} />
        </CardBody>
      </Card>
    </div>
  );
};

export default Students;

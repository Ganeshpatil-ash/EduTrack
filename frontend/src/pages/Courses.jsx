import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiPlus, FiBookOpen } from 'react-icons/fi';
import {
  useCoursesQuery, useCreateCourse, useUpdateCourse, useDeleteCourse, useAllAttendanceQuery,
} from '../api/queries.js';
import CourseCard from '../components/courses/CourseCard.jsx';
import CourseFormModal from '../components/courses/CourseFormModal.jsx';
import { Input, Select } from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';

const Courses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (location.pathname === '/courses/add') {
      setEditingCourse(null);
      setModalOpen(true);
    }
  }, [location.pathname]);

  const params = useMemo(() => ({ search: debouncedSearch || undefined, semester: semester || undefined, page, limit: 9 }), [debouncedSearch, semester, page]);
  const { data, isLoading } = useCoursesQuery(params);
  const { data: attendance = [] } = useAllAttendanceQuery();

  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const courses = data?.data || [];
  const meta = { page: data?.page || 1, pages: data?.pages || 1, total: data?.total || 0 };

  const enrollmentMap = useMemo(() => {
    const map = {};
    attendance.forEach((a) => {
      const cid = a.courseId?._id || a.courseId;
      const sid = a.studentId?._id || a.studentId;
      if (!cid || !sid) return;
      if (!map[cid]) map[cid] = new Set();
      map[cid].add(sid);
    });
    return map;
  }, [attendance]);

  const closeModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
    if (location.pathname === '/courses/add') navigate('/courses');
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCourse) await updateCourse.mutateAsync({ id: editingCourse._id, payload: formData });
      else await createCourse.mutateAsync(formData);
      closeModal();
    } catch { /* toast handled in mutation */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    await deleteCourse.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{meta.total} courses in the catalog</p>
        </div>
        <Button onClick={() => { setEditingCourse(null); setModalOpen(true); }}><FiPlus className="h-4 w-4" /> New Course</Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-80"><Input icon={FiSearch} placeholder="Search courses..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} /></div>
        <div className="sm:w-48">
          <Select value={semester} onChange={(e) => { setPage(1); setSemester(e.target.value); }}>
            <option value="">All Semesters</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : courses.length === 0 ? (
        <EmptyState icon={FiBookOpen} title="No courses found" description="Try adjusting your search or add a new course"
          action={<Button onClick={() => setModalOpen(true)}><FiPlus className="h-4 w-4" /> New Course</Button>} />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {courses.map((c, i) => (
              <CourseCard
                key={c._id}
                course={c}
                index={i}
                enrolledCount={enrollmentMap[c._id]?.size || 0}
                onEdit={(course) => { setEditingCourse(course); setModalOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Pagination page={meta.page} pages={meta.pages} total={meta.total} onPageChange={setPage} />

      <CourseFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={createCourse.isPending || updateCourse.isPending}
        initialValues={editingCourse}
      />
    </div>
  );
};

export default Courses;

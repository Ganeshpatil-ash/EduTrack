import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import StudentForm from '../components/students/StudentForm.jsx';
import { useStudentQuery, useUpdateStudent } from '../api/queries.js';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: student, isLoading } = useStudentQuery(id);
  const updateStudent = useUpdateStudent();

  const handleSubmit = async (formData) => {
    try {
      await updateStudent.mutateAsync({ id, payload: formData });
      navigate('/students');
    } catch { /* toast handled in mutation */ }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => navigate('/students')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <FiArrowLeft className="h-4 w-4" /> Back to Students
      </button>
      <div>
        <h1 className="text-2xl font-bold">Edit Student</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Update the student&apos;s details</p>
      </div>
      {isLoading ? (
        <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
      ) : (
        <StudentForm
          defaultValues={{ ...student, dateOfBirth: student?.dateOfBirth?.slice(0, 10) }}
          onSubmit={handleSubmit}
          submitting={updateStudent.isPending}
          submitLabel="Update Student"
        />
      )}
    </div>
  );
};

export default EditStudent;

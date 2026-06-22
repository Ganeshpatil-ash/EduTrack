import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import StudentForm from '../components/students/StudentForm.jsx';
import { useCreateStudent } from '../api/queries.js';

const AddStudent = () => {
  const navigate = useNavigate();
  const createStudent = useCreateStudent();

  const handleSubmit = async (formData) => {
    try {
      await createStudent.mutateAsync(formData);
      navigate('/students');
    } catch { /* toast handled in mutation */ }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => navigate('/students')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <FiArrowLeft className="h-4 w-4" /> Back to Students
      </button>
      <div>
        <h1 className="text-2xl font-bold">Add New Student</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Fill in the details below to register a student</p>
      </div>
      <StudentForm onSubmit={handleSubmit} submitting={createStudent.isPending} submitLabel="Add Student" />
    </div>
  );
};

export default AddStudent;

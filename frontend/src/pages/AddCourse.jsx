import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import api from '../api/axios';

const AddCourse = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await api.post('/courses', formData);
      toast.success('Course created successfully');
      navigate('/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </button>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Add New Course</h2>
        <p className="text-sm text-gray-500">Create a new course offering</p>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">Course Name *</label>
              <input
                className="input-field"
                placeholder="Data Structures & Algorithms"
                {...register('courseName', { required: 'Course name is required' })}
              />
              {errors.courseName && <p className="error-text">{errors.courseName.message}</p>}
            </div>

            <div>
              <label className="label-text">Course Code *</label>
              <input
                className="input-field"
                placeholder="CS201"
                {...register('courseCode', { required: 'Course code is required' })}
              />
              {errors.courseCode && <p className="error-text">{errors.courseCode.message}</p>}
            </div>

            <div>
              <label className="label-text">Instructor Name *</label>
              <input
                className="input-field"
                placeholder="Dr. Alan Turing"
                {...register('instructorName', { required: 'Instructor name is required' })}
              />
              {errors.instructorName && (
                <p className="error-text">{errors.instructorName.message}</p>
              )}
            </div>

            <div>
              <label className="label-text">Credits *</label>
              <input
                type="number"
                min={1}
                max={10}
                className="input-field"
                placeholder="4"
                {...register('credits', {
                  required: 'Credits are required',
                  min: { value: 1, message: 'Minimum 1 credit' },
                  max: { value: 10, message: 'Maximum 10 credits' },
                })}
              />
              {errors.credits && <p className="error-text">{errors.credits.message}</p>}
            </div>

            <div>
              <label className="label-text">Semester *</label>
              <select
                className="input-field"
                {...register('semester', { required: 'Semester is required' })}
              >
                <option value="">Select semester</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
              {errors.semester && <p className="error-text">{errors.semester.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;

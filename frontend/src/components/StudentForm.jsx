import React from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Save } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Mathematics',
];

/**
 * Shared form for both Add and Edit student flows.
 * `defaultValues` pre-fills fields when editing.
 */
const StudentForm = ({ defaultValues = {}, onSubmit, submitting, submitLabel = 'Save Student' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-text">Full Name *</label>
          <input
            className="input-field"
            placeholder="John Smith"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label-text">Email Address *</label>
          <input
            type="email"
            className="input-field"
            placeholder="john@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label-text">Phone Number *</label>
          <input
            className="input-field"
            placeholder="+1 555 123 4567"
            {...register('phone', { required: 'Phone number is required' })}
          />
          {errors.phone && <p className="error-text">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="label-text">Roll Number *</label>
          <input
            className="input-field"
            placeholder="CS2024001"
            {...register('rollNumber', { required: 'Roll number is required' })}
          />
          {errors.rollNumber && <p className="error-text">{errors.rollNumber.message}</p>}
        </div>

        <div>
          <label className="label-text">Department *</label>
          <select
            className="input-field"
            {...register('department', { required: 'Department is required' })}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department && <p className="error-text">{errors.department.message}</p>}
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

        <div>
          <label className="label-text">Date of Birth *</label>
          <input
            type="date"
            className="input-field"
            {...register('dateOfBirth', { required: 'Date of birth is required' })}
          />
          {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <label className="label-text">Profile Image URL</label>
          <input
            className="input-field"
            placeholder="https://example.com/photo.jpg"
            {...register('profileImage')}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label-text">Address</label>
          <textarea
            className="input-field"
            rows={3}
            placeholder="123 Main St, City, Country"
            {...register('address')}
          />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {submitLabel}
      </button>
    </form>
  );
};

export default StudentForm;

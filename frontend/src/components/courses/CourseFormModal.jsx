import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { Input, Select, Label, ErrorText } from '../ui/Input.jsx';

const CourseFormModal = ({ open, onClose, onSubmit, submitting, initialValues }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

  useEffect(() => {
    reset(initialValues || { courseName: '', courseCode: '', credits: '', instructorName: '', semester: '' });
  }, [initialValues, reset, open]);

  const isEdit = !!initialValues?._id;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Course' : 'New Course'}
      description={isEdit ? 'Update this course offering' : 'Add a new course to the catalog'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={submitting}>{isEdit ? 'Save Changes' : 'Create Course'}</Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:col-span-2">
          <Label required>Course Name</Label>
          <Input placeholder="Data Structures & Algorithms" error={errors.courseName} {...register('courseName', { required: 'Course name is required' })} />
          <ErrorText>{errors.courseName?.message}</ErrorText>
        </div>
        <div>
          <Label required>Course Code</Label>
          <Input placeholder="CS201" error={errors.courseCode} {...register('courseCode', { required: 'Course code is required' })} />
          <ErrorText>{errors.courseCode?.message}</ErrorText>
        </div>
        <div>
          <Label required>Instructor</Label>
          <Input placeholder="Dr. Alan Turing" error={errors.instructorName} {...register('instructorName', { required: 'Instructor is required' })} />
          <ErrorText>{errors.instructorName?.message}</ErrorText>
        </div>
        <div>
          <Label required>Credits</Label>
          <Input type="number" min={1} max={10} error={errors.credits} {...register('credits', { required: 'Credits required', min: { value: 1, message: 'Min 1' }, max: { value: 10, message: 'Max 10' } })} />
          <ErrorText>{errors.credits?.message}</ErrorText>
        </div>
        <div>
          <Label required>Semester</Label>
          <Select error={errors.semester} {...register('semester', { required: 'Semester required' })}>
            <option value="">Select semester</option>
            {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Semester {s}</option>)}
          </Select>
          <ErrorText>{errors.semester?.message}</ErrorText>
        </div>
      </form>
    </Modal>
  );
};

export default CourseFormModal;

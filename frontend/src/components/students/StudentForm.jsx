import React from 'react';
import { useForm } from 'react-hook-form';
import { FiSave, FiUser, FiBookOpen, FiMapPin } from 'react-icons/fi';
import Button from '../ui/Button.jsx';
import { Input, Select, Textarea, Label, ErrorText } from '../ui/Input.jsx';
import { Card, CardBody } from '../ui/Card.jsx';

const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration', 'Mathematics'];

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-5 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const StudentForm = ({ defaultValues = {}, onSubmit, submitting, submitLabel = 'Save Student' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Card>
        <CardBody>
          <SectionHeader icon={FiUser} title="Personal Information" subtitle="Basic identity details" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label required>Full Name</Label>
              <Input placeholder="John Smith" error={errors.name} {...register('name', { required: 'Name is required' })} />
              <ErrorText>{errors.name?.message}</ErrorText>
            </div>
            <div>
              <Label required>Email Address</Label>
              <Input type="email" placeholder="john@example.com" error={errors.email} {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
              <ErrorText>{errors.email?.message}</ErrorText>
            </div>
            <div>
              <Label required>Phone Number</Label>
              <Input placeholder="+1 555 123 4567" error={errors.phone} {...register('phone', { required: 'Phone number is required' })} />
              <ErrorText>{errors.phone?.message}</ErrorText>
            </div>
            <div>
              <Label required>Date of Birth</Label>
              <Input type="date" error={errors.dateOfBirth} {...register('dateOfBirth', { required: 'Date of birth is required' })} />
              <ErrorText>{errors.dateOfBirth?.message}</ErrorText>
            </div>
            <div className="sm:col-span-2">
              <Label>Profile Image URL</Label>
              <Input placeholder="https://example.com/photo.jpg" {...register('profileImage')} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <SectionHeader icon={FiBookOpen} title="Academic Information" subtitle="Enrollment details" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label required>Roll Number</Label>
              <Input placeholder="CS2024001" error={errors.rollNumber} {...register('rollNumber', { required: 'Roll number is required' })} />
              <ErrorText>{errors.rollNumber?.message}</ErrorText>
            </div>
            <div>
              <Label required>Department</Label>
              <Select error={errors.department} {...register('department', { required: 'Department is required' })}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
              <ErrorText>{errors.department?.message}</ErrorText>
            </div>
            <div>
              <Label required>Semester</Label>
              <Select error={errors.semester} {...register('semester', { required: 'Semester is required' })}>
                <option value="">Select semester</option>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </Select>
              <ErrorText>{errors.semester?.message}</ErrorText>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <SectionHeader icon={FiMapPin} title="Contact Address" subtitle="Optional mailing address" />
          <Textarea rows={3} placeholder="123 Main St, City, Country" {...register('address')} />
        </CardBody>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={submitting} size="lg">
          <FiSave className="h-4 w-4" /> {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;

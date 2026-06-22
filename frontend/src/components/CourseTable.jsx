import React, { useState } from 'react';
import { Pencil, Trash2, Save, X } from 'lucide-react';

/**
 * Renders courses with inline editing (covers the "Update Course" feature
 * without needing a separate /courses/edit/:id route).
 */
const CourseTable = ({ courses, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (course) => {
    setEditingId(course._id);
    setForm({ ...course });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async () => {
    await onUpdate(editingId, form);
    cancelEdit();
  };

  if (courses.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-500">No courses found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Course Name</th>
            <th className="px-4 py-3">Instructor</th>
            <th className="px-4 py-3">Credits</th>
            <th className="px-4 py-3">Semester</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses.map((course) => {
            const isEditing = editingId === course._id;
            return (
              <tr key={course._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{course.courseCode}</td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <input
                      className="input-field"
                      value={form.courseName}
                      onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                    />
                  ) : (
                    <span className="font-medium text-gray-900">{course.courseName}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {isEditing ? (
                    <input
                      className="input-field"
                      value={form.instructorName}
                      onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                    />
                  ) : (
                    course.instructorName
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {isEditing ? (
                    <input
                      type="number"
                      className="input-field w-20"
                      value={form.credits}
                      onChange={(e) => setForm({ ...form, credits: e.target.value })}
                    />
                  ) : (
                    course.credits
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {isEditing ? (
                    <input
                      type="number"
                      className="input-field w-20"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    />
                  ) : (
                    course.semester
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-green-50 hover:text-green-600"
                          title="Save"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(course)}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-primary-50 hover:text-primary-600"
                          title="Edit course"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(course._id)}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;

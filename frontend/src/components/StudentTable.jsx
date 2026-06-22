import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Mail, Phone } from 'lucide-react';

const StudentTable = ({ students, onDelete }) => {
  const navigate = useNavigate();

  if (students.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-500">No students found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">Roll No.</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Semester</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {students.map((student) => (
            <tr key={student._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{student.rollNumber}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {student.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt={student.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{student.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                <div className="flex items-center gap-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5" /> {student.email}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                  <Phone className="h-3.5 w-3.5" /> {student.phone}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{student.department}</td>
              <td className="px-4 py-3 text-gray-600">{student.semester}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/students/edit/${student._id}`)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-primary-50 hover:text-primary-600"
                    title="Edit student"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(student._id)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete student"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;

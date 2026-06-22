import React from 'react';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';

const AttendanceTable = ({ records, onToggleStatus, onDelete }) => {
  if (records.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-500">No attendance records found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {record.studentId?.name || 'Unknown'}{' '}
                <span className="text-xs text-gray-400">{record.studentId?.rollNumber}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{record.courseId?.courseName || 'Unknown'}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onToggleStatus(record)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    record.status === 'Present'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                  title="Click to toggle"
                >
                  {record.status === 'Present' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {record.status}
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(record._id)}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  title="Delete record"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;

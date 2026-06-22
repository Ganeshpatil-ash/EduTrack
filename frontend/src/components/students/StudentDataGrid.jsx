import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiEdit2, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';
import { Table, Thead, Th, Tbody, Tr, Td } from '../ui/Table.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { SkeletonRow } from '../ui/Skeleton.jsx';
import { FiUsers } from 'react-icons/fi';

const attendanceTone = (pct) => (pct >= 85 ? 'success' : pct >= 70 ? 'warning' : 'danger');

const StudentDataGrid = ({
  students, loading, sortBy, order, onSort, selected, onToggleSelect, onToggleSelectAll,
  attendanceMap, onDelete,
}) => {
  const navigate = useNavigate();
  const allSelected = students.length > 0 && students.every((s) => selected.includes(s._id));

  const handleSort = (field) => onSort(field, sortBy === field && order === 'asc' ? 'desc' : 'asc');

  if (loading) {
    return (
      <div className="divide-y divide-border dark:divide-border-dark">
        {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (students.length === 0) {
    return <EmptyState icon={FiUsers} title="No students found" description="Try adjusting your filters or add a new student" />;
  }

  return (
    <Table>
      <Thead>
        <Th className="w-10">
          <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} className="h-4 w-4 rounded accent-brand-600" />
        </Th>
        <Th sortable sortDir={sortBy === 'rollNumber' ? order : null} onSort={() => handleSort('rollNumber')}>Roll No.</Th>
        <Th sortable sortDir={sortBy === 'name' ? order : null} onSort={() => handleSort('name')}>Student</Th>
        <Th>Contact</Th>
        <Th sortable sortDir={sortBy === 'department' ? order : null} onSort={() => handleSort('department')}>Department</Th>
        <Th sortable sortDir={sortBy === 'semester' ? order : null} onSort={() => handleSort('semester')}>Semester</Th>
        <Th>Attendance</Th>
        <Th className="text-right">Actions</Th>
      </Thead>
      <Tbody>
        <AnimatePresence>
          {students.map((s) => {
            const att = attendanceMap?.[s._id];
            return (
              <motion.tr
                key={s._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group border-b border-border transition-colors last:border-0 hover:bg-surface-alt/60 dark:border-border-dark dark:hover:bg-surface-alt-dark/60"
              >
                <Td>
                  <input type="checkbox" checked={selected.includes(s._id)} onChange={() => onToggleSelect(s._id)} className="h-4 w-4 rounded accent-brand-600" />
                </Td>
                <Td className="data-mono text-slate-500 dark:text-slate-400">{s.rollNumber}</Td>
                <Td>
                  <button onClick={() => navigate(`/students/${s._id}`)} className="flex items-center gap-3 text-left">
                    <Avatar name={s.name} src={s.profileImage} size="sm" />
                    <span className="font-medium text-slate-900 hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400">{s.name}</span>
                  </button>
                </Td>
                <Td>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><FiMail className="h-3 w-3" /> {s.email}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><FiPhone className="h-3 w-3" /> {s.phone}</div>
                </Td>
                <Td>{s.department}</Td>
                <Td>Sem {s.semester}</Td>
                <Td>
                  {att ? <Badge tone={attendanceTone(att.pct)}>{att.pct}%</Badge> : <span className="text-xs text-slate-300 dark:text-slate-600">—</span>}
                </Td>
                <Td>
                  <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => navigate(`/students/${s._id}`)} title="View profile" className="rounded-md p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30">
                      <FiEye className="h-4 w-4" />
                    </button>
                    <button onClick={() => navigate(`/students/edit/${s._id}`)} title="Edit" className="rounded-md p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30">
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(s._id)} title="Delete" className="rounded-md p-1.5 text-slate-400 hover:bg-danger-bg hover:text-danger dark:hover:bg-danger-bg-dark">
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </motion.tr>
            );
          })}
        </AnimatePresence>
      </Tbody>
    </Table>
  );
};

export default StudentDataGrid;

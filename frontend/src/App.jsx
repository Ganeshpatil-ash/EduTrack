import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/Students.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import AddStudent from './pages/AddStudent.jsx';
import EditStudent from './pages/EditStudent.jsx';
import Courses from './pages/Courses.jsx';
import Attendance from './pages/Attendance.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route path="/students/edit/:id" element={<EditStudent />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/add" element={<Courses />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

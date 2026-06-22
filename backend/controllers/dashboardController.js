const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');

// @desc    Get aggregate stats for the dashboard
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalStudents, totalCourses, totalAttendanceRecords, presentCount] = await Promise.all([
    Student.countDocuments(),
    Course.countDocuments(),
    Attendance.countDocuments(),
    Attendance.countDocuments({ status: 'Present' }),
  ]);

  const attendancePercentage =
    totalAttendanceRecords === 0
      ? 0
      : Number(((presentCount / totalAttendanceRecords) * 100).toFixed(1));

  // Students per department, for a simple breakdown chart
  const studentsByDepartment = await Student.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Attendance percentage trend over the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const attendanceTrend = await Attendance.aggregate([
    { $match: { date: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Recent activity feed: latest students, courses, attendance entries combined
  const [recentStudents, recentCourses, recentAttendance] = await Promise.all([
    Student.find().sort('-createdAt').limit(3).select('name createdAt'),
    Course.find().sort('-createdAt').limit(3).select('courseName createdAt'),
    Attendance.find()
      .sort('-createdAt')
      .limit(3)
      .populate('studentId', 'name')
      .populate('courseId', 'courseName'),
  ]);

  const recentActivities = [
    ...recentStudents.map((s) => ({
      type: 'student',
      message: `New student added: ${s.name}`,
      date: s.createdAt,
    })),
    ...recentCourses.map((c) => ({
      type: 'course',
      message: `New course created: ${c.courseName}`,
      date: c.createdAt,
    })),
    ...recentAttendance.map((a) => ({
      type: 'attendance',
      message: `Attendance marked for ${a.studentId?.name || 'a student'} in ${
        a.courseId?.courseName || 'a course'
      }`,
      date: a.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  res.json({
    success: true,
    data: {
      totalStudents,
      totalCourses,
      attendancePercentage,
      studentsByDepartment,
      attendanceTrend,
      recentActivities,
    },
  });
});

module.exports = { getDashboardStats };

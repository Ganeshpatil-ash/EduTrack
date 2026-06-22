const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');

// @desc    Mark attendance for one or more students
//          Accepts either a single record or { records: [...] } for bulk marking
// @route   POST /api/attendance
// @access  Private
const markAttendance = asyncHandler(async (req, res) => {
  const { records } = req.body;

  // Bulk marking: an entire class roster for a given course/date
  if (Array.isArray(records) && records.length > 0) {
    const results = [];
    for (const record of records) {
      const { studentId, courseId, date, status } = record;
      if (!studentId || !courseId || !date || !status) continue;

      // upsert so re-marking the same day updates instead of duplicating
      const updated = await Attendance.findOneAndUpdate(
        { studentId, courseId, date },
        { studentId, courseId, date, status },
        { new: true, upsert: true, runValidators: true }
      );
      results.push(updated);
    }
    return res.status(201).json({ success: true, count: results.length, data: results });
  }

  // Single record
  const { studentId, courseId, date, status } = req.body;
  if (!studentId || !courseId || !date || !status) {
    res.status(400);
    throw new Error('studentId, courseId, date and status are required');
  }

  const attendance = await Attendance.findOneAndUpdate(
    { studentId, courseId, date },
    { studentId, courseId, date, status },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json({ success: true, data: attendance });
});

// @desc    Get attendance records (filterable by student, course, date range)
// @route   GET /api/attendance
// @access  Private
const getAttendance = asyncHandler(async (req, res) => {
  const { studentId, courseId, date, startDate, endDate, page = 1, limit = 20 } = req.query;

  const query = {};
  if (studentId) query.studentId = studentId;
  if (courseId) query.courseId = courseId;
  if (date) query.date = date;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const [records, total] = await Promise.all([
    Attendance.find(query)
      .populate('studentId', 'name rollNumber department')
      .populate('courseId', 'courseName courseCode')
      .sort('-date')
      .skip(skip)
      .limit(parseInt(limit, 10)),
    Attendance.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: records.length,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
    data: records,
  });
});

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
const getAttendanceById = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.params.id)
    .populate('studentId', 'name rollNumber department')
    .populate('courseId', 'courseName courseCode');

  if (!record) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  res.json({ success: true, data: record });
});

// @desc    Update an attendance record (e.g. correct Present/Absent)
// @route   PUT /api/attendance/:id
// @access  Private
const updateAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  if (req.body.status) record.status = req.body.status;
  if (req.body.date) record.date = req.body.date;

  const updated = await record.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
// @access  Private
const deleteAttendance = asyncHandler(async (req, res) => {
  const record = await Attendance.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  await record.deleteOne();

  res.json({ success: true, message: 'Attendance record removed' });
});

module.exports = {
  markAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};

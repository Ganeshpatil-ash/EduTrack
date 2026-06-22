const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all students (search, filter, sort, paginate)
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  const baseQuery = Student.find();

  const features = new ApiFeatures(baseQuery, req.query)
    .search(['name', 'email', 'rollNumber'])
    .filter(['department', 'semester'])
    .sort('-createdAt')
    .paginate();

  const students = await features.query;

  // Build a count query mirroring the same search/filter (without pagination)
  const countFeatures = new ApiFeatures(Student.find(), req.query)
    .search(['name', 'email', 'rollNumber'])
    .filter(['department', 'semester']);
  const total = await countFeatures.query.countDocuments();

  res.json({
    success: true,
    count: students.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: students,
  });
});

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate(
    'enrolledCourses',
    'courseName courseCode'
  );

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json({ success: true, data: student });
});

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    rollNumber,
    department,
    semester,
    address,
    dateOfBirth,
    profileImage,
  } = req.body;

  if (!name || !email || !phone || !rollNumber || !department || !semester || !dateOfBirth) {
    res.status(400);
    throw new Error('Please fill in all required student fields');
  }

  const student = await Student.create({
    name,
    email,
    phone,
    rollNumber,
    department,
    semester,
    address,
    dateOfBirth,
    profileImage,
  });

  res.status(201).json({ success: true, data: student });
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const updatableFields = [
    'name',
    'email',
    'phone',
    'rollNumber',
    'department',
    'semester',
    'address',
    'dateOfBirth',
    'profileImage',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
    }
  });

  const updatedStudent = await student.save();

  res.json({ success: true, data: updatedStudent });
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  await student.deleteOne();

  res.json({ success: true, message: 'Student removed successfully' });
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

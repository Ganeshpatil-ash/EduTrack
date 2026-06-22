const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all courses (search, filter, paginate)
// @route   GET /api/courses
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Course.find(), req.query)
    .search(['courseName', 'courseCode', 'instructorName'])
    .filter(['semester'])
    .sort('-createdAt')
    .paginate();

  const courses = await features.query;

  const countFeatures = new ApiFeatures(Course.find(), req.query)
    .search(['courseName', 'courseCode', 'instructorName'])
    .filter(['semester']);
  const total = await countFeatures.query.countDocuments();

  res.json({
    success: true,
    count: courses.length,
    total,
    page: features.pagination.page,
    pages: Math.ceil(total / features.pagination.limit),
    data: courses,
  });
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json({ success: true, data: course });
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
const createCourse = asyncHandler(async (req, res) => {
  const { courseName, courseCode, credits, instructorName, semester } = req.body;

  if (!courseName || !courseCode || !credits || !instructorName || !semester) {
    res.status(400);
    throw new Error('Please fill in all required course fields');
  }

  const course = await Course.create({
    courseName,
    courseCode,
    credits,
    instructorName,
    semester,
  });

  res.status(201).json({ success: true, data: course });
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const updatableFields = ['courseName', 'courseCode', 'credits', 'instructorName', 'semester'];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      course[field] = req.body[field];
    }
  });

  const updatedCourse = await course.save();

  res.json({ success: true, data: updatedCourse });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  await course.deleteOne();

  res.json({ success: true, message: 'Course removed successfully' });
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};

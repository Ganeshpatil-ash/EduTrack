const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: 1,
      max: 10,
    },
    instructorName: {
      type: String,
      required: [true, 'Instructor name is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);

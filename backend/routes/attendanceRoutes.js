const express = require('express');
const {
  markAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getAttendance).post(markAttendance);
router.route('/:id').get(getAttendanceById).put(updateAttendance).delete(deleteAttendance);

module.exports = router;

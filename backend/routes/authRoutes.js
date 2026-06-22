const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;

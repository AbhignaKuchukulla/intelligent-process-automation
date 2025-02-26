const express = require('express');
const { getUser, updateUserDetails } = require('../controllers/userController');

const router = express.Router();

router.get('/user/:userId', getUser);
router.put('/user/:userId', updateUserDetails);

module.exports = router;
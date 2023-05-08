const express = require('express')
const router = express.Router();
const {registerUser, loginUser, logoutUser, forgotPassword, resetPassword} = require('../controllers/userController')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/forgotpassword').get(forgotPassword)
router.route('/forgotpassword/reset/:token').put(resetPassword)

module.exports = router;
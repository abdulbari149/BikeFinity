const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/Auth.controller');
const { AuthVerifier } = require('../middleware/AuthVerifier');

router.post('/login', auth_controller.UserLogin);

router.post('/signup', auth_controller.UserSignup);

router.get('/checkUser/:email', auth_controller.checkUser);

router.get('/verifyToken', AuthVerifier);

router.post('/resetPassword', auth_controller.resetPassword);

router.post('/verifyOTP', auth_controller.verifyOTP);

router.post('/updatePassword', auth_controller.updatePassword);

module.exports = router;
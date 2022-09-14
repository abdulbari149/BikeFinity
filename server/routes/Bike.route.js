const express = require('express');
const router = express.Router();

const bike_controller = require('../controllers/Bike.controller');

router.get('/bikes', bike_controller.getAllBikes);

router.get('/bike/:id', bike_controller.getBike);

router.get('/make', bike_controller.getBikeMake);

router.get('/model/:make', bike_controller.getBikeModel);

router.get('/topRatedBikes', bike_controller.getTopRatedBikes);

module.exports = router;
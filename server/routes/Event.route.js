const express = require('express');
const router = express.Router();

const event_controller = require('../controllers/Event.controller');
const { AuthVerifier } = require('../middleware/AuthVerifier');

router.get('/getEvents', event_controller.getEvents);

router.get('/getEventsByType', event_controller.getEventsByType);

router.get('/getEventById/:id', event_controller.getEventsById);

router.post('/postEvent', AuthVerifier, event_controller.postEvent);

router.post('/interestedEvent', AuthVerifier, event_controller.interestedEvent); //:id => ad _id

router.post('/notInterestedEvent', AuthVerifier, event_controller.notInterestedEvent); //:id => ad _id

module.exports = router;
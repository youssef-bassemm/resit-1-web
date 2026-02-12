const express = require('express');
const { createAppointment, listAppointments } = require('../controllers/appointmentController.js');

const appointmentRouter = express.Router();

appointmentRouter
  .route('/')
  .get(listAppointments) // list all appointments (or by doctorId query param)
  .post(createAppointment); // create appointment

module.exports = appointmentRouter;


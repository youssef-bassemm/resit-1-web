const express = require('express');
const { createDoctor, listDoctors } = require('../controllers/doctorController.js');

const doctorRouter = express.Router();

doctorRouter
  .route('/')
  .get(listDoctors) // list all doctors
  .post(createDoctor); // create a doctor

module.exports = doctorRouter;


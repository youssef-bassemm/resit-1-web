const { db } = require('../db.js');

// POST /api/v1/appointments  -> create appointment
const createAppointment = (req, res) => {
  const doctorId = req.body.doctorId;
  const patientName = req.body.patientName || 'Anonymous';
  const appointmentDate = req.body.appointmentDate;
  const appointmentTime = req.body.appointmentTime;

  if (!doctorId || !appointmentDate || !appointmentTime) {
    return res
      .status(400)
      .json({ message: 'Doctor, date and time are required to book an appointment' });
  }

  const query = `
    INSERT INTO APPOINTMENT (DOCTOR_ID, PATIENT_NAME, APPOINTMENT_DATE, APPOINTMENT_TIME)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [doctorId, patientName, appointmentDate, appointmentTime], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error creating appointment' });
    }

    return res.status(201).json({
      id: this.lastID,
      doctorId,
      patientName,
      appointmentDate,
      appointmentTime,
    });
  });
};

// GET /api/v1/appointments  -> list all appointments (or by doctor)
const listAppointments = (req, res) => {
  const doctorId = req.query.doctorId;

  // No JOINs: just filter by doctor id if provided
  let query = `
    SELECT
      ID,
      DOCTOR_ID,
      PATIENT_NAME,
      APPOINTMENT_DATE,
      APPOINTMENT_TIME
    FROM APPOINTMENT
  `;

  const params = [];
  if (doctorId) {
    query += ' WHERE DOCTOR_ID = ?';
    params.push(doctorId);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving appointments' });
    }

    return res.status(200).json(rows);
  });
};

module.exports = {
  createAppointment,
  listAppointments,
};


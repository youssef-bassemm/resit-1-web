const { db } = require('../db.js');

// POST /api/v1/doctors  -> create a doctor
const createDoctor = (req, res) => {
  const name = req.body.name;
  const specialization = req.body.specialization;

  if (!name || !specialization) {
    return res.status(400).json({ message: 'Name and specialization are required' });
  }

  const query = `
    INSERT INTO DOCTOR (NAME, SPECIALIZATION)
    VALUES (?, ?)
  `;

  db.run(query, [name, specialization], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error creating doctor' });
    }

    return res.status(201).json({
      id: this.lastID,
      name,
      specialization,
    });
  });
};

// GET /api/v1/doctors  -> list all doctors
const listDoctors = (req, res) => {
  const query = `
    SELECT ID, NAME, SPECIALIZATION
    FROM DOCTOR
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving doctors' });
    }

    return res.status(200).json(rows);
  });
};

module.exports = {
  createDoctor,
  listDoctors,
};


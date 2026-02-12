const { app } = require('./index.js');
const db_access = require('./db.js');
const db = db_access.db;

const PORT = 3000;

// Initialize database tables
db.serialize(() => {
  db.run(db_access.createTripTable, (err) => {
    if (err) console.log('Error creating trip table:', err.message);
  });
  db.run(db_access.createUserTable, (err) => {
    if (err) console.log('Error creating user table:', err.message);
  });
  db.run(db_access.createDoctorTable, (err) => {
    if (err) console.log('Error creating doctor table:', err.message);
  });
  // For this coursework demo, drop and recreate APPOINTMENT so schema matches code
  db.run('DROP TABLE IF EXISTS APPOINTMENT', (err) => {
    if (err) console.log('Error dropping old appointment table:', err.message);
    db.run(db_access.createAppointmentTable, (err2) => {
      if (err2) console.log('Error creating appointment table:', err2.message);
    });
  });
});

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: text };
  }
}

const doctorForm = document.getElementById('doctor-form');
const doctorNameInput = document.getElementById('doctor-name');
const doctorSpecializationInput = document.getElementById('doctor-specialization');
const doctorMessage = document.getElementById('doctor-message');

const loadDoctorsBtn = document.getElementById('load-doctors-btn');
const existingDoctorSelect = document.getElementById('existing-doctor-select');
const useDoctorBtn = document.getElementById('use-doctor-btn');

const loadAppointmentsBtn = document.getElementById('load-appointments-btn');
const appointmentList = document.getElementById('appointment-list');

let currentDoctorId = null;

function showMessage(el, msg, isError = false) {
  el.textContent = msg;
  el.classList.toggle('error', isError);
  el.classList.toggle('success', !isError);
}

doctorForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = doctorNameInput.value.trim();
  const specialization = doctorSpecializationInput.value.trim();

  if (!name || !specialization) {
    return showMessage(doctorMessage, 'Please fill in all fields.', true);
  }

  const res = await api('/api/v1/doctors', {
    method: 'POST',
    body: JSON.stringify({ name, specialization }),
  });

  if (res.status === 201) {
    currentDoctorId = res.data.id;
    showMessage(doctorMessage, 'Doctor profile saved.', false);
  } else {
    const msg = typeof res.data === 'string' && res.data.trim().startsWith('<')
      ? 'Could not save doctor. Please try again.'
      : (res.data && res.data.message) || 'Could not save doctor. Please try again.';
    showMessage(doctorMessage, msg, true);
  }
});

loadDoctorsBtn.addEventListener('click', async () => {
  const res = await api('/api/v1/doctors');
  existingDoctorSelect.innerHTML = '';

  if (res.status !== 200 || !Array.isArray(res.data)) {
    const msg = typeof res.data === 'string' && res.data.trim().startsWith('<')
      ? 'Could not load doctors. Please try again.'
      : (res.data && res.data.message) || 'Could not load doctors. Please try again.';
    return showMessage(doctorMessage, msg, true);
  }

  res.data.forEach((doc) => {
    const opt = document.createElement('option');
    opt.value = String(doc.ID);
    opt.textContent = `Dr. ${doc.NAME} (${doc.SPECIALIZATION})`;
    existingDoctorSelect.appendChild(opt);
  });
});

useDoctorBtn.addEventListener('click', () => {
  const selectedId = Number(existingDoctorSelect.value);
  if (!selectedId) {
    return showMessage(doctorMessage, 'Please select a doctor from the list.', true);
  }
  currentDoctorId = selectedId;
  showMessage(doctorMessage, `Using doctor ID ${currentDoctorId} for appointments.`, false);
});

loadAppointmentsBtn.addEventListener('click', async () => {
  if (!currentDoctorId) {
    return showMessage(doctorMessage, 'Save your doctor profile first.', true);
  }

  const res = await api(`/api/v1/appointments?doctorId=${currentDoctorId}`);
  appointmentList.innerHTML = '';

  if (res.status !== 200 || !Array.isArray(res.data)) {
    const msg = typeof res.data === 'string' && res.data.trim().startsWith('<')
      ? 'Could not load appointments. Please try again.'
      : (res.data && res.data.message) || 'Could not load appointments. Please try again.';
    return showMessage(doctorMessage, msg, true);
  }

  res.data.forEach((appt) => {
    const li = document.createElement('li');
    li.textContent = `${appt.APPOINTMENT_DATE} ${appt.APPOINTMENT_TIME} - Patient: ${appt.PATIENT_NAME}`;
    appointmentList.appendChild(li);
  });
});


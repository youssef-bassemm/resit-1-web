let authToken = null;

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
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

const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const authMessage = document.getElementById('auth-message');

const loadDoctorsBtn = document.getElementById('load-doctors-btn');
const doctorList = document.getElementById('doctor-list');
const doctorSelect = document.getElementById('doctor-select');

const bookingForm = document.getElementById('booking-form');
const patientNameInput = document.getElementById('patient-name');
const appointmentDateInput = document.getElementById('appointment-date');
const appointmentTimeInput = document.getElementById('appointment-time');
const bookingMessage = document.getElementById('booking-message');

let availableDoctors = [];

function showMessage(el, msg, isError = false) {
  el.textContent = msg;
  el.classList.toggle('error', isError);
  el.classList.toggle('success', !isError);
}

signupBtn.addEventListener('click', async () => {
  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value;
  if (!email || !password) {
    return showMessage(authMessage, 'Please fill email and password.', true);
  }

  const res = await api('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 201) {
    authToken = res.data.token;
    showMessage(authMessage, 'Sign up successful. You are logged in.', false);
  } else {
    const msg =
      typeof res.data === 'string'
        ? res.data
        : (res.data && res.data.message) || 'Sign up failed.';
    showMessage(authMessage, msg, true);
  }
});

loginBtn.addEventListener('click', async () => {
  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value;
  if (!email || !password) {
    return showMessage(authMessage, 'Please fill email and password.', true);
  }

  const res = await api('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (res.status === 200) {
    authToken = res.data.token;
    showMessage(authMessage, 'Login successful.', false);
  } else {
    const msg =
      typeof res.data === 'string'
        ? res.data
        : (res.data && res.data.message) || 'Login failed.';
    showMessage(authMessage, msg, true);
  }
});

loadDoctorsBtn.addEventListener('click', async () => {
  const res = await api('/api/v1/doctors');
  doctorList.innerHTML = '';
  doctorSelect.innerHTML = '';

  if (res.status !== 200 || !Array.isArray(res.data)) {
    const msg = typeof res.data === 'string' && res.data.trim().startsWith('<')
      ? 'Could not load doctors. Try adding a doctor first.'
      : 'Could not load doctors. Try adding a doctor first.';
    return showMessage(bookingMessage, msg, true);
  }

  availableDoctors = res.data;

  res.data.forEach((doc) => {
    const li = document.createElement('li');
    li.textContent = `Dr. ${doc.NAME} (${doc.SPECIALIZATION})`;
    doctorList.appendChild(li);

    const opt = document.createElement('option');
    opt.value = String(doc.ID);
    opt.textContent = `Dr. ${doc.NAME} (${doc.SPECIALIZATION})`;
    doctorSelect.appendChild(opt);
  });
});

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const patientName = patientNameInput.value.trim();
  const doctorId = Number(doctorSelect.value);
  const date = appointmentDateInput.value.trim();
  const time = appointmentTimeInput.value.trim();

  if (!patientName || !doctorId || !date || !time) {
    return showMessage(bookingMessage, 'Please fill in all fields.', true);
  }

  const res = await api('/api/v1/appointments', {
    method: 'POST',
    body: JSON.stringify({
      doctorId,
      patientName,
      appointmentDate: date,
      appointmentTime: time,
    }),
  });

  if (res.status === 201) {
    showMessage(bookingMessage, 'Appointment booked successfully.', false);
  } else {
    const msg = typeof res.data === 'string' && res.data.trim().startsWith('<')
      ? 'Booking failed. Please try again.'
      : (res.data && res.data.message) || 'Booking failed. Please try again.';
    showMessage(bookingMessage, msg, true);
  }
});


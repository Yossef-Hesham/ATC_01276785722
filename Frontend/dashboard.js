document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  // Change ID selectors to match your HTML
  const email = document.getElementById('email').value; // Ensure input has id="email"
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email,  // Key must be 'email' (lowercase)
        password: password 
      }),
    });

    if (response.ok) {
      const data = await response.json();  // Get token from response
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('userData', JSON.stringify(data));
      
      showToast('Login Successful', 'Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      const error = await response.json();
      showToast('Login Failed', error.detail || 'Invalid credentials', 'error');
    }
  } catch (err) {
    showToast('Error', 'Network or server issue.', 'error');
  }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {

  e.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const isAdmin = document.getElementById('is-admin-checkbox')?.checked;
  const url = isAdmin ? 'http://127.0.0.1:8000/api/admin/register/' : 'http://127.0.0.1:8000/api/user/register/';
  

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      showToast('Success', 'Registered successfully.', 'success');
    } else {
      const err = await res.json();
      showToast('Registration Error', err.detail || 'Try again.', 'error');
    }
  } catch (err) {
    showToast('Error', 'Network/server issue.', 'error');
  }
});


checkAuth();  // place this at the end of your script

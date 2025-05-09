
// DOM Elements
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormElement = document.getElementById('login-form-element');
const registerFormElement = document.getElementById('register-form-element');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// Tab switching
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  clearErrors();
});

registerTab.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  clearErrors();
});

// Password toggle visibility
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
togglePasswordButtons.forEach(button => {
  button.addEventListener('click', () => {
    const passwordField = button.previousElementSibling;
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  });
});

// Form validation and submission
loginFormElement.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  // Reset errors
  clearErrors();
  
  // Validate
  let isValid = true;
  
  if (!email) {
    showError('email-error', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('email-error', 'Please enter a valid email');
    isValid = false;
  }
  
  if (!password) {
    showError('password-error', 'Password is required');
    isValid = false;
  } else if (password.length < 6) {
    showError('password-error', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (isValid) {
    // Simulate login API call
    simulateLoading(loginFormElement.querySelector('.btn'), 'Login', () => {
      // Success simulation
      showToast('Success!', 'You\'ve been logged in successfully.', 'success');
      
      // For demo: store a flag in session storage to indicate we're logged in
      sessionStorage.setItem('fromLogin', 'true');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });
  }
});

registerFormElement.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('full-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const agreeTerms = document.getElementById('terms').checked;
  
  // Reset errors
  clearErrors();
  
  // Validate
  let isValid = true;
  
  if (!name.trim()) {
    showError('name-error', 'Full name is required');
    isValid = false;
  }
  
  if (!email) {
    showError('register-email-error', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('register-email-error', 'Please enter a valid email');
    isValid = false;
  }
  
  if (!password) {
    showError('register-password-error', 'Password is required');
    isValid = false;
  } else if (password.length < 6) {
    showError('register-password-error', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (!confirmPassword) {
    showError('confirm-password-error', 'Please confirm your password');
    isValid = false;
  } else if (password !== confirmPassword) {
    showError('confirm-password-error', 'Passwords do not match');
    isValid = false;
  }
  
  if (!agreeTerms) {
    showError('terms-error', 'You must agree to the terms and conditions');
    isValid = false;
  }
  
  if (isValid) {
    // Simulate registration API call
    simulateLoading(registerFormElement.querySelector('.btn'), 'Create Account', () => {
      // Success simulation
      showToast('Registration successful!', 'Your account has been created.', 'success');
      
      // In a real app, you would save auth token and redirect
      setTimeout(() => {
        // Switch to login tab after successful registration
        loginTab.click();
      }, 1000);
    });
  }
});

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  
  // Also add error class to the related input
  const inputId = elementId.replace('-error', '');
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearErrors() {
  // Clear all error messages
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(element => {
    element.textContent = '';
  });
  
  // Remove error class from inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.classList.remove('error');
  });
}

function simulateLoading(button, originalText, callback) {
  // Disable button and show loading state
  button.disabled = true;
  button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Please wait...';
  
  // Simulate API delay
  setTimeout(() => {
    button.disabled = false;
    button.textContent = originalText;
    callback();
  }, 1500);
}

function showToast(title, message, type = 'success') {
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;
  
  // Auto hide after 5 seconds
  setTimeout(() => {
    hideToast();
  }, 5000);
}

function hideToast() {
  toast.classList.remove('show');
}

// Close toast on click
toastClose.addEventListener('click', hideToast);

// Add event handlers to the book now buttons
document.querySelectorAll('.btn-outline-primary').forEach(button => {
  if (button.textContent.trim() === 'Book Now') {
    button.addEventListener('click', () => {
      showToast('Login Required', 'Please log in to book this event.', 'error');
    });
  }
});

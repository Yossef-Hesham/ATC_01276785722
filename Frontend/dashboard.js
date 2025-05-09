
// DOM Elements
const logoutButton = document.getElementById('logout-button');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// Logout functionality
logoutButton.addEventListener('click', () => {
  // In a real app, you would clear authentication tokens here
  showToast('Logged out', 'You have been successfully logged out.', 'success');
  
  // Clear the session storage flag
  sessionStorage.removeItem('fromLogin');
  
  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
});

// Event handlers for dashboard elements
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    if (this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  });
});

// Add click handlers for booking buttons
document.querySelectorAll('.btn').forEach(button => {
  if (button.textContent.trim() === 'Book Now') {
    button.addEventListener('click', () => {
      showToast('Booking Successful', 'Event has been added to your calendar.', 'success');
    });
  }
  if (button.textContent.trim() === 'View Ticket') {
    button.addEventListener('click', () => {
      showToast('Ticket Viewer', 'Ticket functionality is not implemented in this demo.', 'success');
    });
  }
  if (button.textContent.trim() === 'Cancel Booking') {
    button.addEventListener('click', () => {
      showToast('Cancellation', 'Booking cancellation is not implemented in this demo.', 'error');
    });
  }
});

// Toast functions
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

// Check if user is logged in
function checkAuth() {
  // For demo: just check if we were redirected from login
  const fromLogin = sessionStorage.getItem('fromLogin');
  if (!fromLogin) {
    // Not authenticated, redirect to login
    showToast('Authentication Required', 'Please log in to access the dashboard.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }
}

// Run auth check when page loads
// Uncomment for real authentication check
// checkAuth();

// Sample event data with categories
let events = [];

// Authentication state
let currentUser = null;
const API_BASE_URL = "https://bookevent-production.up.railway.app/api";

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication state
    checkAuthState();
    
    // Setup register type toggle
    setupRegisterToggle();
    
    // Setup form submissions
    setupAuthForms();
    
    // Setup add event form
    setupAddEventForm();
    
    // Load events from API
    loadEvents();
    
    // Load appropriate content
    if (document.getElementById('eventsGrid')) {
        displayEvents();
    } else if (document.getElementById('eventDetails')) {
        displayEventDetails();
    }
});

// Load events from API
async function loadEvents() {
    try {
        showLoader();
        const response = await fetch(`${API_BASE_URL}/event/createORread/`);
        const data = await handleApiResponse(response);
        events = data.results;
        if (document.getElementById('eventsGrid')) {
            displayEvents();
        }
        hideLoader();
    } catch (error) {
        console.error('Error loading events:', error);
        showToast('Failed to load events', 'error');
        hideLoader();
    }
}

// Display events on home page
function displayEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const bookedEvents = JSON.parse(localStorage.getItem('bookedEvents')) || [];
    
    eventsGrid.innerHTML = '';
    
    if (events.length === 0) {
        eventsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No events available</h4>
                ${currentUser && (currentUser.isAdmin || currentUser.isSuperuser) ? 
                    '<button class="btn btn-purple mt-3" data-bs-toggle="modal" data-bs-target="#addEventModal">Add New Event</button>' : 
                    '<p class="text-muted">Check back later for upcoming events</p>'
                }
            </div>
        `;
        return;
    }
    
    events.forEach(event => {
        const isBooked = bookedEvents.includes(event.id);
        
        const eventCard = document.createElement('div');
        eventCard.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';
        eventCard.innerHTML = `
            <div class="event-card h-100">
                <img src="${event.Image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${event.Name}" class="event-image w-100">
                <div class="p-3">
                    <h5 class="event-title">${event.Name}</h5>
                    <p class="event-category mb-2"><i class="fas fa-tag me-2"></i>${formatCategory(event.category)}</p>
                    <p class="text-muted mb-2"><i class="fas fa-calendar-alt me-2"></i>${formatDate(event.Date)}</p>
                    <p class="text-muted mb-3"><i class="fas fa-map-marker-alt me-2"></i>${event.Venue || 'Location not specified'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="event-price fw-bold">${event.Price || 'Free'}</span>
                        ${isBooked ? 
                            '<span class="booked-label"><i class="fas fa-check me-2"></i>Booked</span>' : 
                            `<button onclick="bookEvent(${event.id})" class="btn btn-sm btn-purple">Book Now</button>`
                        }
                        ${currentUser && (currentUser.isAdmin || currentUser.isSuperuser) ? 
                            `<button onclick="deleteEvent(${event.id})" class="btn btn-sm btn-danger ms-2">
                                <i class="fas fa-trash"></i>
                            </button>` : ''
                        }
                    </div>
                </div>
            </div>
        `;
        
        eventsGrid.appendChild(eventCard);
    });
}

// Display single event details
function displayEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    const event = events.find(e => e.id === eventId);
    const eventDetails = document.getElementById('eventDetails');
    const bookedEvents = JSON.parse(localStorage.getItem('bookedEvents')) || [];
    const isBooked = bookedEvents.includes(eventId);
    
    if (!event) {
        eventDetails.innerHTML = `
            <div class="alert alert-danger">
                Event not found. <a href="index.html">Return to home page</a>
            </div>
        `;
        return;
    }

    eventDetails.innerHTML = `
        <div class="row g-4 event-details-container">
            <div class="col-lg-6">
                <img src="${event.Image || 'https://via.placeholder.com/600x400?text=No+Image'}" 
                     alt="${event.Name}" class="detail-image w-100 rounded">
            </div>
            <div class="col-lg-6 p-4">
                <span class="detail-category"><i class="fas fa-tag me-2"></i>${formatCategory(event.category)}</span>
                <h2 class="mb-3">${event.Name}</h2>
                <p class="mb-4">${event.Description || 'No description available'}</p>
                
                <div class="mb-4">
                    <h5 class="mb-3">Event Details</h5>
                    <p><i class="fas fa-calendar-alt me-2 text-purple"></i> <strong>Date:</strong> ${formatDate(event.Date)}</p>
                    <p><i class="fas fa-clock me-2 text-purple"></i> <strong>Time:</strong> ${formatTime(event.Date)}</p>
                    <p><i class="fas fa-map-marker-alt me-2 text-purple"></i> <strong>Venue:</strong> ${event.Venue || 'Location not specified'}</p>
                    <p><i class="fas fa-ticket-alt me-2 text-purple"></i> <strong>Price:</strong> ${event.Price || 'Free'}</p>
                </div>
                
                ${isBooked ? 
                    '<button class="btn btn-success btn-lg w-100" disabled><i class="fas fa-check me-2"></i>Booked</button>' : 
                    `<button onclick="bookEvent(${event.id})" class="btn btn-purple btn-lg w-100">
                        <i class="fas fa-bookmark me-2"></i>Book Now
                    </button>`
                }
                
                ${currentUser && (currentUser.isAdmin || currentUser.isSuperuser) ? `
                    <div class="mt-3 d-flex justify-content-end">
                        <button onclick="editEvent(${event.id})" class="btn btn-warning me-2">
                            <i class="fas fa-edit me-1"></i> Edit
                        </button>
                        <button onclick="deleteEvent(${event.id})" class="btn btn-danger">
                            <i class="fas fa-trash me-1"></i> Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Book an event
async function bookEvent(eventId) {
    if (!currentUser) {
        showToast('Please login to book events', 'warning');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }

    try {
        showLoader();
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/event/book/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                event: eventId
            })
        });

        await handleApiResponse(response);

        // Update local storage
        let bookedEvents = JSON.parse(localStorage.getItem('bookedEvents')) || [];
        if (!bookedEvents.includes(eventId)) {
            bookedEvents.push(eventId);
            localStorage.setItem('bookedEvents', JSON.stringify(bookedEvents));
        }

        // Show confirmation
        showToast('Event booked successfully!', 'success');
        
        // Refresh the display
        if (document.getElementById('eventsGrid')) {
            displayEvents();
        } else if (document.getElementById('eventDetails')) {
            displayEventDetails();
        }
    } catch (error) {
        console.error('Booking error:', error);
        showToast(error.message || 'Failed to book event. Please try again.', 'error');
    } finally {
        hideLoader();
    }
}

// Add new event
async function addNewEvent(eventData) {
    try {
        showLoader();
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/event/createORread/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(eventData)
        });

        const data = await handleApiResponse(response);
        showToast('Event added successfully!', 'success');
        
        // Reload events
        await loadEvents();
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
        
        return data;
    } catch (error) {
        console.error('Error adding event:', error);
        showToast(error.message || 'Failed to add event. Please try again.', 'error');
        throw error;
    } finally {
        hideLoader();
    }
}

// Edit event
async function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Fill the form with event data
    document.getElementById('eventId').value = event.id;
    document.getElementById('eventName').value = event.Name;
    document.getElementById('eventDescription').value = event.Description;
    document.getElementById('eventCategory').value = event.category;
    
    // Format date for datetime-local input
    const eventDate = new Date(event.Date);
    const formattedDate = eventDate.toISOString().slice(0, 16);
    document.getElementById('eventDate').value = formattedDate;
    
    document.getElementById('eventVenue').value = event.Venue || '';
    document.getElementById('eventPrice').value = event.Price || '';
    document.getElementById('eventImage').value = event.Image || '';

    // Change modal title and button
    document.querySelector('#addEventModal .modal-title').textContent = 'Edit Event';
    document.querySelector('#addEventForm button[type="submit"]').textContent = 'Update Event';

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    modal.show();
}

// Delete event
async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        showLoader();
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/event/createORread/${eventId}/`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete event');
        }

        showToast('Event deleted successfully!', 'success');
        
        // Reload events
        await loadEvents();
        
        // If on event details page, redirect to home
        if (document.getElementById('eventDetails')) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast(error.message || 'Failed to delete event. Please try again.', 'error');
    } finally {
        hideLoader();
    }
}

// Setup add/edit event form
function setupAddEventForm() {
    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
        // Add hidden input for event ID (used for editing)
        const eventIdInput = document.createElement('input');
        eventIdInput.type = 'hidden';
        eventIdInput.id = 'eventId';
        eventIdInput.name = 'eventId';
        addEventForm.prepend(eventIdInput);

        addEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const eventData = {
                Name: document.getElementById('eventName').value,
                Description: document.getElementById('eventDescription').value,
                category: document.getElementById('eventCategory').value,
                Date: document.getElementById('eventDate').value,
                Venue: document.getElementById('eventVenue').value,
                Price: document.getElementById('eventPrice').value,
                Image: document.getElementById('eventImage').value
            };

            const eventId = document.getElementById('eventId').value;

            try {
                if (eventId) {
                    // Update existing event
                    await updateEvent(eventId, eventData);
                } else {
                    // Add new event
                    await addNewEvent(eventData);
                }
                addEventForm.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Reset form when modal is closed
    document.getElementById('addEventModal').addEventListener('hidden.bs.modal', function() {
        const form = document.getElementById('addEventForm');
        form.reset();
        document.getElementById('eventId').value = '';
        document.querySelector('#addEventModal .modal-title').textContent = 'Add New Event';
        document.querySelector('#addEventForm button[type="submit"]').textContent = 'Add Event';
    });
}

// Update existing event
async function updateEvent(eventId, eventData) {
    try {
        showLoader();
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/event/createORread/${eventId}/`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(eventData)
        });

        const data = await handleApiResponse(response);
        showToast('Event updated successfully!', 'success');
        
        // Reload events
        await loadEvents();
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addEventModal')).hide();
        
        return data;
    } catch (error) {
        console.error('Error updating event:', error);
        showToast(error.message || 'Failed to update event. Please try again.', 'error');
        throw error;
    } finally {
        hideLoader();
    }
}

// Check if user is logged in
function checkAuthState() {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    
    if (token && userData) {
        currentUser = {
            username: userData.username,
            email: userData.email,
            userId: userData.userId,
            isAdmin: userData.isAdmin || false,
            isSuperuser: userData.isSuperuser || false
        };
        updateAuthUI();
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const adminAddEventItem = document.getElementById('adminAddEventItem');
    
    if (currentUser) {
        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i> ${currentUser.username}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    ${currentUser.isAdmin || currentUser.isSuperuser ? '<li><a class="dropdown-item" href="#">Admin Panel</a></li>' : ''}
                    <li><a class="dropdown-item" href="#">Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                </ul>
            </div>
        `;
        
        // Show/hide admin add event button
        if (currentUser.isAdmin || currentUser.isSuperuser) {
            if (adminAddEventItem) adminAddEventItem.style.display = 'block';
        } else {
            if (adminAddEventItem) adminAddEventItem.style.display = 'none';
        }
        
        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="fas fa-sign-in-alt me-1"></i> Login
            </button>
            <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#registerModal">
                <i class="fas fa-user-plus me-1"></i> Register
            </button>
        `;
        if (adminAddEventItem) adminAddEventItem.style.display = 'none';
    }
}

// Setup register type toggle
function setupRegisterToggle() {
    const userBtn = document.getElementById('userRegisterBtn');
    const adminBtn = document.getElementById('adminRegisterBtn');
    const secretKeyContainer = document.getElementById('secretKeyContainer');
    
    if (userBtn && adminBtn && secretKeyContainer) {
        // Initialize state
        secretKeyContainer.style.display = 'none';
        
        userBtn.addEventListener('click', () => {
            userBtn.classList.add('active');
            adminBtn.classList.remove('active');
            secretKeyContainer.style.display = 'none';
        });
        
        adminBtn.addEventListener('click', () => {
            adminBtn.classList.add('active');
            userBtn.classList.remove('active');
            secretKeyContainer.style.display = 'block';
        });
    }
}

// Handle API responses
async function handleApiResponse(response) {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error(response.statusText);
        }
        throw new Error(errorData.detail || JSON.stringify(errorData));
    }
    return await response.json();
}

// Setup authentication forms
function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                showLoader();
                const response = await fetch(`${API_BASE_URL}/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await handleApiResponse(response);
                
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify({
                    userId: data.user_id,
                    email: data.email,
                    username: data.username,
                    isAdmin: data.is_admin,
                    isSuperuser: data.is_superuser
                }));
                
                currentUser = {
                    username: data.username,
                    email: data.email,
                    userId: data.user_id,
                    isAdmin: data.is_admin,
                    isSuperuser: data.is_superuser
                };
                
                updateAuthUI();
                bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                showToast('Login successful!', 'success');
                
                // Refresh the page if we're on the events page
                if (document.getElementById('eventsGrid') || document.getElementById('eventDetails')) {
                    await loadEvents();
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast(error.message || 'Login failed. Please try again.', 'error');
            } finally {
                hideLoader();
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const isAdmin = document.getElementById('adminRegisterBtn').classList.contains('active');
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const secret_key = isAdmin ? document.getElementById('registerSecretKey').value : null;
            
            const endpoint = isAdmin 
                ? `${API_BASE_URL}/register/admin/` 
                : `${API_BASE_URL}/register/user/`;
            
            try {
                showLoader();
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                        ...(isAdmin && { secret_key })
                    })
                });

                await handleApiResponse(response);
                
                bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
                showToast('Registration successful! Please login.', 'success');
                
                // Reset form
                registerForm.reset();
            } catch (error) {
                console.error('Registration error:', error);
                showToast(error.message || 'Registration failed. Please try again.', 'error');
            } finally {
                hideLoader();
            }
        });
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'danger'}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '11';
    document.body.appendChild(container);
    return container;
}

// Show loader
function showLoader() {
    let loader = document.getElementById('loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.className = 'loader-overlay';
        loader.innerHTML = `
            <div class="spinner-border text-purple" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

// Hide loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Format date as "Month Day, Year"
function formatDate(dateString) {
    if (!dateString) return 'Date not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format time from ISO string
function formatTime(dateString) {
    if (!dateString) return 'Time not specified';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Format category name
function formatCategory(category) {
    if (!category) return 'Uncategorized';
    const categories = {
        'social': 'Social Events',
        'professional': 'Professional Events',
        'educational': 'Educational Events',
        'cultural': 'Cultural Events'
    };
    return categories[category] || category;
}

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    updateAuthUI();
    showToast('Logged out successfully', 'success');
    
    // Refresh the page if we're on the events page
    if (document.getElementById('eventsGrid') || document.getElementById('eventDetails')) {
        loadEvents();
    }
}

// Global functions for HTML onclick handlers
window.bookEvent = bookEvent;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
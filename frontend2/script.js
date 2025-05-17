// Sample event data with categories
const events = [
    {
        id: 1,
        title: "Fantasy Book Launch Party",
        description: "Join us for the launch of the newest fantasy epic from bestselling author Jane Doe. There will be a reading, Q&A session, and book signing. Don't miss this opportunity to meet the author and get your copy signed!",
        category: "Social Events (Parties, reunions, weddings)",
        date: "2023-12-15",
        venue: "Central Library, Main Hall",
        price: "Free",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        booked: false
    },
    {
        id: 2,
        title: "Mystery Writers Conference",
        description: "Three acclaimed mystery writers discuss their craft, latest works, and the future of the genre in this engaging panel discussion.",
        category: "Professional Events (Conferences, workshops)",
        date: "2023-12-20",
        venue: "Bookworm Cafe",
        price: "$15",
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        booked: false
    },
    {
        id: 3,
        title: "Children's Storytime",
        description: "A magical storytelling hour for children aged 4-8. Includes animated readings and interactive storytelling activities.",
        category: "Family Events (Children’s programs, family fun)",
        date: "2023-12-22",
        venue: "Library Kids Zone",
        price: "Free",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        booked: false
    },
    {
        id: 4,
        title: "Local Poets Night",
        description: "Enjoy an evening of poetic expression from local talents. Open mic slots available for walk-ins.",
        category: "Cultural Events (Art shows, readings)",
        date: "2023-12-18",
        venue: "Downtown Community Center",
        price: "$5",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        booked: false
    },
    {
        id: 5,
        title: "Tech Innovators Meetup",
        description: "A networking event for developers, designers, and tech entrepreneurs to share ideas and collaborate.",
        category: "Professional Events (Conferences, workshops)",
        date: "2023-12-25",
        venue: "Innovation Hub Auditorium",
        price: "$20",
        image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        booked: false
    }
];

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
    
    // Load appropriate content
    if (document.getElementById('eventsGrid')) {
        displayEvents();
    } else if (document.getElementById('eventDetails')) {
        displayEventDetails();
    }
});

// Display events on home page
function displayEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const bookedEvents = JSON.parse(localStorage.getItem('bookedEvents')) || [];
    
    eventsGrid.innerHTML = '';
    
    events.forEach(event => {
        const isBooked = bookedEvents.includes(event.id);
        
        const eventCard = document.createElement('div');
        eventCard.className = 'col-md-6 col-lg-4 col-xl-3';
        eventCard.innerHTML = `
            <div class="event-card h-100">
                <img src="${event.image}" alt="${event.title}" class="event-image w-100">
                <div class="p-3">
                    <h5 class="event-title">${event.title}</h5>
                    <p class="event-category mb-2"><i class="fas fa-tag me-2"></i>${event.category}</p>
                    <p class="text-muted mb-2"><i class="fas fa-calendar-alt me-2"></i>${formatDate(event.date)}</p>
                    <p class="text-muted mb-3"><i class="fas fa-map-marker-alt me-2"></i>${event.venue}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="event-price fw-bold">${event.price}</span>
                        ${isBooked ? 
                            '<span class="booked-label"><i class="fas fa-check me-2"></i>Booked</span>' : 
                            `<button onclick="bookEvent(${event.id})" class="btn btn-sm btn-purple">Book Now</button>`
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
    
    if (event) {
        eventDetails.innerHTML = `
            <div class="row g-4 event-details-container">
                <div class="col-lg-6">
                    <img src="${event.image}" alt="${event.title}" class="detail-image w-100 rounded">
                </div>
                <div class="col-lg-6 p-4">
                    <span class="detail-category"><i class="fas fa-tag me-2"></i>${event.category}</span>
                    <h2 class="mb-3">${event.title}</h2>
                    <p class="mb-4">${event.description}</p>
                    
                    <div class="mb-4">
                        <h5 class="mb-3">Event Details</h5>
                        <p><i class="fas fa-calendar-alt me-2 text-purple"></i> <strong>Date:</strong> ${formatDate(event.date)}</p>
                        <p><i class="fas fa-clock me-2 text-purple"></i> <strong>Time:</strong> 6:00 PM - 8:00 PM</p>
                        <p><i class="fas fa-map-marker-alt me-2 text-purple"></i> <strong>Venue:</strong> ${event.venue}</p>
                        <p><i class="fas fa-ticket-alt me-2 text-purple"></i> <strong>Price:</strong> ${event.price}</p>
                    </div>
                    
                    ${isBooked ? 
                        '<button class="btn btn-success btn-lg w-100" disabled><i class="fas fa-check me-2"></i>Booked</button>' : 
                        `<button onclick="bookEvent(${event.id})" class="btn btn-purple btn-lg w-100">
                            <i class="fas fa-bookmark me-2"></i>Book Now
                        </button>`
                    }
                </div>
            </div>
        `;
    } else {
        eventDetails.innerHTML = '<div class="alert alert-danger">Event not found</div>';
    }
}

// Book an event
async function bookEvent(eventId) {
    if (!currentUser) {
        alert('Please login to book events');
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }

    try {
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

        if (!response.ok) {
            throw new Error('Booking failed');
        }

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
        showToast('Failed to book event. Please try again.', 'error');
    }
}

// Format date as "Month Day, Year"
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
    const authButtons = document.querySelector('.navbar .d-flex');
    
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
        
        document.getElementById('logoutBtn').addEventListener('click', logout);
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
                if (document.getElementById('eventsGrid')) {
                    displayEvents();
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast(error.message || 'Login failed. Please try again.', 'error');
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
            }
        });
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
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

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('bookedEvents');
    currentUser = null;
    updateAuthUI();
    showToast('Logged out successfully', 'success');
    
    // Refresh the page if we're on the events page
    if (document.getElementById('eventsGrid')) {
        displayEvents();
    }
}
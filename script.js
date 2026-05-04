// Car rental data
const cars = [
    {
        id: 1,
        name: "Toyota Corolla",
        model: "2023 - Economy",
        price: 45,
        transmission: "Automatic",
        passengers: "5",
        fuel: "Petrol"
    },
    {
        id: 2,
        name: "Honda Civic",
        model: "2023 - Sedan",
        price: 55,
        transmission: "Automatic",
        passengers: "5",
        fuel: "Petrol"
    },
    {
        id: 3,
        name: "Toyota Highlander",
        model: "2023 - SUV",
        price: 85,
        transmission: "Automatic",
        passengers: "7",
        fuel: "Hybrid"
    },
    {
        id: 4,
        name: "BMW 320i",
        model: "2023 - Premium",
        price: 120,
        transmission: "Automatic",
        passengers: "5",
        fuel: "Petrol"
    },
    {
        id: 5,
        name: "Mercedes-Benz C-Class",
        model: "2023 - Luxury",
        price: 150,
        transmission: "Automatic",
        passengers: "5",
        fuel: "Diesel"
    },
    {
        id: 6,
        name: "Mazda CX-5",
        model: "2023 - Compact SUV",
        price: 70,
        transmission: "Automatic",
        passengers: "5",
        fuel: "Petrol"
    }
];

// Contact information - UPDATE THIS WITH YOUR ACTUAL DETAILS
const OWNER_PHONE = "055-2174569 / 053-537854"; // Your phone numbers
const WHATSAPP_LINK = "https://wa.me/message/32JFCSOBEFQYF1"; // Direct WhatsApp link

// Global variable to track rental car for auth flow
let pendingRentalCarId = null;
let pendingRentalWhatsappLink = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    populateCars();
    setupModal();
    setupLightbox();
    setupAuthModal();
    initializeGoogleSignIn();
    updateContactLinks();
    checkUserLoggedIn();
});

// Check if user is already logged in - SIGNUP COMPULSORY
function checkUserLoggedIn() {
    const currentUser = localStorage.getItem('zubae_currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        displayUserProfile(user);
    } else {
        // Redirect to welcome page if not logged in
        window.location.href = 'welcome.html';
    }
}

// Display user profile in navbar
function displayUserProfile(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const adminLinkContainer = document.getElementById('adminLinkContainer');
    
    loginBtn.style.display = 'none';
    userProfile.style.display = 'flex';
    if (adminLinkContainer) {
        adminLinkContainer.style.display = 'none';
    }
    
    let profileHTML = 'Hi, ' + user.name.split(' ')[0];
    if (user.picture) {
        profileHTML = `<img src="${user.picture}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 0.5rem;"> ` + profileHTML;
    }
    userName.innerHTML = profileHTML;
}

// Logout user
function logout() {
    localStorage.removeItem('zubae_currentUser');
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('userProfile').style.display = 'none';
    const adminLinkContainer = document.getElementById('adminLinkContainer');
    if (adminLinkContainer) {
        adminLinkContainer.style.display = 'block';
    }
}

// Open auth modal
function openAuthModal(carId = null, tab = 'signup') {
    if (carId !== null) {
        pendingRentalCarId = carId;
        pendingRentalWhatsappLink = WHATSAPP_LINK;
    }
    
    // Switch to appropriate tab (signup when clicking rent, login otherwise)
    switchAuthTab(tab);
    document.getElementById('authModal').style.display = 'flex';
}

// Close auth modal
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Open user details modal
function openUserDetailsModal() {
    const currentUser = JSON.parse(localStorage.getItem('zubae_currentUser'));
    if (currentUser) {
        document.getElementById('detailName').textContent = currentUser.name;
        document.getElementById('detailEmail').textContent = currentUser.email;
        document.getElementById('detailPhone').textContent = currentUser.phone;
        const memberDate = new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        document.getElementById('detailDate').textContent = memberDate;
        document.getElementById('userDetailsModal').style.display = 'flex';
    }
}

// Close user details modal
function closeUserDetailsModal() {
    document.getElementById('userDetailsModal').style.display = 'none';
}

// Switch between login and signup tabs
function switchAuthTab(tab) {
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupTab').classList.remove('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

// Setup auth modal
function setupAuthModal() {
    const authModal = document.getElementById('authModal');
    
    window.onclick = function(event) {
        if (event.target == authModal) {
            authModal.style.display = 'none';
        }
    }
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    // Check if Google Sign-In API is loaded
    if (window.google && window.google.accounts && window.google.accounts.id) {
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleSignIn
        });
        
        // Render Google Sign-In buttons
        setTimeout(() => {
            if (document.getElementById('googleLoginButton')) {
                google.accounts.id.renderButton(
                    document.getElementById('googleLoginButton'),
                    {
                        theme: 'outline',
                        size: 'large',
                        width: '100%',
                        text: 'signin_with'
                    }
                );
            }
            
            if (document.getElementById('googleSignupButton')) {
                google.accounts.id.renderButton(
                    document.getElementById('googleSignupButton'),
                    {
                        theme: 'outline',
                        size: 'large',
                        width: '100%',
                        text: 'signup_with'
                    }
                );
            }
        }, 500);
    }
}

// Handle Google Sign-In response
function handleGoogleSignIn(response) {
    // Decode the JWT token
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const userData = JSON.parse(jsonPayload);
    
    // Create or get user
    const googleUser = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        provider: 'google',
        createdAt: new Date().toISOString()
    };
    
    // Store current user
    localStorage.setItem('zubae_currentUser', JSON.stringify(googleUser));
    
    // Also store in users list for consistency
    const users = JSON.parse(localStorage.getItem('zubae_users')) || [];
    const existingUserIndex = users.findIndex(u => u.email === googleUser.email);
    
    if (existingUserIndex === -1) {
        users.push(googleUser);
        localStorage.setItem('zubae_users', JSON.stringify(users));
    }
    
    displayUserProfile(googleUser);
    closeAuthModal();
    
    // If there's a pending rental, show the rental info after login
    if (pendingRentalCarId !== null) {
        const carId = pendingRentalCarId;
        const whatsappLink = pendingRentalWhatsappLink;
        
        // Clear pending rental
        pendingRentalCarId = null;
        pendingRentalWhatsappLink = null;
        
        // Show rental info
        setTimeout(() => {
            toggleRentInfo(carId, whatsappLink);
        }, 500);
    }
}

// Handle Google logout
function handleGoogleLogout() {
    if (window.google && window.google.accounts) {
        google.accounts.id.revoke(localStorage.getItem('zubae_currentUser') ? JSON.parse(localStorage.getItem('zubae_currentUser')).email : '', () => {});
    }
    logout();
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const ADMIN_PASSWORD = 'Afia123nti';
    
    // Check if this is admin login attempt
    if (password === ADMIN_PASSWORD) {
        // Admin login successful
        sessionStorage.setItem('adminLoggedIn', 'true');
        closeAuthModal();
        document.getElementById('loginForm').reset();
        
        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 300);
        return;
    }
    
    // Regular user login - check both email and password
    const users = JSON.parse(localStorage.getItem('zubae_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('zubae_currentUser', JSON.stringify(user));
        displayUserProfile(user);
        closeAuthModal();
        document.getElementById('loginForm').reset();
        
        // If there's a pending rental, show the rental info after login
        if (pendingRentalCarId !== null) {
            const carId = pendingRentalCarId;
            const whatsappLink = pendingRentalWhatsappLink;
            
            // Clear pending rental
            pendingRentalCarId = null;
            pendingRentalWhatsappLink = null;
            
            // Show rental info
            setTimeout(() => {
                toggleRentInfo(carId, whatsappLink);
            }, 500);
        }
    } else {
        // Check if email exists but password is wrong
        const emailExists = users.find(u => u.email === email);
        if (emailExists) {
            alert('Incorrect password. Please try again.');
        } else {
            alert('Email not found. Please create an account.');
        }
    }
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('zubae_users')) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert('Email already registered. Please login.');
        switchAuthTab('login');
        return;
    }
    
    // Create new user with password
    const newUser = { name, email, phone, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('zubae_users', JSON.stringify(users));
    localStorage.setItem('zubae_currentUser', JSON.stringify(newUser));
    
    displayUserProfile(newUser);
    closeAuthModal();
    document.getElementById('signupForm').reset();
    
    // If there's a pending rental, show the rental info after signup
    if (pendingRentalCarId !== null) {
        const carId = pendingRentalCarId;
        const whatsappLink = pendingRentalWhatsappLink;
        
        // Clear pending rental
        pendingRentalCarId = null;
        pendingRentalWhatsappLink = null;
        
        // Show rental info
        setTimeout(() => {
            toggleRentInfo(carId, whatsappLink);
        }, 500);
    }
};

// Populate cars grid
function populateCars() {
    // Load cars from localStorage if they exist (admin may have added/edited them)
    const storedCars = localStorage.getItem('zubae_cars');
    const carsToDisplay = storedCars ? JSON.parse(storedCars) : cars;
    
    const carsGrid = document.getElementById('carsGrid');
    carsGrid.innerHTML = '';

    carsToDisplay.forEach(car => {
        const carCard = createCarCard(car, WHATSAPP_LINK);
        carsGrid.appendChild(carCard);
    });
}

// Create car card element
function createCarCard(car, whatsappLink) {
    const card = document.createElement('div');
    card.className = 'car-card';

    card.innerHTML = `
        <div class="car-image" onclick="openLightbox('${car.image || ''}', '${car.name}')" style="cursor: pointer;">
            ${car.image ? `<img src="${car.image}" alt="${car.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 600; color: rgba(255,255,255,0.3);">${car.name.charAt(0)}</div>`}
        </div>
        <div class="car-details">
            <h3>${car.name}</h3>
            <p class="car-model">${car.model}</p>
            
            <div class="car-specs">
                <div class="spec-item">
                    <span class="label">Transmission</span>
                    <span class="value">${car.transmission}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Passengers</span>
                    <span class="value">${car.passengers}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Fuel Type</span>
                    <span class="value">${car.fuel}</span>
                </div>
                <div class="spec-item">
                    <span class="label">Rating</span>
                    <span class="value">⭐ 4.8</span>
                </div>
            </div>

            <div class="price">₵${car.price} <span class="period">/day</span></div>

            <div class="contact-info-inline" id="contact-${car.id}">
                <p><strong>📞 Call or WhatsApp:</strong></p>
                <p class="phone">${OWNER_PHONE}</p>
                <a href="${whatsappLink}" class="whatsapp-link" target="_blank">
                    💬 Chat on WhatsApp
                </a>
            </div>

            <button class="btn btn-rent" onclick="toggleRentInfo(${car.id}, '${whatsappLink}')">
                Rent Now
            </button>
        </div>
    `;

    return card;
}

// Toggle rent information display
function toggleRentInfo(carId, whatsappLink) {
    // Check if user is logged in
    const currentUser = localStorage.getItem('zubae_currentUser');
    if (!currentUser) {
        // Store the car rental info and open signup modal
        openAuthModal(carId, 'signup');
        return;
    }
    
    const contactInfo = document.getElementById(`contact-${carId}`);
    
    // Close all other open contact info
    document.querySelectorAll('.contact-info-inline.active').forEach(element => {
        if (element.id !== `contact-${carId}`) {
            element.classList.remove('active');
        }
    });

    // Toggle current contact info
    if (!contactInfo.classList.contains('active')) {
        contactInfo.classList.add('active');
        // Save inquiry to localStorage
        saveInquiry(carId);
    } else {
        contactInfo.classList.remove('active');
    }

    // Scroll to contact info
    if (contactInfo.classList.contains('active')) {
        setTimeout(() => {
            contactInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Save inquiry to localStorage
function saveInquiry(carId) {
    const storedCars = localStorage.getItem('zubae_cars');
    const carsToSearch = storedCars ? JSON.parse(storedCars) : cars;
    const car = carsToSearch.find(c => c.id === carId);
    const currentUser = JSON.parse(localStorage.getItem('zubae_currentUser')) || {};
    
    if (!car) return;
    
    const inquiry = {
        carId: carId,
        carName: car.name,
        customerEmail: currentUser.email || 'Unknown',
        customerName: currentUser.name || 'Unknown',
        timestamp: new Date().toISOString()
    };
    
    const inquiries = JSON.parse(localStorage.getItem('zubae_inquiries')) || [];
    inquiries.push(inquiry);
    localStorage.setItem('zubae_inquiries', JSON.stringify(inquiries));
}

// Setup modal functionality
function setupModal() {
    const modal = document.getElementById('carModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Setup lightbox functionality
function setupLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const closeBtn = document.querySelector('.lightbox-close');

    closeBtn.onclick = function() {
        lightbox.style.display = 'none';
    }

    // Close lightbox when clicking outside the image
    lightbox.onclick = function(event) {
        if (event.target == lightbox) {
            lightbox.style.display = 'none';
        }
    }

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });
}

// Open lightbox for full-size image view
function openLightbox(imageSrc, carName) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxInfo = document.getElementById('lightboxInfo');

    if (imageSrc) {
        lightboxImage.src = imageSrc;
        lightboxInfo.innerHTML = `<p>${carName}</p>`;
        lightbox.style.display = 'flex';
    }
}

// Update all contact links with actual phone number
function updateContactLinks() {
    const contactSection = document.querySelector('.contact-section .btn-whatsapp');
    if (contactSection) {
        contactSection.href = WHATSAPP_LINK;
    }
}

// Utility function to copy phone number to clipboard
function copyPhoneNumber() {
    navigator.clipboard.writeText(OWNER_PHONE).then(() => {
        alert('Phone number copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy phone number');
    });
}

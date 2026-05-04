// Admin Dashboard Script

// Admin credentials
const ADMIN_PASSWORD = "Afia123nti";

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'flex';
        initializeDashboard();
    }
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        initializeDashboard();
    } else {
        alert('❌ Incorrect password. Try again.');
        document.getElementById('adminPassword').value = '';
    }
}

// Initialize dashboard
function initializeDashboard() {
    loadCars();
    loadSettings();
    updateStats();
    setupCarForm();
}

// Switch tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Mark nav item as active
    event.target.classList.add('active');
    
    if (tabName === 'cars') {
        loadCars();
    } else if (tabName === 'customers') {
        loadCustomers();
    } else if (tabName === 'inquiries') {
        loadInquiries();
    }
}

// Load and display cars
function loadCars() {
    const cars = JSON.parse(localStorage.getItem('zubae_cars')) || getDefaultCars();
    const carsTable = document.getElementById('carsTable');
    
    if (cars.length === 0) {
        carsTable.innerHTML = '<p class="empty-state">No cars yet. Add your first car!</p>';
        return;
    }
    
    const table = `
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Car Name</th>
                    <th>Model</th>
                    <th>Price/Day</th>
                    <th>Transmission</th>
                    <th>Passengers</th>
                    <th>Fuel</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${cars.map((car, index) => `
                    <tr>
                        <td>
                            ${car.image ? `<img src="${car.image}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">` : `<div style="font-size: 1.5rem;">${car.emoji}</div>`}
                        </td>
                        <td>${car.name}</td>
                        <td>${car.model}</td>
                        <td>₵${car.price}</td>
                        <td>${car.transmission}</td>
                        <td>${car.passengers}</td>
                        <td>${car.fuel}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-edit" onclick="editCar(${index})">✏️ Edit</button>
                                <button class="btn-delete" onclick="deleteCar(${index})">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    carsTable.innerHTML = table;
    document.getElementById('totalCars').textContent = cars.length;
}

// Get default cars
function getDefaultCars() {
    return [
        {
            id: 1,
            name: "Toyota Corolla",
            model: "2023 - Economy",
            price: 45,
            transmission: "Automatic",
            passengers: "5",
            fuel: "Petrol",
            emoji: "🚗"
        },
        {
            id: 2,
            name: "Honda Civic",
            model: "2023 - Sedan",
            price: 55,
            transmission: "Automatic",
            passengers: "5",
            fuel: "Petrol",
            emoji: "🏎️"
        },
        {
            id: 3,
            name: "Toyota Highlander",
            model: "2023 - SUV",
            price: 85,
            transmission: "Automatic",
            passengers: "7",
            fuel: "Hybrid",
            emoji: "🚙"
        },
        {
            id: 4,
            name: "BMW 320i",
            model: "2023 - Premium",
            price: 120,
            transmission: "Automatic",
            passengers: "5",
            fuel: "Petrol",
            emoji: "🏎️"
        },
        {
            id: 5,
            name: "Mercedes-Benz C-Class",
            model: "2023 - Luxury",
            price: 150,
            transmission: "Automatic",
            passengers: "5",
            fuel: "Diesel",
            emoji: "👑"
        },
        {
            id: 6,
            name: "Mazda CX-5",
            model: "2023 - Compact SUV",
            price: 70,
            transmission: "Automatic",
            passengers: "5",
            fuel: "Petrol",
            emoji: "🚕"
        }
    ];
}

// Setup car form
function setupCarForm() {
    const form = document.getElementById('carForm');
    if (form) {
        form.addEventListener('submit', saveCar);
    }
    
    // Setup image preview
    const imageInput = document.getElementById('carImage');
    if (imageInput) {
        imageInput.addEventListener('change', previewImage);
    }
}

// Preview image
function previewImage(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.innerHTML = `<img src="${event.target.result}" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">`;
            document.getElementById('carForm').dataset.imageData = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
        document.getElementById('carForm').dataset.imageData = '';
    }
}

// Open add car modal
function openAddCarModal() {
    document.getElementById('modalTitle').textContent = 'Add New Car';
    document.getElementById('carForm').reset();
    document.getElementById('carForm').dataset.editIndex = '';
    document.getElementById('carForm').dataset.imageData = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('carModal').style.display = 'block';
}

// Close car modal
function closeCarModal() {
    document.getElementById('carModal').style.display = 'none';
}

// Edit car
function editCar(index) {
    const cars = JSON.parse(localStorage.getItem('zubae_cars')) || getDefaultCars();
    const car = cars[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Car';
    document.getElementById('carName').value = car.name;
    document.getElementById('carModel').value = car.model;
    document.getElementById('carPrice').value = car.price;
    document.getElementById('carTransmission').value = car.transmission;
    document.getElementById('carPassengers').value = car.passengers;
    document.getElementById('carFuel').value = car.fuel;
    document.getElementById('carEmoji').value = car.emoji;
    document.getElementById('carForm').dataset.editIndex = index;
    
    // Show existing image if available
    const preview = document.getElementById('imagePreview');
    if (car.image) {
        preview.innerHTML = `<img src="${car.image}" style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;">`;
        document.getElementById('carForm').dataset.imageData = car.image;
    } else {
        preview.innerHTML = '';
        document.getElementById('carForm').dataset.imageData = '';
    }
    
    document.getElementById('carImage').value = '';
    document.getElementById('carModal').style.display = 'block';
}

// Save car
function saveCar(e) {
    e.preventDefault();
    
    const cars = JSON.parse(localStorage.getItem('zubae_cars')) || getDefaultCars();
    const editIndex = document.getElementById('carForm').dataset.editIndex;
    const imageData = document.getElementById('carForm').dataset.imageData;
    
    const newCar = {
        id: editIndex ? cars[editIndex].id : Date.now(),
        name: document.getElementById('carName').value,
        model: document.getElementById('carModel').value,
        price: parseInt(document.getElementById('carPrice').value),
        transmission: document.getElementById('carTransmission').value,
        passengers: document.getElementById('carPassengers').value,
        fuel: document.getElementById('carFuel').value,
        emoji: document.getElementById('carEmoji').value || '🚗',
        image: imageData || (editIndex !== '' && cars[editIndex].image ? cars[editIndex].image : null)
    };
    
    if (editIndex !== '') {
        cars[editIndex] = newCar;
    } else {
        cars.push(newCar);
    }
    
    localStorage.setItem('zubae_cars', JSON.stringify(cars));
    closeCarModal();
    loadCars();
    alert('✅ Car saved successfully!');
}

// Delete car
function deleteCar(index) {
    if (confirm('Are you sure you want to delete this car?')) {
        const cars = JSON.parse(localStorage.getItem('zubae_cars')) || getDefaultCars();
        cars.splice(index, 1);
        localStorage.setItem('zubae_cars', JSON.stringify(cars));
        loadCars();
        alert('✅ Car deleted successfully!');
    }
}

// Load inquiries
function loadInquiries() {
    const inquiries = JSON.parse(localStorage.getItem('zubae_inquiries')) || [];
    const inquiriesList = document.getElementById('inquiriesList');
    
    document.getElementById('totalInquiries').textContent = inquiries.length;
    
    if (inquiries.length === 0) {
        inquiriesList.innerHTML = '<p class="empty-state">No inquiries yet. Customers will appear here when they contact you.</p>';
        return;
    }
    
    const html = inquiries.map((inquiry, index) => `
        <div class="inquiry-card">
            <h4>🚗 ${inquiry.carName}</h4>
            <div class="inquiry-info">
                <strong>📅 Date:</strong> ${new Date(inquiry.timestamp).toLocaleString()}
            </div>
            <div class="inquiry-info">
                <strong>📞 Contact them:</strong>
                <br>
                <a href="https://wa.me/message/32JFCSOBEFQYF1" target="_blank" class="btn btn-secondary" style="margin-top: 0.5rem;">
                    💬 Reply on WhatsApp
                </a>
            </div>
            <div class="inquiry-buttons">
                <button class="btn-delete" onclick="deleteInquiry(${index})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
    
    inquiriesList.innerHTML = html;
}

// Delete inquiry
function deleteInquiry(index) {
    if (confirm('Delete this inquiry?')) {
        const inquiries = JSON.parse(localStorage.getItem('zubae_inquiries')) || [];
        inquiries.splice(index, 1);
        localStorage.setItem('zubae_inquiries', JSON.stringify(inquiries));
        loadInquiries();
    }
}

// Load and display all customers
function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('zubae_users')) || [];
    const inquiries = JSON.parse(localStorage.getItem('zubae_inquiries')) || [];
    const customersList = document.getElementById('customersList');
    
    if (customers.length === 0) {
        customersList.innerHTML = '<p class="empty-state">No customers yet. Registered customers will appear here.</p>';
        return;
    }
    
    const table = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th>Rental Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${customers.map((customer, index) => {
                    const registeredDate = new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const customerRentals = inquiries.filter(i => i.customerEmail === customer.email);
                    const rentalStatus = customerRentals.length > 0 
                        ? `✅ Rented (${customerRentals.length}x) - Latest: ${new Date(customerRentals[customerRentals.length - 1].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                        : '⏳ No rentals yet';
                    
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${customer.name}</strong></td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${registeredDate}</td>
                            <td>${rentalStatus}</td>
                            <td>
                                <button class="btn-delete" onclick="deleteCustomer(${index})">🗑️ Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    customersList.innerHTML = table;
}

// Delete customer
function deleteCustomer(index) {
    if (confirm('Delete this customer? This cannot be undone.')) {
        const customers = JSON.parse(localStorage.getItem('zubae_users')) || [];
        customers.splice(index, 1);
        localStorage.setItem('zubae_users', JSON.stringify(customers));
        loadCustomers();
        updateStats();
    }
}

// Load settings
function loadSettings() {
    document.getElementById('phone1').value = '055-2174569';
    document.getElementById('phone2').value = '053-537854';
    document.getElementById('whatsappLink').value = 'https://wa.me/message/32JFCSOBEFQYF1';
}

// Change password
function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    if (newPassword && newPassword.length >= 6) {
        // Store in localStorage - in production use backend
        localStorage.setItem('zubae_adminPassword', newPassword);
        alert('✅ Password changed successfully!');
        document.getElementById('newPassword').value = '';
    } else {
        alert('❌ Password must be at least 6 characters');
    }
}

// Backup data
function backupData() {
    const cars = JSON.parse(localStorage.getItem('zubae_cars')) || getDefaultCars();
    const inquiries = JSON.parse(localStorage.getItem('zubae_inquiries')) || [];
    
    const backup = {
        timestamp: new Date().toISOString(),
        cars: cars,
        inquiries: inquiries
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZubaeAutos-Backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Restore data
function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            localStorage.setItem('zubae_cars', JSON.stringify(backup.cars));
            localStorage.setItem('zubae_inquiries', JSON.stringify(backup.inquiries));
            alert('✅ Data restored successfully!');
            loadCars();
            loadInquiries();
        } catch (error) {
            alert('❌ Invalid backup file');
        }
    };
    reader.readAsText(file);
}

// Update stats
function updateStats() {
    const cars = JSON.parse(localStorage.getItem('zubae_cars')) || getDefaultCars();
    const customers = JSON.parse(localStorage.getItem('zubae_users')) || [];
    const inquiries = JSON.parse(localStorage.getItem('zubae_inquiries')) || [];
    
    document.getElementById('totalCars').textContent = cars.length;
    document.getElementById('totalCustomers').textContent = customers.length;
    document.getElementById('totalInquiries').textContent = inquiries.length;
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('carModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

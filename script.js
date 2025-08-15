// Global student data array
let students = [];
let originalStudents = [];

// Function to show specific section
function showSection(section) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });
    
    const targetSection = document.getElementById(section + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active', 'text-blue-600', 'bg-blue-50'));
    navLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes(section)) {
            link.classList.add('active', 'text-blue-600', 'bg-blue-50');
        }
    });
}

// Function to fetch students from dummyjson.com
async function fetchStudents() {
    try {
        const response = await fetch('https://dummyjson.com/users?limit=20');
        const data = await response.json();
        
        // Transform user data to student format
        students = data.users.map((user, index) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            course: getRandomCourse(),
            status: Math.random() > 0.3 ? 'Active' : 'Inactive'
        }));
        
        originalStudents = [...students];
        updateStudentCount();
        renderStudents();
    } catch (error) {
        console.error('Error fetching students:', error);
        // Fallback to sample data if API fails
        loadSampleData();
    }
}

// Function to get random course
function getRandomCourse() {
    const courses = [
        'Computer Science', 'Business Administration', 'Engineering', 
        'Arts & Design', 'Medicine', 'Law', 'Education', 
        'Mathematics', 'Physics', 'Chemistry'
    ];
    return courses[Math.floor(Math.random() * courses.length)];
}

// Function to load sample data
function loadSampleData() {
    students = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1-555-0101', course: 'Computer Science', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1-555-0102', course: 'Business Administration', status: 'Active' },
        { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '+1-555-0103', course: 'Engineering', status: 'Inactive' },
        { id: 4, name: 'Sarah Williams', email: 'sarah.williams@example.com', phone: '+1-555-0104', course: 'Arts & Design', status: 'Active' },
        { id: 5, name: 'David Brown', email: 'david.brown@example.com', phone: '+1-555-0105', course: 'Medicine', status: 'Active' }
    ];
    originalStudents = [...students];
    updateStudentCount();
    renderStudents();
}

// Function to add a student
function addStudent(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const course = document.getElementById('course').value;
    const status = document.getElementById('status').value;

    const student = {
        id: Math.max(...students.map(s => s.id), 0) + 1,
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        course: course,
        status: status
    };

    students.push(student);
    originalStudents = [...students];
    document.getElementById('student-form').reset();
    updateStudentCount();
    renderStudents();
    showSection('students');
    
    // Show success message
    showNotification('Student added successfully!', 'success');
}

// Function to update student counts
function updateStudentCount() {
    const totalStudents = students.length;
    const activeStudents = students.filter(student => student.status === 'Active').length;
    const inactiveStudents = students.filter(student => student.status === 'Inactive').length;
    
    document.getElementById('total-students').innerText = totalStudents;
    document.getElementById('active-students').innerText = activeStudents;
    document.getElementById('inactive-students').innerText = inactiveStudents;
}

// Function to toggle student status
function toggleStatus(id) {
    const studentIndex = students.findIndex(student => student.id === id);
    if (studentIndex !== -1) {
        students[studentIndex].status = students[studentIndex].status === 'Active' ? 'Inactive' : 'Active';
        originalStudents = [...students];
        updateStudentCount();
        renderStudents();
    }
}

// Function to delete a student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== id);
        originalStudents = [...students];
        updateStudentCount();
        renderStudents();
        showNotification('Student deleted successfully!', 'success');
    }
}

// Function to render students in the table
function renderStudents() {
    const tableBody = document.getElementById('students-table-body');
    tableBody.innerHTML = '';
    
    if (students.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <i class="fas fa-users text-4xl mb-4 text-gray-300"></i>
                    <p class="text-lg">No students found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        const statusColor = student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const toggleIcon = student.status === 'Active' ? 'fa-toggle-on text-green-600' : 'fa-toggle-off text-gray-400';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${student.course}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="toggleStatus(${student.id})" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}">
                    <i class="fas ${toggleIcon} mr-1"></i>
                    ${student.status}
                </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-red-600 hover:text-red-800 mr-3" onclick="deleteStudent(${student.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to filter students
function filterStudents() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    
    if (searchInput === '') {
        students = [...originalStudents];
    } else {
        students = originalStudents.filter(student => 
            student.name.toLowerCase().includes(searchInput) ||
            student.email.toLowerCase().includes(searchInput) ||
            student.course.toLowerCase().includes(searchInput)
        );
    }
    
    renderStudents();
}

// Function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Fetch students from API
    fetchStudents();
});

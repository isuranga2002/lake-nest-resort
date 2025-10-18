// Admin Panel Configuration
const ADMIN_PASSWORD = "LakeNest@2025!Resort#Secure"; // Change this before deployment!

// GitHub Configuration - ADD YOUR TOKEN HERE
const GITHUB_TOKEN = "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"; // Paste your GitHub Personal Access Token here
const GITHUB_USERNAME = "isuranga2002";
const GITHUB_REPO = "lake-nest-resort";
const GITHUB_BRANCH = "main";

// Check if user is logged in
let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Admin form
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', handleSave);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function checkLoginStatus() {
    // Check session storage for login status
    const loggedIn = sessionStorage.getItem('adminLoggedIn');
    if (loggedIn === 'true') {
        showAdminPanel();
        loadConfigData();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        isLoggedIn = true;
        showMessage('login-message', 'Login successful!', 'success');
        
        setTimeout(() => {
            showAdminPanel();
            loadConfigData();
        }, 500);
    } else {
        showMessage('login-message', 'Invalid password. Please try again.', 'error');
    }
}

function showAdminPanel() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'block';
}

function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    isLoggedIn = false;
    document.getElementById('admin-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('login-form').reset();
    showMessage('login-message', 'Logged out successfully.', 'success');
}

async function loadConfigData() {
    try {
        // Add timestamp to prevent caching
        const response = await fetch('config.json?t=' + new Date().getTime());
        const config = await response.json();
        
        // Populate form fields
        document.getElementById('villaName').value = config.villaName || '';
        document.getElementById('description').value = config.description || '';
        document.getElementById('phone1').value = config.phone1 || '';
        document.getElementById('phone2').value = config.phone2 || '';
        document.getElementById('email').value = config.email || '';
        document.getElementById('address').value = config.address || '';
        document.getElementById('facebook').value = config.facebook || '';
        document.getElementById('whatsapp').value = config.whatsapp || '';
        document.getElementById('googleMap').value = config.googleMap || '';
        document.getElementById('numberOfRooms').value = config.numberOfRooms || '3';
        document.getElementById('roomCapacity').value = config.roomCapacity || '3 persons per room';
        document.getElementById('package6h').value = config.package6h || '';
        document.getElementById('package12h').value = config.package12h || '';
        document.getElementById('package24h').value = config.package24h || '';
        document.getElementById('facebookPixel').value = config.facebookPixel || '';
        document.getElementById('googleAds').value = config.googleAds || '';
        
    } catch (error) {
        console.error('Error loading config:', error);
        showMessage('admin-message', 'Error loading configuration data.', 'error');
    }
}

async function handleSave(e) {
    e.preventDefault();
    
    // Check if GitHub token is configured
    if (!GITHUB_TOKEN || GITHUB_TOKEN.trim() === '') {
        showMessage('admin-message', 'ERROR: GitHub token not configured! Please add your token at the top of admin.js file.', 'error');
        return;
    }
    
    // Collect form data
    const formData = {
        villaName: document.getElementById('villaName').value,
        description: document.getElementById('description').value,
        phone1: document.getElementById('phone1').value,
        phone2: document.getElementById('phone2').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        facebook: document.getElementById('facebook').value,
        whatsapp: document.getElementById('whatsapp').value,
        googleMap: document.getElementById('googleMap').value,
        numberOfRooms: document.getElementById('numberOfRooms').value,
        roomCapacity: document.getElementById('roomCapacity').value,
        package6h: document.getElementById('package6h').value,
        package12h: document.getElementById('package12h').value,
        package24h: document.getElementById('package24h').value,
        facebookPixel: document.getElementById('facebookPixel').value,
        googleAds: document.getElementById('googleAds').value
    };
    
    // Convert to JSON
    const configJSON = JSON.stringify(formData, null, 2);
    
    // Show saving message
    showMessage('admin-message', '⏳ Saving changes to GitHub... Please wait.', 'success');
    
    // Try to save to GitHub
    try {
        await saveToGitHub(configJSON);
        showMessage('admin-message', '✅ SUCCESS! Changes saved to GitHub. Your website will update automatically in 30-60 seconds. Refresh your website to see changes.', 'success');
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        showMessage('admin-message', '❌ ERROR: ' + error.message + ' - Please check your GitHub token and try again.', 'error');
    }
}

async function saveToGitHub(content) {
    try {
        // Step 1: Get current file SHA
        const getUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/config.json`;
        
        console.log('Fetching current file...');
        const getResponse = await fetch(getUrl, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!getResponse.ok) {
            const errorData = await getResponse.json();
            throw new Error(`Failed to fetch current file: ${errorData.message || getResponse.statusText}`);
        }
        
        const currentFile = await getResponse.json();
        const sha = currentFile.sha;
        
        console.log('Current SHA:', sha);
        
        // Step 2: Update the file
        const updateUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/config.json`;
        const updateData = {
            message: 'Updated config.json from Admin Panel - ' + new Date().toLocaleString(),
            content: btoa(unescape(encodeURIComponent(content))), // Base64 encode with UTF-8 support
            sha: sha,
            branch: GITHUB_BRANCH
        };
        
        console.log('Updating file...');
        const updateResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            
            // Check for specific errors
            if (errorData.message && errorData.message.includes('Bad credentials')) {
                throw new Error('Invalid GitHub token. Please check your token and make sure it has "repo" permissions.');
            } else if (errorData.message && errorData.message.includes('Not Found')) {
                throw new Error('Repository not found. Please check GITHUB_USERNAME and GITHUB_REPO in admin.js');
            } else {
                throw new Error(errorData.message || 'Failed to update GitHub repository');
            }
        }
        
        const result = await updateResponse.json();
        console.log('Update successful:', result);
        
        return result;
        
    } catch (error) {
        console.error('GitHub API Error:', error);
        throw error;
    }
}

function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 10 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 10000);
    }
}

// Auto-save draft to local storage (optional feature)
function saveDraft() {
    if (!isLoggedIn) return;
    
    const formData = {
        villaName: document.getElementById('villaName').value,
        description: document.getElementById('description').value,
        phone1: document.getElementById('phone1').value,
        phone2: document.getElementById('phone2').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        facebook: document.getElementById('facebook').value,
        whatsapp: document.getElementById('whatsapp').value,
        googleMap: document.getElementById('googleMap').value,
        numberOfRooms: document.getElementById('numberOfRooms').value,
        roomCapacity: document.getElementById('roomCapacity').value,
        package6h: document.getElementById('package6h').value,
        package12h: document.getElementById('package12h').value,
        package24h: document.getElementById('package24h').value,
        facebookPixel: document.getElementById('facebookPixel').value,
        googleAds: document.getElementById('googleAds').value
    };
    
    localStorage.setItem('adminDraft', JSON.stringify(formData));
    console.log('Draft auto-saved');
}

// Auto-save every 30 seconds
setInterval(() => {
    if (isLoggedIn) {
        saveDraft();
    }
}, 30000);

// Admin Panel Configuration
const ADMIN_PASSWORD = "Admin@12345"; // Change this before deployment!

// GitHub Configuration - IMPORTANT: Add your token here locally (DO NOT commit to public repo)
const GITHUB_TOKEN = "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"; // Paste your GitHub token here (keep private!)
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
    const messageDiv = document.getElementById('login-message');
    
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
        const response = await fetch('config.json');
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
        document.getElementById('package6h').value = config.package6h || '';
        document.getElementById('package12h').value = config.package12h || '';
        document.getElementById('package24h').value = config.package24h || '';
        document.getElementById('numberOfRooms').value = config.numberOfRooms || '3';
        document.getElementById('roomCapacity').value = config.roomCapacity || '3 persons per room';
        document.getElementById('exchangeRate').value = config.exchangeRate || '303';
        document.getElementById('facebookPixel').value = config.facebookPixel || '';
        document.getElementById('googleAds').value = config.googleAds || '';
        
    } catch (error) {
        console.error('Error loading config:', error);
        showMessage('admin-message', 'Error loading configuration data.', 'error');
    }
}

async function handleSave(e) {
    e.preventDefault();
    
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
        package6h: document.getElementById('package6h').value,
        package12h: document.getElementById('package12h').value,
        package24h: document.getElementById('package24h').value,
        numberOfRooms: document.getElementById('numberOfRooms').value,
        roomCapacity: document.getElementById('roomCapacity').value,
        exchangeRate: document.getElementById('exchangeRate').value,
        facebookPixel: document.getElementById('facebookPixel').value,
        googleAds: document.getElementById('googleAds').value
    };
    
    // Convert to JSON
    const configJSON = JSON.stringify(formData, null, 2);
    
    // Check if GitHub token is configured
    if (!GITHUB_TOKEN || GITHUB_TOKEN.trim() === '') {
        // Fallback: Download config.json locally
        showMessage('admin-message', 'GitHub token not configured. Downloading config.json file instead. Please upload it to your repository manually.', 'error');
        downloadConfigFile(configJSON);
        return;
    }
    
    // Try to save to GitHub
    try {
        showMessage('admin-message', 'Saving changes to GitHub...', 'success');
        await saveToGitHub(configJSON);
        showMessage('admin-message', 'Changes saved successfully! Your website will update in 30-60 seconds.', 'success');
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        showMessage('admin-message', 'Error saving to GitHub: ' + error.message + '. Downloading config.json instead.', 'error');
        downloadConfigFile(configJSON);
    }
}

async function saveToGitHub(content) {
    // Get current file SHA
    const getUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/config.json`;
    
    let sha = null;
    try {
        const getResponse = await fetch(getUrl, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (getResponse.ok) {
            const data = await getResponse.json();
            sha = data.sha;
        }
    } catch (error) {
        console.log('File might not exist yet, will create new file');
    }
    
    // Prepare update request
    const updateUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/config.json`;
    const updateData = {
        message: 'Updated config.json from Admin Panel',
        content: btoa(unescape(encodeURIComponent(content))), // Base64 encode with UTF-8 support
        branch: GITHUB_BRANCH
    };
    
    if (sha) {
        updateData.sha = sha;
    }
    
    const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    
    if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update GitHub repository');
    }
    
    return await updateResponse.json();
}

function downloadConfigFile(content) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showMessage('admin-message', 'config.json downloaded! Please upload it to your GitHub repository to update the website.', 'success');
}

function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Auto-save draft to local storage (optional feature)
function saveDraft() {
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
        package6h: document.getElementById('package6h').value,
        package12h: document.getElementById('package12h').value,
        package24h: document.getElementById('package24h').value,
        numberOfRooms: document.getElementById('numberOfRooms').value,
        roomCapacity: document.getElementById('roomCapacity').value,
        exchangeRate: document.getElementById('exchangeRate').value,
        facebookPixel: document.getElementById('facebookPixel').value,
        googleAds: document.getElementById('googleAds').value
    };
    
    localStorage.setItem('adminDraft', JSON.stringify(formData));
}

// Load draft from local storage
function loadDraft() {
    const draft = localStorage.getItem('adminDraft');
    if (draft) {
        const formData = JSON.parse(draft);
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = formData[key];
            }
        });
    }
}

// Auto-save every 30 seconds
setInterval(() => {
    if (isLoggedIn) {
        saveDraft();
    }
}, 30000);

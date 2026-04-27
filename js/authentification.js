const signupModal = document.getElementById('signupModal');
const loginModal = document.getElementById('loginModal');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const signupMessage = document.getElementById('signupMessage');
const loginMessage = document.getElementById('loginMessage');
const userDisplay = document.getElementById('userDisplay');
const loginLink = document.querySelector('.auth-link[onclick="openLoginModal()"]');
const signupLink = document.querySelector('.auth-link[onclick="openSignupModal()"]');
const logoutLink = document.querySelector('.auth-link.logout');

function getStoredUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}

function setStoredUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getLoggedInUser() {
    return localStorage.getItem('loggedInUser');
}

function setLoggedInUser(username) {
    if (username) {
        localStorage.setItem('loggedInUser', username);
    } else {
        localStorage.removeItem('loggedInUser');
    }
}

function updateAuthUI() {
    const username = getLoggedInUser();
    if (username) {
        userDisplay.textContent = `Connecté en tant que ${username}`;
        logoutLink.style.display = 'inline-block';
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
    } else {
        userDisplay.textContent = 'Aucun utilisateur connecté';
        logoutLink.style.display = 'none';
        loginLink.style.display = 'inline-block';
        signupLink.style.display = 'inline-block';
    }
}

function openSignupModal() {
    signupMessage.textContent = '';
    signupForm.reset();
    signupModal.style.display = 'block';
}

function closeSignupModal() {
    signupModal.style.display = 'none';
}

function openLoginModal() {
    loginMessage.textContent = '';
    loginForm.reset();
    loginModal.style.display = 'block';
}

function closeLoginModal() {
    loginModal.style.display = 'none';
}

function logout() {
    setLoggedInUser(null);
    updateAuthUI();
    if (signupModal.style.display === 'block') closeSignupModal();
    if (loginModal.style.display === 'block') closeLoginModal();
}

signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!username || !email || !password || !confirmPassword) {
        signupMessage.textContent = 'Tous les champs sont requis.';
        return;
    }

    if (password !== confirmPassword) {
        signupMessage.textContent = 'Les mots de passe ne correspondent pas.';
        return;
    }

    const users = getStoredUsers();
    if (users[username]) {
        signupMessage.textContent = 'Ce nom d’utilisateur existe déjà.';
        return;
    }

    users[username] = { email, password };
    setStoredUsers(users);
    setLoggedInUser(username);
    signupMessage.textContent = 'Compte créé avec succès ! Vous êtes connecté.';
    updateAuthUI();

    setTimeout(() => {
        closeSignupModal();
    }, 800);
});

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        loginMessage.textContent = 'Veuillez saisir nom d’utilisateur et mot de passe.';
        return;
    }

    const users = getStoredUsers();
    if (!users[username] || users[username].password !== password) {
        loginMessage.textContent = 'Nom d’utilisateur ou mot de passe invalide.';
        return;
    }

    setLoggedInUser(username);
    loginMessage.textContent = 'Connexion réussie !';
    updateAuthUI();

    setTimeout(() => {
        closeLoginModal();
    }, 500);
});

window.onclick = function (event) {
    if (event.target === signupModal) {
        closeSignupModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
};

window.openSignupModal = openSignupModal;
window.closeSignupModal = closeSignupModal;
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.logout = logout;

updateAuthUI();
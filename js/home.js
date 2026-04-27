import {
clearSession,
findUser,
getSession,
getUsers,
normalize,
setSession,
setUsers,
} from "./home-storage.js";
import { initTabs, renderSession } from "./home-session.js";

document.addEventListener("DOMContentLoaded", () => {
const tabButtons = [...document.querySelectorAll("[data-tab-target]")];
const forms = [...document.querySelectorAll(".auth-form")];
const feedback = document.querySelector("[data-auth-message]");
const logoutButton = document.querySelector("[data-logout-button]");
const sessionStatus = document.querySelector("[data-session-status]");
const sessionDate = document.querySelector("[data-session-date]");
const sessionProfile = document.querySelector("[data-session-profile]");

if (!feedback || !logoutButton || !sessionStatus || !sessionDate || !sessionProfile) {
return;
}

initTabs(tabButtons, forms, feedback);
renderSession({ status: sessionStatus, date: sessionDate, profile: sessionProfile }, logoutButton);

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

registerForm?.addEventListener("submit", (event) => {
event.preventDefault();
const formData = new FormData(registerForm);
const username = normalize(formData.get("username"));
const email = normalize(formData.get("email"));
const password = String(formData.get("password") || "");
const confirmPassword = String(formData.get("confirmPassword") || "");

if (username.length < 3) {
feedback.textContent = "Le pseudo doit contenir au moins 3 caractères.";
return;
}

if (!email.includes("@") || !email.includes(".")) {
feedback.textContent = "L'e-mail doit être valide.";
return;
}

if (password.length < 6) {
feedback.textContent = "Le mot de passe doit faire au moins 6 caractères.";
return;
}

if (password !== confirmPassword) {
feedback.textContent = "Les mots de passe ne correspondent pas.";
return;
}

const users = getUsers();
if (users.some((user) => normalize(user.username) === username || normalize(user.email) === email)) {
feedback.textContent = "Ce pseudo ou cet e-mail existe déjà.";
return;
}

const now = Date.now();
const user = {
id: `user-${now}-${Math.random().toString(16).slice(2, 8)}`,
username,
email,
password,
createdAt: now,
lastLoginAt: now,
progress: {
level: 1,
checkpoint: 0,
},
};

users.push(user);
setUsers(users);
setSession({ userId: user.id });
feedback.textContent = `Compte créé : ${user.username}. Tu peux lancer le jeu ou te reconnecter plus tard.`;
renderSession({ status: sessionStatus, date: sessionDate, profile: sessionProfile }, logoutButton);
registerForm.reset();
});

loginForm?.addEventListener("submit", (event) => {
event.preventDefault();
const formData = new FormData(loginForm);
const identifier = String(formData.get("identifier") || "");
const password = String(formData.get("password") || "");
const users = getUsers();
const user = findUser(users, identifier);

if (!user || user.password !== password) {
feedback.textContent = "Identifiants invalides.";
return;
}

user.lastLoginAt = Date.now();
setUsers(users);
setSession({ userId: user.id });
feedback.textContent = `Bienvenue ${user.username}.`;
renderSession({ status: sessionStatus, date: sessionDate, profile: sessionProfile }, logoutButton);
loginForm.reset();
});

logoutButton.addEventListener("click", () => {
clearSession();
feedback.textContent = "Session fermée.";
renderSession({ status: sessionStatus, date: sessionDate, profile: sessionProfile }, logoutButton);
});

const session = getSession();
if (session) {
const users = getUsers();
const currentUser = users.find((user) => user.id === session.userId);
if (currentUser) {
feedback.textContent = `Session active pour ${currentUser.username}.`;
}
}
});

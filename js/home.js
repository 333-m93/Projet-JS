const STORAGE_USERS = "prison-escape-users";
const STORAGE_SESSION = "prison-escape-session";

function readJson(key, fallback) {
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

function writeJson(key, value) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

function normalize(value) {
	return String(value || "").trim().toLowerCase();
}

function formatDate(timestamp) {
	if (!timestamp) {
		return "--";
	}

	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(timestamp));
}

function getUsers() {
	return readJson(STORAGE_USERS, []);
}

function setUsers(users) {
	writeJson(STORAGE_USERS, users);
}

function getSession() {
	return readJson(STORAGE_SESSION, null);
}

function setSession(session) {
	writeJson(STORAGE_SESSION, session);
}

function clearSession() {
	window.localStorage.removeItem(STORAGE_SESSION);
}

function findUser(users, identifier) {
	const target = normalize(identifier);
	return users.find((user) => normalize(user.username) === target || normalize(user.email) === target);
}

function initTabs(tabButtons, forms, feedback) {
	function setActive(targetFormId) {
		for (const button of tabButtons) {
			button.classList.toggle("is-active", button.dataset.tabTarget === targetFormId);
		}

		for (const form of forms) {
			form.classList.toggle("is-hidden", form.id !== targetFormId);
		}

		feedback.textContent = targetFormId === "register-form"
			? "Creer un compte local pour preparer la suite avec la base de donnees."
			: "Connecte-toi avec ton pseudo ou ton email.";
	}

	for (const button of tabButtons) {
		button.addEventListener("click", () => setActive(button.dataset.tabTarget));
	}

	setActive("register-form");
}

function renderSession(summaryNodes, logoutButton) {
	const users = getUsers();
	const session = getSession();
	const currentUser = session ? users.find((user) => user.id === session.userId) : null;

	if (!currentUser) {
		summaryNodes.status.textContent = "Invite";
		summaryNodes.date.textContent = "--";
		summaryNodes.profile.textContent = "Non connecte";
		logoutButton.disabled = true;
		logoutButton.textContent = "Deconnexion";
		return;
	}

	summaryNodes.status.textContent = "Connecte";
	summaryNodes.date.textContent = formatDate(currentUser.lastLoginAt || currentUser.createdAt);
	summaryNodes.profile.textContent = `${currentUser.username} (${currentUser.email})`;
	logoutButton.disabled = false;
	logoutButton.textContent = "Deconnexion";
}

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
			feedback.textContent = "Le pseudo doit contenir au moins 3 caracteres.";
			return;
		}

		if (!email.includes("@") || !email.includes(".")) {
			feedback.textContent = "L'email doit etre valide.";
			return;
		}

		if (password.length < 6) {
			feedback.textContent = "Le mot de passe doit faire au moins 6 caracteres.";
			return;
		}

		if (password !== confirmPassword) {
			feedback.textContent = "Les mots de passe ne correspondent pas.";
			return;
		}

		const users = getUsers();
		if (users.some((user) => normalize(user.username) === username || normalize(user.email) === email)) {
			feedback.textContent = "Ce pseudo ou cet email existe deja.";
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
		feedback.textContent = `Compte cree: ${user.username}. Tu peux lancer le jeu ou te reconnecter plus tard.`;
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
		feedback.textContent = "Session fermee.";
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
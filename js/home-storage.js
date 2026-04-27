const STORAGE_USERS = "prison-escape-users";
const STORAGE_SESSION = "prison-escape-session";

export function readJson(key, fallback) {
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

export function writeJson(key, value) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

export function normalize(value) {
	return String(value || "").trim().toLowerCase();
}

export function formatDate(timestamp) {
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

export function getUsers() {
	return readJson(STORAGE_USERS, []);
}

export function setUsers(users) {
	writeJson(STORAGE_USERS, users);
}

export function getSession() {
	return readJson(STORAGE_SESSION, null);
}

export function setSession(session) {
	writeJson(STORAGE_SESSION, session);
}

export function clearSession() {
	window.localStorage.removeItem(STORAGE_SESSION);
}

export function findUser(users, identifier) {
	const target = normalize(identifier);
	return users.find((user) => normalize(user.username) === target || normalize(user.email) === target);
}

import { formatDate, getSession, getUsers } from "./home-storage.js";

export function initTabs(tabButtons, forms, feedback) {
	function setActive(targetFormId) {
		for (const button of tabButtons) {
			button.classList.toggle("is-active", button.dataset.tabTarget === targetFormId);
		}

		for (const form of forms) {
			form.classList.toggle("is-hidden", form.id !== targetFormId);
		}

		feedback.textContent = targetFormId === "register-form"
			? "Créer un compte local pour préparer la suite avec la base de données."
			: "Connecte-toi avec ton pseudo ou ton e-mail.";
	}

	for (const button of tabButtons) {
		button.addEventListener("click", () => setActive(button.dataset.tabTarget));
	}

	setActive("register-form");
}

export function renderSession(summaryNodes, logoutButton) {
	const users = getUsers();
	const session = getSession();
	const currentUser = session ? users.find((user) => user.id === session.userId) : null;

	if (!currentUser) {
		summaryNodes.status.textContent = "Invité";
		summaryNodes.date.textContent = "--";
		summaryNodes.profile.textContent = "Non connecté";
		logoutButton.disabled = true;
		logoutButton.textContent = "Déconnexion";
		return;
	}

	summaryNodes.status.textContent = "Connecté";
	summaryNodes.date.textContent = formatDate(currentUser.lastLoginAt || currentUser.createdAt);
	summaryNodes.profile.textContent = `${currentUser.username} (${currentUser.email})`;
	logoutButton.disabled = false;
	logoutButton.textContent = "Déconnexion";
}

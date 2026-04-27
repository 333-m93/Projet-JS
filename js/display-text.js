export function withSentenceCase(text) {
	const value = String(text || "").trim();
	if (!value) {
		return "";
	}
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function setupControls(keys) {
	window.addEventListener("keydown", (event) => {
		if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
			event.preventDefault();
			keys.add(event.key);
		}
	});

	window.addEventListener("keyup", (event) => {
		keys.delete(event.key);
	});
}

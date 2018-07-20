/* https://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345 */

var gamepads = {};

function gamepadHandler(event, connecting) {
	var gamepad = event.gamepad;
	// Note:
	// gamepad === navigator.getGamepads()[gamepad.index]

	if (connecting) {
		gamepads[gamepad.index] = gamepad;
	} else {
		delete gamepads[gamepad.index];
	}
}

window.addEventListener(
	"gamepadconnected",
	function(e) {
		gamepadHandler(e, true);
	},
	false
);
window.addEventListener(
	"gamepaddisconnected",
	function(e) {
		gamepadHandler(e, false);
	},
	false
);

//====

window.addEventListener("gamepadconnected", function(e) {
	let gamepads = navigator.getGamepads();
	let gp = event.gamepad;

	console.log(
		"Gamepad connected at index " +
			gp.index +
			": " +
			gp.id +
			". It has " +
			gp.buttons.length +
			" buttons and " +
			gp.axes.length +
			" axes."
	);
});

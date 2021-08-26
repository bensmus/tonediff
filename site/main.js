var start_button = document.getElementById("start_button")

var tone = Number(document.getElementById("tone_input").value);
var diff = Number(document.getElementById("diff_input").value);
var decrement = Number(document.getElementById("decrement_input").value);
var state = document.getElementById("state");

var state_first = "playing first note...";
var state_second = "playing second note...";
var state_wait = "please press up/down keys, enter, or esc...";
var state_correct = "correct.";
var state_wrong = "wrong.";

var keyCode = "";  // Holds last pressed key
window.onkeydown = function (keyEvent) {
	keyCode = keyEvent.code;
}

var validKeyCodes = new Set(["ArrowDown", "ArrowUp", "Enter", "Escape"]);
var arrowKeyCodes = new Set(["ArrowDown", "ArrowUp"]);

function startButtonDisable() {
	console.log("Disabling start button.")
	start_button.removeEventListener("click", gameLoop);
	start_button.classList.add("disabled");
	start_button.classList.remove("enabled");
}

function startButtonEnable() {
	console.log("Enabling start button.")
	start_button.addEventListener("click", gameLoop);
	start_button.classList.remove("disabled");
	start_button.classList.add("enabled");
}

let gameLoop = async function () {
	startButtonDisable();

	// while (tone_diff > 0) {


	// 	let descending = Math.round(Math.random());
	// 	if (descending) {
	// 		let temp = first;
	// 		first = second;
	// 		second = temp;
	// 	}

	// recursive function because this is actually simpler than a loop
	await oneCycle(tone, diff);
	startButtonEnable();
	state.innerHTML = "";
}

startButtonEnable();

async function oneCycle(tone, diff) {
	console.log(diff);
	state.innerHTML = state_first;
	await playSine(tone);
	state.innerHTML = state_second;
	await playSine(tone + diff);

	// ????
	state.innerHTML = state_wait;
	await validKey();
	if (keyCode == "Enter") {
		await oneCycle(tone, diff);
	}
	let repeatLater = false;

	if (arrowKeyCodes.has(keyCode)) {
		if (diff > decrement) {
			repeatLater = true;
		}
		if (keyCode == "ArrowDown") {
			console.log("ArrowDown was pressed.");
		}
		if (keyCode == "ArrowUp") {
			console.log("ArrowUp was pressed.");
		}
	}

	// if (keyCode == "Escape") {
	// 	startButtonEnable();
	// 	state.innerHTML = "";
	// }
	if (repeatLater) {
		await oneCycle(tone, diff - decrement);
	}
}



function validKey() {
	// Promise is resolved when user presses a valid key.
	let myPromise = new Promise(function (myResolve, myReject) {
		// Just checks once
		// if (validKeyCodes.has(keyCode)) {
		// 	myResolve();
		// }

		// Clear keyCode
		keyCode = "";
		setInterval(function () {
			if (validKeyCodes.has(keyCode)) {
				myResolve();
			}
		}, 100);
	})

	return myPromise;
}

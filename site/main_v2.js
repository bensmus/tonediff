var start_button = document.getElementById("start_button")

var tone, diff, decrement;
function updateSettings() {
	tone = Number(document.getElementById("tone_input").value);
	diff = Number(document.getElementById("diff_input").value);
	decrement = Number(document.getElementById("decrement_input").value);
	diff_info.innerText = getInfoString();
}

var state = document.getElementById("state");
var diff_info = document.getElementById("diff_info");

var state_first = "playing first note...";
var state_second = "playing second note...";
var state_wait = "please press w/s keys, enter, or esc...";
var state_correct = "correct.";
var state_wrong = "wrong.";

function getInfoString() {
	return "Current tone difference: " + diff + " Hz.\n";
}

var keyCode = "";  // Holds last pressed key
var playing = true;

window.onkeydown = function (keyEvent) {
	keyCode = keyEvent.code;
}

var validKeyCodes = new Set(["KeyS", "KeyW", "Enter", "Escape"]);
var upDownKeyCodes = new Set(["KeyS", "KeyW"]);

function preLoop() {
	updateSettings()
	diff_info.innerText = getInfoString();
	state.innerText = "";
	console.log("Disabling start button.");
	start_button.removeEventListener("click", play);
	start_button.classList.add("disabled");
	start_button.classList.remove("enabled");
}

function startButtonEnable() {
	diff_info.innerText = getInfoString();
	state.innerText = "";
	console.log("Enabling start button.")
	start_button.addEventListener("click", play);
	start_button.classList.remove("disabled");
	start_button.classList.add("enabled");
}

let play = async function () {
	preLoop();
	let forcedExit = false;  // Escape key
	while (diff > 0 && !forcedExit) {

		// Update info
		diff_info.innerText = getInfoString();

		let descending = Math.round(Math.random());
		let userDescending = false;  // 1 == true -> true
		if (descending) {
			var first = tone + diff;
			var second = tone;
		} else {
			var first = tone;
			var second = tone + diff;
		}

		state.innerText = state_first;
		await playSine(first);
		state.innerText = state_second;
		await playSine(second);
		state.innerText = state_wait;
		await validKey();
		console.log(keyCode);
		// Checking key codes
		if (keyCode == "Escape") {
			startButtonEnable();
			forcedExit = true;
		}
		if (keyCode == "KeyS") {
			userDescending = true;
		}
		if (upDownKeyCodes.has(keyCode)) {
			if (userDescending == descending) {
				state.innerText = state_correct;
				await sleep(2);
			} else {
				state.innerText = state_wrong;
				await sleep(2);
			}
			diff -= decrement;
		}
		// Must have pressed Enter. Don't do anything. The loop will loop.
	}
	startButtonEnable();
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

function sleep(seconds) {
	let promise = new Promise(function (resolve) {
		setTimeout(function () { resolve(); }, seconds * 1000);
	})
	return promise;
}

startButtonEnable();

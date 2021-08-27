var start_button = document.getElementById("start_button")

var state = document.getElementById("state");
var info_diff = document.getElementById("info_diff");
var info_cycle = document.getElementById("info_cycle");

var state_first = "playing first note...";
var state_second = "playing second note...";
var state_wait = "please press w/s keys, enter, or esc...";
var state_correct = "correct.";
var state_wrong = "wrong.";

var tone, diff, decrement, total_cycles;
function grabSettings() {
	// Called on setting change and on initial load.
	tone = Number(document.getElementById("tone_input").value);
	diff = Number(document.getElementById("diff_input").value);
	decrement = Number(document.getElementById("decrement_input").value);
	total_cycles = Math.floor(diff / decrement);
	updateInfo();
}

document.querySelectorAll("input").forEach(item => {
	item.addEventListener('change', grabSettings);
});

function updateInfo() {
	// Called within the play() loop, and implicitly by grabSettings()
	info_diff.innerText = "Current tone difference: " + diff + " Hz.\n";
	let current_cycle = total_cycles - Math.floor(diff / decrement);
	info_cycle.innerText = "Current cycle: " + current_cycle + "/" + total_cycles;
}

var keyCode = "";  // Holds last pressed key
var playing = true;

window.onkeydown = function (keyEvent) {
	keyCode = keyEvent.code;
}

var validKeyCodes = new Set(["KeyS", "KeyW", "Enter", "Escape"]);
var upDownKeyCodes = new Set(["KeyS", "KeyW"]);

function preLoop() {
	state.innerText = "";
	console.log("Disabling start button.");
	start_button.removeEventListener("click", play);
	start_button.classList.add("disabled");
	start_button.classList.remove("enabled");
}

function postLoop() {
	grabSettings();
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
		updateInfo();

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
			postLoop();
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
	postLoop();
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

postLoop();


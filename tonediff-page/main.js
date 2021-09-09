var start_button = document.getElementById("start_button")

var state = document.getElementById("state");
var info_diff = document.getElementById("info_diff");
var info_cycle = document.getElementById("info_cycle");
var info_tone = document.getElementById("info_tone");

var info_diff_cents = document.getElementById("info_diff_cents");
var info_diff_semitones = document.getElementById("info_diff_semitones");

var state_first = "playing first note...";
var state_second = "playing second note...";
var state_wait = "please press w/s keys, enter, or esc...";
var state_correct = "correct.";
var state_wrong = "wrong.";

var constant_decrement_input = document.getElementById("constant_decrement_input");
var multiplier_decrement_input = document.getElementById("multiplier_decrement_input");
var tone, timbre, diff, mode, constant_decrement, multiplier_decrement, total_cycles;
function grabSettings() {
	// Called on setting change and on initial load.
	tone = Number(document.getElementById("tone_input").value);
	diff = Number(document.getElementById("diff_input").value);
	mode = document.getElementById("decrement_mode").value;
	timbre = document.getElementById("timbre").value;
	if (mode == "constant") {
		constant_decrement_input.classList.remove("disabled_input");
		constant_decrement_input.disabled = false;
		constant_decrement_input.labels[0].style.color = "black";
		multiplier_decrement_input.classList.add("disabled_input");
		multiplier_decrement_input.disabled = true;
		multiplier_decrement_input.labels[0].style.color = "grey";
	} else {
		constant_decrement_input.classList.add("disabled_input");
		constant_decrement_input.disabled = true;
		constant_decrement_input.labels[0].style.color = "grey";
		multiplier_decrement_input.classList.remove("disabled_input");
		multiplier_decrement_input.disabled = false;
		multiplier_decrement_input.labels[0].style.color = "black";
	}
	constant_decrement = Number(document.getElementById("constant_decrement_input").value);
	multiplier_decrement = Number(document.getElementById("multiplier_decrement_input").value);

	// ! condition of multiplier
	if (mode == "constant") {
		total_cycles = Math.floor(diff / constant_decrement);
	} else {
		total_cycles = Math.ceil(Math.log(0.1 / diff) / Math.log(multiplier_decrement));
	}

	updateInfo();
}

document.querySelectorAll("input, select").forEach(item => {
	item.addEventListener('change', grabSettings);
});

function updateInfo() {
	// Called within the play() loop, and implicitly by grabSettings()
	info_diff.innerText = "Current tone difference: " + diff + " Hz.\n";
	let current_cycle;
	if (mode == "constant") {
		current_cycle = total_cycles - Math.floor(diff / constant_decrement);
	} else {
		current_cycle = total_cycles - Math.ceil(Math.log(0.1 / diff) / Math.log(multiplier_decrement));
	}
	info_cycle.innerText = "Current cycle: " + current_cycle + "/" + total_cycles;
	info_tone.innerText = freqToHuman(tone);

	let diffobj = semitoneAndCentDiff(tone + diff, tone);
	info_diff_cents.innerText = diffobj['cents'];
	info_diff_semitones.innerText = diffobj['semitones'];
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
	start_button.classList.add("disabled_button");
}

function postLoop() {
	grabSettings();
	state.innerText = "";
	console.log("Enabling start button.")
	start_button.addEventListener("click", play);
	start_button.classList.remove("disabled_button");
}

let play = async function () {
	preLoop();
	let escPress = false;  // Escape key
	let enterPress = false; // Enter key
	let descending = false;
	while (diff > 0.1 && !escPress) {
		updateInfo();

		if (!enterPress) {
			descending = Boolean(Math.round(Math.random()));
		}

		let userDescending = false;  // 1 == true -> true
		if (descending) {
			var first = tone + diff;
			var second = tone;
		} else {
			var first = tone;
			var second = tone + diff;
		}

		state.innerText = state_first;
		await playTone(first, timbre);
		state.innerText = state_second;
		await playTone(second, timbre);
		state.innerText = state_wait;
		await validKey();
		console.log(keyCode);
		// Checking key codes
		if (keyCode == "Enter") {
			enterPress = true;
		} else {
			enterPress = false;
		}
		if (keyCode == "Escape") {
			postLoop();
			escPress = true;
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
			if (mode == "constant") {
				diff -= constant_decrement;
			} else {
				diff *= multiplier_decrement;
			}
		}
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


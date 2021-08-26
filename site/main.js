var start_button = document.getElementById("start_button")

var tone_input = document.getElementById("tone_input");
var diff_input = document.getElementById("diff_input");
var decrement_input = document.getElementById("decrement_input");
var state = document.getElementById("state");

var state_first = "playing first note...";
var state_second = "playing second note...";
var state_wait = "please press up/down keys or enter...";
var state_correct = "correct.";
var state_wrong = "wrong.";

let gameLoop = function () {
	let base_tone = Number(tone_input.value);
	let tone_diff = Number(diff_input.value);

	// while (tone_diff > 0) {
	let first = base_tone;
	let second = base_tone + tone_diff;

	// 	let descending = Math.round(Math.random());
	// 	if (descending) {
	// 		let temp = first;
	// 		first = second;
	// 		second = temp;
	// 	}

	// 	playSine(first);
	// 	playSine(second);
	// }

	while (true) {
		playTwoSines(first, second);
	}
}

start_button.addEventListener("click", gameLoop);


var start_button = document.getElementById("start_button")

var tone_input = document.getElementById("tone_input");
var diff_input = document.getElementById("diff_input");
var decrement_input = document.getElementById("decrement_input");
var seconds_input = document.getElementById("seconds_input");

let gameLoop = function () {

	playSine(tone_input.value, seconds_input.value);
}

start_button.addEventListener("click", gameLoop);


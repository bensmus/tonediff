var sb = document.getElementById("start_button")

var arr = [],
	volume = 0.2,
	seconds = 2,
	tone = 441

for (var i = 0; i < context.sampleRate * seconds; i++) {
	arr[i] = sineWaveAt(i, tone) * volume
}

let wrapper = function () {
	// playSound(arr); // no attack
	playSound(addAttackRelease(arr, seconds, context.sampleRate)); // with attack and release
}

sb.addEventListener("click", wrapper);


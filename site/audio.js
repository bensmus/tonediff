// Taken from https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();

function playSound(arr) {
	var buf = new Float32Array(arr.length)
	for (var i = 0; i < arr.length; i++) buf[i] = arr[i]
	var buffer = context.createBuffer(1, buf.length, context.sampleRate)
	buffer.copyToChannel(buf, 0)
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);

	return new Promise(res => {
		source.start(0);
		source.onended = res
	})
}

function sineWaveAt(sampleNumber, tone) {
	var sampleFreq = context.sampleRate / tone
	return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
}

/* USAGE
var arr = [],
  volume = 0.2,
  seconds = 0.5,
  tone = 441

for (var i = 0; i < context.sampleRate * seconds; i++) {
  arr[i] = sineWaveAt(i, tone) * volume
}

playSound(arr)
*/

// My own work
function addAttackRelease(audio, duration, sampleRate) {
	// add 0.03 second linear attack and release to the audio
	// usage: audio = addAttack(sampleRate, audio)
	let transition = 0.03

	let samplesToScale = sampleRate * transition;

	// attack
	for (let index = 0; index < samplesToScale; index++) {
		const element = audio[index];
		audio[index] = element * index / (sampleRate * transition);
	}

	// release
	let firstSample = (duration - transition) * sampleRate;  // first sample of release
	let counter = 0;
	for (let index = firstSample; index < (firstSample + samplesToScale); index++) {
		const element = audio[index];
		audio[index] -= element * counter / (sampleRate * transition);
		counter++;
	}

	return audio;
}

async function playSine(tone) {
	let volume = 0.2;
	let seconds = 1;
	var arr = [];
	for (var i = 0; i < context.sampleRate * seconds; i++) {
		arr[i] = sineWaveAt(i, tone) * volume
	}
	await playSound(addAttackRelease(arr, seconds, context.sampleRate));
}


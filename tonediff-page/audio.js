// Taken from https://stackoverflow.com/questions/34708980/generate-sine-wave-and-play-it-in-the-browser

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();

function playFromArray(arr) {
	var buf = new Float32Array(arr.length);
	for (var i = 0; i < arr.length; i++) buf[i] = arr[i];
	var buffer = context.createBuffer(1, buf.length, context.sampleRate);
	buffer.copyToChannel(buf, 0);
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);

	return new Promise(res => {
		source.start(0);
		source.onended = res;
	})
}

function sineWaveAt(sampleNumber, tone) {
	let time = sampleNumber / context.sampleRate;
	return Math.sin(time * tone * Math.PI * 2);
}

function triangleWaveAt(sampleNumber, tone) {
	let time = sampleNumber / context.sampleRate;
	let period = 1 / tone;
	return triangle(time, period);
}

function triangle(time, period) {
	let timeEquiv = time % period;
	let m, x, b;
	if (timeEquiv > period / 2) {
		m = -2;
		b = 1;
		x = timeEquiv - period / 2;
	} else {
		m = 2;
		b = -1;
		x = timeEquiv;
	}
	return m * x + b;
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

async function playTone(tone, timbre) {
	let volume = 0.2;
	let seconds = 1;
	var arr = [];
	for (var i = 0; i < context.sampleRate * seconds; i++) {
		if (timbre == "sine") {
			arr[i] = sineWaveAt(i, tone) * volume;
		} else if (timbre == "triangle") {
			arr[i] = triangleWaveAt(i, tone) * volume;
		}
	}
	if (timbre == "triangle") {
		smoothArray(arr, 100);
	}

	await playFromArray(addAttackRelease(arr, seconds, context.sampleRate));
}

// Low pass filter code from:
// http://phrogz.net/js/framerate-independent-low-pass-filter.html
function smoothArray(values, smoothing) {
	var value = values[0]; // start with the first input
	for (var i = 1; i < values.length; ++i) {
		var currentValue = values[i];
		value += (currentValue - value) / smoothing;
		values[i] = value;
	}
}

function freqToMidiIndex(f) {
	return Math.round(Math.log(f/440) / Math.log(1.059463) + 69);
}

function midiIndexToHuman(i) {
	let aOffset = Math.round((i + 3) % 12);
    let notenames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']; 
    octave = Math.floor(i / 12) - 1;
    return notenames[aOffset] + String(octave);
}

function freqToHuman(f) {
	midiIndex = freqToMidiIndex(f);
	return midiIndexToHuman(midiIndex);
}

function semitoneAndCentDiff(f1, f2) {
	let cents = Math.round(1200 * Math.log(f1 / f2) / Math.log(2));
	let semitones = cents / 100;
	return {'cents': cents, 'semitones': semitones};
}
import numpy as np
import simpleaudio as sa
import random

def playSine(freq, duration):
    sample_rate = 44100
    t = np.linspace(0, duration, duration * sample_rate, False)
    y = np.sin(freq * t * 2 * np.pi)
    
    # normalize y
    y *= 32767 / np.max(np.abs(y))
    
    y = y.astype(np.int16)
    
    # sa.play_buffer(audio_data, num_channels, bytes_per_sample, sample_rate)
    play_obj = sa.play_buffer(y, 1, 2, sample_rate)
    
    play_obj.wait_done()
    
# 1: Select base tone (in Hz)
# 2: Select tone difference (in Hz)
# 3: Randomly choose whether to play ascending or descending
# 4: Play both tones
# 5: Ask if ascending or descending, or allow to listen again
# 6: Tell if correct or wrong
# 7: Reduce tone diff, go to step 3

base_tone = float(input("Base tone (in Hz): "))
tone_diff = float(input("Tone difference (in Hz): "))

while tone_diff > 0:
    first = base_tone
    second = base_tone + tone_diff
    
    descending = bool(random.randint(0, 1))
    if descending:
        temp = first
        first = second
        second = temp
    
    
    gettingInput = True
    while gettingInput:
        playSine(first, 2)
        playSine(second, 2)
        user_raw = input("Press w if ascending, s if descending, other key to listen again. ")
        if user_raw in {"w", "s"}:
            gettingInput = False
        
    
    user_descending = True if user_raw == "s" else False
    if user_descending == descending:
        print(f"Correct (tone difference {round(tone_diff, 2)}).")
    else:
        print(f"Wrong (tone difference {round(tone_diff, 2)}).")
       
    tone_diff -= 1/3
        
    

import os
import wave

import numpy as np
import pyaudio
from include import helpers
from keras.models import load_model  # type: ignore
import time

model_file = "aug-train-nb3.keras"
models_path = os.path.abspath("./models")
model_path = os.path.join(models_path, model_file)

model = load_model(model_path)

labels = [
    "Air Conditioner",
    "Car Horn",
    "Children Playing",
    "Dog bark",
    "Drilling",
    "Engine Idling",
    "Gun Shot",
    "Jackhammer",
    "Siren",
    "Street Music",
]


def predict_audio(test_file):
    mels = helpers.get_mel_spectrogram(test_file, 0, n_mels=40)
    mels_max_padding = 174
    size = len(mels[1])
    if size < mels_max_padding:
        pad_width = mels_max_padding - size
        mels_px = np.pad(
            mels,
            pad_width=((0, 0), (0, pad_width)),
            mode="constant",
            constant_values=(0,),
        )

    print(mels_px.shape)
    y_probs = model.predict(mels_px.reshape(1, 40, 174, 1))
    print(y_probs)
    yhat_probs = np.argmax(y_probs, axis=1)
    print(labels[yhat_probs[0]])
    return {"Detected": labels[yhat_probs[0]]}


# audio recording and gunshot detection
def detect(ret = False):
    CHUNK = 1024  # size of each data frame in which audio will be recorded
    FORMAT = pyaudio.paInt16
    CHANNELS = 1  # recording channel
    RATE = 22050  # sampling rate
    RECORD_SECONDS = 4
    while True:
        WAVE_OUTPUT_FILENAME = "background" + ".wav"
        p = pyaudio.PyAudio()
        # opening stream for recording audio with given parameters
        stream = p.open(
            format=FORMAT,
            channels=CHANNELS,
            rate=RATE,
            input=True,
            frames_per_buffer=CHUNK,
        )
        frames = []
        # here audio is recorded for time according to given parameters and data is stored in frames
        for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
            data = stream.read(CHUNK)
            frames.append(data)
        stream.stop_stream()  # stop the recording data stream
        stream.close()  # close the stream
        p.terminate()
        # now open a wave file with a specified name to store the audio
        audio_filename = (
            "./"
            + WAVE_OUTPUT_FILENAME
        )
        wf = wave.open(audio_filename, "wb")
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(p.get_sample_size(FORMAT))
        wf.setframerate(RATE)
        wf.writeframes(b"".join(frames))
        wf.close()  # storing of audio is done till here
        print(f"Saved Audio File : {WAVE_OUTPUT_FILENAME}")
        if ret:
            yield str.encode('{}\n'.format(predict_audio(audio_filename)))
        else:
            predict_audio(audio_filename)


if __name__ == "__main__":
    detect()

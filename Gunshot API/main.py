import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel


class Sound(BaseModel):
    file: str
    fold: int


app = FastAPI()


import os

import numpy as np
from include import helpers
from keras.models import load_model # type: ignore

model_file = "aug-train-nb3.keras"
models_path = os.path.abspath("/Users/jaycrappe/Documents/GitHub/Keystone/Gunshot API/models")
model_path = os.path.join(models_path, model_file)

test_file = "/Users/jaycrappe/Documents/GitHub/urban-audio-classifier/UrbanSound8K/audio/fold2/76089-6-0-0.wav"

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


@app.get("/")
async def get_result():
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


@app.post("/")
async def get_post_result(sound: Sound):
    test_file = "/Users/jaycrappe/Documents/GitHub/urban-audio-classifier/UrbanSound8K/audio/fold{}/{}.wav".format(
        sound.fold, sound.file.replace(".wav", "")
    )
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

@app.post("/upload/")
async def get_uploaded_result(audio_file: UploadFile = File(...)):
    if not audio_file.filename.endswith('.wav'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a '.wav' file.")
    WAVE_OUTPUT_FILENAME = "background-test.wav"
    audio_filename = (
            "/Users/jaycrappe/Documents/GitHub/Keystone/Gunshot API/"
            + WAVE_OUTPUT_FILENAME
        )
    CHUNK = 1024
    with open(audio_filename, "wb") as buffer:
        while data := await audio_file.read(CHUNK):
            buffer.write(data)
    mels = helpers.get_mel_spectrogram(audio_filename, 0, n_mels=40)
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


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse, RedirectResponse
import audio_stream
import subprocess


class Sound(BaseModel):
    file: str
    fold: int


class TelegramBot(BaseModel):
    link: str


app = FastAPI()


import os

import numpy as np
from include import helpers
import requests
from keras.models import load_model  # type: ignore

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


@app.get("/", include_in_schema=False)
def redirect_to_docs():
    return RedirectResponse(url="/docs/")


@app.get("/stream_response/")
async def get_result():
    return StreamingResponse(
        audio_stream.detect(ret=True), media_type="text/event-stream"
    )


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


def process_audio(audio_filename):
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
    return labels[yhat_probs[0]]


@app.post("/upload/")
async def get_uploaded_result(audio_file: UploadFile = File(...)):
    if not audio_file.filename.endswith(".wav"):
        raise HTTPException(
            status_code=400, detail="Invalid file format. Please upload a '.wav' file."
        )
    WAVE_OUTPUT_FILENAME = "background-test.wav"
    audio_filename = "./" + WAVE_OUTPUT_FILENAME
    CHUNK = 1024
    with open(audio_filename, "wb") as buffer:
        while data := await audio_file.read(CHUNK):
            buffer.write(data)

    # Call the function to process the audio file
    return {"Detected": process_audio(audio_filename)}


@app.post("/telegram/")
async def get_uploaded_result(link: TelegramBot):
    if not link.link.endswith(".oga"):
        raise HTTPException(
            status_code=400, detail="Invalid file format. Please upload a '.oga' link."
        )

    audio_url = link.link

    response = requests.get(audio_url)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to download audio file.")

    WAVE_OUTPUT_FILENAME = "background-test.wav"
    audio_filename = "audio.oga"

    with open(audio_filename, "wb") as file:
        file.write(response.content)

    process = subprocess.run(
        ["ffmpeg", "-i", audio_filename, WAVE_OUTPUT_FILENAME, "-y"]
    )

    if process.returncode != 0:
        raise HTTPException(status_code=400, detail="Failed to convert audio file.")

    audio_filename = "./" + WAVE_OUTPUT_FILENAME

    return {"Detected": process_audio(audio_filename)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# Use an official Python runtime as a parent image
FROM python:3.10-slim

RUN apt-get update
RUN apt-get -y install gcc
RUN apt-get install libasound-dev portaudio19-dev libportaudio2 libportaudiocpp0 ffmpeg -y
RUN apt-get install libhdf5-serial-dev -y

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY ./ /usr/src/app/

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV MODULE_NAME="app"
ENV VARIABLE_NAME="app"

# Run app.py when the container launches
CMD ["python", "main.py"]

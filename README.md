# Keystone: Emergency Response Assistance (ERA)

## Overview

Keystone is a project designed to provide Emergency Response Assistance (ERA) by simulating and detecting emergency scenarios. The system integrates various modules to detect gunshots, simulate escape routes, analyze network logs, and evaluate WiFi data to ensure a comprehensive response to emergencies.

## Repository Structure

The repository is organized into the following main components:

- **AP Logs**: Legacy network log simulator and their logs.
- **Documentation**: Additional documentation for the project.
- **EscapeRouteSimulator**: An animation showcasing the escape route algorithm.
- **Gunshot API**: An API exposed for the **Gunshot Detection** module.
- **Gunshot Detection**: Implements the algorithms and models used for gunshot detection.
- **MainServer**: The central server that integrates and manages all components of the ERA system. - [MainServer.md](https://github.com/stark3998/keystone/blob/a4c8419dbcf2eb153349adc3fd686283a2d23117/MainServer.md)
- **Network Log Simulator**: Simulates network logs to analyze and detect unusual activity.
- **Wifi Analysis**: Legacy algorithms for analyzing Wi-Fi singals and their data.
- **era-frontend**: The front-end interface for the ERA system. - [Frontend.md](https://github.com/stark3998/keystone/blob/71b9335498f40e223646c29d49ef4a7fe3c97b75/Frontend.md)

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Python 3.x
- `portaudio` (for the Gunshot API)
- node and npm lts

### Installation

#### Gunshot API

1. Install `portaudio`:
    ```sh
    brew install portaudio
    ```
2. Set up the Gunshot API environment:
    ```sh
    cd Gunshot\ API
    python3 -m venv env
    source env/bin/activate
    pip install -r requirements.txt
    python3 main.py
    ```

### MainServer

1. Navigate to the MainServer directory:
    ```sh
    cd MainServer
    ```
2. Install the required dependencies:
    ```sh
    npm install
    ```
3. Compile Typescript:
    ```sh
    npx tsc
    ```
4. Start the server:
    ```sh
    npm start
    ```

### Network Log Simulator

1. Navigate to the Network Log Simulator directory:
    ```sh
    cd Network\ Log\ Simulator
    ```
2. Install the required dependencies:
    ```sh
    npm install
    ```
3. Compile Typescript:
    ```sh
    npx tsc
    ```
4. Start the server:
    ```sh
    npm start
    ```

### ERA Frontend

1. Navigate to the ERA Frontend:
    ```sh
    cd era-frontend
    ```
2. Install the required dependencies:
    ```sh
    npm install
    ```
3. Start the server:
    ```sh
    npm run dev
    ```
4. Navigate to the specified URL

## Running the Project

To run the entire project, follow the setup instructions for each component. Ensure all dependencies are installed and the environment is correctly configured. Start each component as described in the installation steps.

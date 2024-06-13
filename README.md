# Keystone: Emergency Response Assistance (ERA)

## Overview

Keystone is a project designed to provide Emergency Response Assistance (ERA) by simulating and detecting emergency scenarios. The system integrates various modules to detect gunshots, simulate escape routes, analyze network logs, and evaluate WiFi data to ensure a comprehensive response to emergencies.

## Repository Structure

The repository is organized into the following main components:

- **AP Logs**: Contains logs related to Access Points used in the project.
- **Documentation**: Detailed documentation for each component of the project.
- **EscapeRouteSimulator**: A simulator to model escape routes in emergency situations.
- **Gunshot API**: An API responsible for detecting gunshots using audio processing.
- **Gunshot Detection**: Implements the algorithms and models used for gunshot detection.
- **MainServer**: The central server that integrates and manages all components of the ERA system.
- **Network Log Simulator**: Simulates network logs to analyze and detect unusual activity.
- **Wifi Analysis**: Analyzes WiFi signals and data to assist in emergency detection and response.
- **era-frontend**: The front-end interface for the ERA system.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Python 3.x
- `portaudio` (for the Gunshot API)

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

### EscapeRouteSimulator

1. Navigate to the EscapeRouteSimulator directory:
    ```sh
    cd EscapeRouteSimulator
    ```
2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
3. Run the simulator:
    ```sh
    python simulator.py
    ```

### MainServer

1. Navigate to the MainServer directory:
    ```sh
    cd MainServer
    ```
2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
3. Start the server:
    ```sh
    python server.py
    ```

### Network Log Simulator

1. Navigate to the Network Log Simulator directory:
    ```sh
    cd Network\ Log\ Simulator
    ```
2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
3. Run the simulator:
    ```sh
    python network_log_simulator.py
    ```

### Wifi Analysis

1. Navigate to the Wifi Analysis directory:
    ```sh
    cd Wifi\ Analysis
    ```
2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```
3. Run the analysis script:
    ```sh
    python wifi_analysis.py
    ```

## Running the Project

To run the entire project, follow the setup instructions for each component. Ensure all dependencies are installed and the environment is correctly configured. Start each component as described in the installation steps.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for review. Make sure your code adheres to the project's coding standards and is well-documented.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For more information, contact the repository owner [stark3998](https://github.com/stark3998).

---

# README.md

```markdown
# Keystone: Emergency Response Assistance (ERA)

## Overview

Keystone is a comprehensive system designed to assist in emergency response scenarios. It includes modules for gunshot detection, escape route simulation, network log analysis, and WiFi signal evaluation, all integrated into a central server with a user-friendly front-end interface.

## Repository Structure

- **AP Logs**: Access Point logs.
- **Documentation**: Detailed component documentation.
- **EscapeRouteSimulator**: Models escape routes.
- **Gunshot API**: Detects gunshots via audio.
- **Gunshot Detection**: Implements detection algorithms.
- **MainServer**: Central server management.
- **Network Log Simulator**: Analyzes simulated network logs.
- **Wifi Analysis**: Evaluates WiFi data for emergency response.
- **era-frontend**: Front-end interface.

## Getting Started

### Prerequisites

- Python 3.x
- `portaudio`

### Installation

#### Gunshot API

```sh
brew install portaudio
cd Gunshot\ API
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 main.py
```

#### EscapeRouteSimulator

```sh
cd EscapeRouteSimulator
pip install -r requirements.txt
python simulator.py
```

#### MainServer

```sh
cd MainServer
pip install -r requirements.txt
python server.py
```

#### Network Log Simulator

```sh
cd Network\ Log\ Simulator
pip install -r requirements.txt
python network_log_simulator.py
```

#### Wifi Analysis

```sh
cd Wifi\ Analysis
pip install -r requirements.txt
python wifi_analysis.py
```

## Running the Project

Set up and start each component as described. Ensure all dependencies are installed.

## Contributing

Fork the repository and submit pull requests. Ensure your code is documented and adheres to project standards.

## License

MIT License. See the `LICENSE` file.

## Contact

For more information, contact [stark3998](https://github.com/stark3998).
```

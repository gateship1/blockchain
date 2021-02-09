# Blockchain Backend

A backend for a simple Blockchain implementation. A C++ engine is provided. The engine is accessed with a Python Flask API using PyBind11. The backend can be run in "server" mode in a provided Docker container or it can be built and run locally using a Terminal. Instructions for both methods are provided.

## Table of Contents
* [Prerequisites](#prerequisites)
* [Build and Run Docker Server](#run-docker-server)
* [Build and Run Locally in Terminal](#run-locally-in-terminal)
* [Create Environment in Terminal to Build with CMake](#create-environment-in-terminal-to-build-with-cmake)
* [Build Backend](#build-backend)
* [Run Backend Server in Terminal](#run-backend-server-in-terminal)
* [Deactivate Build Environment](#deactivate-build-environment)
* [References](#references)

## Prerequisites
* [Docker](https://www.docker.com/)
* A compiler that supports modern C++ (recommended minimum version is C++17)
* [CMake](https://cmake.org/) Version 3.13.4 (or later)
* Python Version 3.6 (or later)
* Internet access (for [doctest](https://github.com/onqtam/doctest) and [pybind11](https://github.com/pybind/pybind11.git) cloning as well as requirements installation and running a Docker server)

## Build and Run Docker Server
The option to build and run the server in a Docker container is available with the provided ```Dockerfile```. In the directory containing the ```Dockerfile```, use the following commands:
```console
docker build -t blockchain .
```
To run the container
```console
docker run -t -d -p 5000:5000 blockchain:latest
```
Visit ```localhost:5000``` in the browser to see the Genesis block (or current last block in the chain).\
\[[toc](#table-of-contents)\]

#### Other Useful Docker Commands

TO VIEW **ALL** DOCKER DOCKER IMAGES
```console
docker images
```

TO VIEW RUNNING DOCKER CONTAINERS
```console
docker ps -a
```

TO STOP **ALL** RUNNING DOCKER CONTAINERS
```console
docker container stop $(docker container ls -aq)
```

TO **DESTROY ALL** STOPPED DOCKER CONTAINERS
```console
docker container rm $(docker container ls -aq)  
```

TO **DESTROY ALL** DOCKER IMAGES
```console
docker system prune -a
```

While not a Docker command, the following can be used to ensure the container is listening to correct port:
```console
sudo netstat -ntlp | grep LISTEN
```
\[[toc](#table-of-contents)\]

## Build and Run Locally in Terminal

A local build in a virtual environment and running the backend locally is provided as an alternative option to Docker.

### Create Environment in Terminal to Build with CMake
**NOTE:** all shell scripts may require
```console
chmod u+x <name>.sh
```
In the ```api/scripts``` directory
```console
source ./create_and_update_venv.sh
```
This will install all requirements listed in ```requirements.txt```.\
\[[toc](#table-of-contents)\]

### Build Backend

Blockchain implementation is provided with CMake files.\
SHA-256 is used for hashing.\
The CMake files are currently only configured for a Linux build, but that can be modified with relative ease.\
In the parent directory containing the *CMakeLists.txt* file:
```console
mkdir build
cd build
```
The directory structure is now:
```console
backend
├── api
│   └── scripts
├── build
├── cmake_files
├── cppsrc
│   └── CMakeLists.txt
├── simulate_blockchain
│   └── CMakeLists.txt
├── tests
│   └── CMakeLists.txt
├── .gitignore
├── CMakeLists.txt
├── Dockerfile
└── README.md
```

* Option 1: **build server**\
This option builds the "server" locally. (This is the build type in the DockerFile.)
```console
cmake .. && make
```

* Option 2: **build with testing**\
This option creates a build to run the SHA-256 unit testing.
```console
cmake .. -DTEST=True && make
```

* Option 3: **build with testing (including long message tests)**\
This creates a build to run the SHA-256 unit testing including the every long messages (unit testing may take some time).
```console
cmake .. -DTEST=True -DENABLE_LONG_TESTS=True && make
```

* Option 4: **build to simulate a blockchain (C++ computational engine only)**\
This is a legacy option that is still available. The blockchain engine can build built and run interactively in the Terminal.
```console
cmake .. -DSIMULATE=True && make
```
\[[toc](#table-of-contents)\]

### Run Backend Server in Terminal
**Note:** This option is only guaranteed to work with the option 1 build.\
In the ```api``` directory
```console
python server.py
```
\[[toc](#table-of-contents)\]

### Deactivate Build Environment
```console
deactivate
```
\[[toc](#table-of-contents)\]

## References
* [Blockchain Technology](https://bitcoin.org/bitcoin.pdf)
* [Blockchain Description](https://www.tutorialspoint.com/blockchain/index.htm)
* [SHA-256 Description](https://en.wikipedia.org/wiki/SHA-2)
* [SHA-256 Algorithm](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf)
* [SHA-256 Implementation Notes](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines/example-values)
* [SHA-256 Test Data](https://csrc.nist.gov/CSRC/media/Projects/Cryptographic-Standards-and-Guidelines/documents/examples/SHA256.pdfhttps://csrc.nist.gov/CSRC/media/Projects/Cryptographic-Standards-and-Guidelines/documents/examples/SHA256.pdf)
* [SHA-256 Additional Test Data](https://csrc.nist.gov/CSRC/media/Projects/Cryptographic-Standards-and-Guidelines/documents/examples/SHA2_Additional.pdf)

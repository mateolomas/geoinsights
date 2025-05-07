#!/bin/bash

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install system dependencies (for Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    build-essential \
    python3-dev

# Set GDAL environment variables
export CPLUS_INCLUDE_PATH=/usr/include/gdal
export C_INCLUDE_PATH=/usr/include/gdal

# Install Python dependencies
pip install --upgrade pip
pip install numpy
pip install GDAL==$(gdal-config --version)
pip install -r requirements.txt

echo "Development environment setup complete!" 
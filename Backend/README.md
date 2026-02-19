# NeuroScan AI Backend

## Overview

The NeuroScan AI Backend is a FastAPI-based web service that provides AI-powered analysis of brain MRI scans for tumor detection, classification, and segmentation. It serves as the core processing engine for the NeuroScan AI platform, offering RESTful APIs for user management, scan processing, and result retrieval.

## Features

- **User Authentication**: JWT-based authentication with user registration and login.
- **Scan Processing Pipeline**: Automated analysis of uploaded MRI scans using deep learning models.
- **AI Models Integration**: Incorporates three specialized AI models for comprehensive brain tumor analysis:
  - **Detection**: Binary classification to identify presence of tumors.
  - **Classification**: Multi-class classification of tumor types (glioma, meningioma, pituitary, no tumor).
  - **Segmentation**: 3D segmentation of tumor regions (whole tumor, tumor core, enhancing tumor).
- **Multi-Modal MRI Support**: Handles various MRI modalities (FLAIR, T1, T1CE, T2).
- **Database Storage**: SQLite-based storage for users, scans, and results.
- **File Management**: Secure upload and storage of MRI files.
- **API Endpoints**: Comprehensive REST API for frontend integration.

## Architecture

The backend is built with:

- **FastAPI**: Modern, fast web framework for building APIs.
- **SQLModel**: ORM for database interactions with Pydantic integration.
- **TensorFlow/PyTorch**: For loading and running AI models.
- **OpenCV/Nibabel**: For image processing and NIfTI file handling.

## Folder Structure

- `Classification/` - Contains the brain tumor classification model and its README.
- `Detection/` - Contains the brain tumor detection model and its README.
- `Segmentation/` - Contains the brain tumor segmentation model and its README.
- `Input/` - (Empty) Reserved for input processing utilities.
- `uploads/` - Directory for uploaded MRI files and processed results.
- `__pycache__/` - Python bytecode cache.
- `database.py` - Database setup and session management.
- `main.py` - Main FastAPI application with API endpoints.
- `models.py` - Database models for User and Scan entities.
- `neuroscan.db` - SQLite database file.
- `processor.py` - BrainProcessor class for AI model loading and inference.
- `requirements.txt` - Python dependencies.

## AI Models

### Detection Model

Refer to `Detection/README.md` for detailed information on the binary brain tumor detection model using ResNet50, trained on multiple datasets with advanced data augmentation.

### Classification Model

Refer to `Classification/README.md` for detailed information on the multi-class brain tumor classification model using ResNet50, achieving 87.41% test accuracy across four tumor types.

### Segmentation Model

Refer to `Segmentation/README.md` for detailed information on the 3D U-Net based segmentation model trained on BraTS2020 dataset, providing precise tumor delineation.

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me` - Update user profile

### Scans

- `GET /api/scans` - List user's scans
- `GET /api/scans/{scan_id}` - Get specific scan details
- `POST /api/process-mri` - Upload and process MRI scans
- `PUT /api/scans/{scan_id}` - Update scan information
- `DELETE /api/scans/{scan_id}` - Delete scan
- `GET /api/scans/{scan_id}/slice/{slice_idx}` - Get MRI slice image
- `GET /api/scans/{scan_id}/segmentation/{slice_idx}` - Get segmentation mask slice
- `GET /api/scans/{scan_id}/download/{key}` - Download scan files

## Dependencies

Key dependencies include:

- FastAPI for the web framework
- Uvicorn for the ASGI server
- TensorFlow and PyTorch for AI model inference
- OpenCV and nibabel for image processing
- SQLModel for database ORM
- JWT libraries for authentication

See `requirements.txt` for the complete list.

## Database

The application uses SQLite (`neuroscan.db`) for data persistence. Tables include:

- `user` - User accounts and profiles
- `scan` - MRI scan records and processing results

## Security

- Password hashing with bcrypt
- JWT token-based authentication
- CORS enabled for cross-origin requests
- File upload validation

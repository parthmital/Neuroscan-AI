# NeuroScan AI

## Project Overview

NeuroScan AI is an AI-powered platform for automated brain tumor analysis from MRI scans. It provides radiologists and medical professionals with accurate detection, classification, and segmentation of brain tumors.

This full-stack project uses AI/ML, backend development, frontend engineering, and medical imaging to create applications with high accuracy and usability.

## Tech Stack

### Backend

| Technology                       | Purpose                        |
| -------------------------------- | ------------------------------ |
| Python with FastAPI              | REST APIs                      |
| TensorFlow and PyTorch           | Deep learning models           |
| SQLModel (SQLAlchemy + Pydantic) | ORM and database management    |
| SQLite                           | Lightweight, embedded database |
| JWT                              | Secure authentication          |
| OpenCV, Nibabel, scikit-image    | Image processing               |

### Frontend

| Technology               | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| React 18 with TypeScript | Type-safe, component-based UI                |
| Vite                     | Fast development and builds                  |
| Tailwind CSS             | Modern, responsive styling                   |
| shadcn/ui                | Accessible UI components (built on Radix UI) |
| React Router             | Client-side routing                          |
| TanStack React Query     | Efficient data fetching and caching          |
| Recharts                 | Interactive data visualization               |
| Lucide React             | Consistent iconography                       |

## Key Features

| Feature               | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| User Authentication   | Secure JWT-based login and registration system                           |
| MRI Scan Upload       | Support for multiple modalities (FLAIR, T1, T1CE, T2)                    |
| AI Analysis           | Three specialized models for detection, classification, and segmentation |
| Processing            | Efficient pipeline for scan analysis                                     |
| Dashboard             | Comprehensive scan management and visualization                          |
| 3D Segmentation Views | Precise tumor delineation with overlay masks                             |
| Reports & Analytics   | Data-driven insights and performance metrics                             |
| Responsive Design     | Mobile-first approach for accessibility across devices                   |

## Architecture

The application follows an architecture with clear separation between backend and frontend:

| Layer                   | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Backend (API Layer)     | Handles business logic, AI inference, database operations, and file management          |
| Frontend (Client Layer) | Provides intuitive user interface, data visualization, and client-side state management |
| Database Layer          | SQLite for user and scan data persistence                                               |
| AI Models               | Pre-trained and fine-tuned models stored in dedicated directories                       |

## Methodology & AI Models

| Model          | Architecture                                       | Training                                                                                                      | Accuracy                                    | Purpose                                  |
| -------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------- |
| Detection      | ResNet50 with transfer learning                    | Multi-dataset integration (BR35H, NAV, MOS) with augmentation (histogram matching, geometric transformations) | 80.07% on test set with 85.99% AUC          | Binary classification for tumor presence |
| Classification | ResNet50 fine-tuned for multi-class classification | 46,920 images across 4 classes (glioma, meningioma, pituitary, no tumor)                                      | 87.41% test accuracy                        | Identify tumor type                      |
| Segmentation   | 3D U-Net                                           | BraTS2020 dataset with patch-based training                                                                   | WT Dice 0.847, TC Dice 0.753, ET Dice 0.761 | Precise 3D tumor boundary delineation    |

**Methodology Highlights**:

| Technique             | Benefit                       |
| --------------------- | ----------------------------- |
| Transfer learning     | Leverage pre-trained features |
| Multi-GPU training    | Efficiency                    |
| Data augmentation     | Robustness                    |
| Hybrid loss functions | Convergence                   |

## Requirements

### Functional Requirements

| Requirement                                                                | Description                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------ |
| User registration and authentication                                       | Allows users to create accounts and log in securely    |
| Secure upload of MRI scans in NIfTI format                                 | Ensures safe file handling for medical data            |
| Automated AI analysis pipeline (detection → classification → segmentation) | Processes scans in sequence for comprehensive analysis |
| Scan result visualization with 3D overlays                                 | Displays results in an understandable format           |
| Scan library management (view, edit, delete)                               | Enables users to manage their scan history             |
| Report generation and export                                               | Produces reports for further use                       |
| User profile management                                                    | Allows users to update their information               |

### Non-Functional Requirements

| Aspect      | Requirement                                               |
| ----------- | --------------------------------------------------------- |
| Performance | <10 seconds inference time per scan                       |
| Accuracy    | >85% for classification and detection                     |
| Security    | JWT tokens, password hashing with bcrypt, CORS protection |
| Usability   | Intuitive interface with responsive design                |
| Scalability | Modular architecture for easy extension                   |
| Reliability | Error handling and graceful degradation                   |

### User Requirements

| User Type                          | Requirements                                        |
| ---------------------------------- | --------------------------------------------------- |
| Radiologists/Medical Professionals | Quick, accurate tumor analysis to support diagnosis |
| Researchers                        | Access to detailed segmentation data for studies    |
| Administrators                     | User management and system monitoring               |
| General Users                      | Secure, HIPAA-compliant data handling               |

### System Requirements

| Component | Requirements                                          |
| --------- | ----------------------------------------------------- |
| Backend   | Python 3.8+, CUDA-compatible GPU for AI inference     |
| Frontend  | Node.js 16+, modern web browser                       |
| Storage   | Sufficient disk space for models (~1GB) and scan data |
| Network   | Stable internet for model downloads and updates       |

# Plant Leaf Disease Classifier 

A full-stack, mobile-first application designed to identify plant diseases accurately using Deep Learning. The application consists of a **React Native (Expo)** mobile application and a **FastAPI** backend powered by a custom **MobileNetV2** PyTorch model.

## Features

*   **Real-time Image Classification:** Upload or capture an image of a leaf to instantly receive a diagnosis.
*   **Highly Accurate AI:** Utilizes a lightweight, fine-tuned MobileNetV2 architecture built with PyTorch.
*   **Extensive Database:** Capable of predicting 184 unique plant and disease combinations (covering species like Aloe Vera, Apple, Tomato, Rice, Wheat, Cotton, and many more).
*   **Top 3 Predictions:** The model provides confidence scores for the most likely diagnoses.
*   **Cross-platform Mobile UI:** A smooth and responsive user interface built using React Native and Expo.

## Screenshots

*(Replace these placeholder links with actual images from your app once you upload them to GitHub! You can drag and drop images directly into GitHub to get the URLs)*

| Home Screen | Upload Screen | Results Screen |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/250x500.png?text=Home+Screen" width="250"> | <img src="https://via.placeholder.com/250x500.png?text=Upload+Screen" width="250"> | <img src="https://via.placeholder.com/250x500.png?text=Results+Screen" width="250"> |

## Tech Stack

**Frontend (Mobile App)**
*   React Native
*   Expo
*   TypeScript

**Backend (API Server)**
*   Python 3
*   FastAPI
*   PyTorch / Torchvision
*   Pillow (PIL)

## Project Structure

```text
├── artifacts/
│   ├── mobile/
│   │   ├── app/                # React Native Expo Frontend code
│   │   ├── utils/              # API networking and utilities
│   │   └── backend/            # FastAPI Backend Logic
│   │       ├── main.py         # The core FastAPI application
│   │       ├── classes.txt     # List of 184 plant/disease classes
│   │       └── best_model_mobilenet.pth # Fine-tuned ML Model
```

## Setup and Installation

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/plant-disease-app.git
cd plant-disease-app
```

### 2. Backend Setup
Navigate to the backend directory and install the required Python packages.

```bash
cd artifacts/mobile/backend
pip install -r requirements.txt
```

### 3. Frontend Setup
Navigate back to the mobile folder and install dependencies using `npm`, `yarn`, or `pnpm` (pnpm is recommended).

```bash
cd ../
pnpm install
```

## How to Run

You will need to run the backend server, an Ngrok tunnel, and the frontend mobile app.

**Terminal 1: Start the Backend server**
```bash
cd artifacts/mobile/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The API will be available locally at `http://localhost:8000`*

**Terminal 2: Start Ngrok (To expose the backend to your phone)**
Because your phone and computer are on different network environments, you need to use Ngrok to expose your local API to the internet.
```bash
ngrok http 8000
```
*1. Copy the forwarding URL (e.g., `https://xxxx-xx-xxx.ngrok-free.app`)*
*2. Open `artifacts/mobile/utils/api.ts` in your code and replace the base URL with your new Ngrok URL.*

**Terminal 3: Start the Mobile App**
```bash
cd artifacts/mobile
npx expo start
```
*You can scan the QR code with your phone (using the Expo Go app) or press 'a' to run it on an Android emulator.*

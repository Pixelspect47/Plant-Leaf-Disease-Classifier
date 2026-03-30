# Plant Leaf Disease Classifier — Full Documentation

---

## Overview

A full-stack mobile application that uses AI to detect plant leaf diseases from photos. The user takes or uploads a photo of a plant leaf, sends it to a local AI backend, and receives the top 3 disease predictions with confidence percentages.

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Mobile App (Expo Go)            │
│  ┌──────────┐  ┌────────┐  ┌─────────┐ │
│  │ Welcome  │→ │  Home  │→ │ Results │ │
│  │ Screen   │  │ Screen │  │ Screen  │ │
│  └──────────┘  └────────┘  └─────────┘ │
└─────────────────┬───────────────────────┘
                  │ HTTPS (via ngrok)
                  │ POST /predict
                  ▼
┌─────────────────────────────────────────┐
│         ngrok Tunnel                    │
│  (Bridges phone → your PC)              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│     FastAPI Backend (localhost:8000)    │
│  ┌─────────────────────────────────┐   │
│  │  Image Preprocessing            │   │
│  │  Resize(256) → CenterCrop(224)  │   │
│  │  ToTensor → Normalize           │   │
│  └────────────────┬────────────────┘   │
│                   ▼                    │
│  ┌─────────────────────────────────┐   │
│  │  ShuffleNetV2 PyTorch Model     │   │
│  │  184 plant disease classes      │   │
│  └────────────────┬────────────────┘   │
│                   ▼                    │
│  ┌─────────────────────────────────┐   │
│  │  Softmax → Top 3 Predictions   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Mobile    | React Native + Expo (Expo Go)     |
| Navigation| Expo Router (file-based routing)  |
| Language  | TypeScript (frontend)             |
| Backend   | FastAPI (Python)                  |
| AI Model  | PyTorch — ShuffleNetV2            |
| Tunnel    | ngrok                             |

---

## Project Structure

```
artifacts/mobile/
├── app/
│   ├── _layout.tsx        # Root layout, providers (fonts, query client)
│   ├── index.tsx          # Welcome screen
│   ├── home.tsx           # Image upload screen
│   └── results.tsx        # Prediction results screen
├── utils/
│   └── api.ts             # API call to backend (/predict)
├── constants/
│   └── colors.ts          # App color theme
├── backend/
│   ├── main.py            # FastAPI server + model inference
│   ├── requirements.txt   # Python dependencies
│   ├── best_shufflenet_model.pth   ← YOU provide this
│   └── classes.txt                 ← YOU provide this
├── metro.config.js        # Metro bundler config (standalone mode)
├── app.json               # Expo app config
└── package.json           # Node dependencies
```

---

## How the App Works

### Screen 1 — Welcome
- Displays the app title and features
- "Get Started" button navigates to the Home screen

### Screen 2 — Home
- User picks an image from the gallery or takes a photo using the camera
- Image preview is displayed
- "Predict Disease" button sends the image to the backend
- Shows a loading indicator while waiting

### Screen 3 — Results
- Displays the uploaded image
- Shows top 3 predictions with disease name, confidence percentage, and a visual bar
- Top prediction is highlighted
- "Try Again" goes back to the Home screen

### API Flow
1. Image is selected on phone
2. App sends it as `multipart/form-data` via POST to `https://YOUR-NGROK-URL/predict`
3. Backend receives image → converts to RGB → applies preprocessing
4. PyTorch model runs inference → softmax applied
5. Top 3 predictions returned as JSON
6. App displays results

---

## Model Details

- **Architecture:** ShuffleNetV2 x1.0
- **Classes:** 184 plant disease categories
- **Input:** 224×224 RGB image
- **Preprocessing:**
  - Resize to 256px
  - CenterCrop to 224px
  - Normalize with ImageNet mean/std:
    - mean = [0.485, 0.456, 0.406]
    - std  = [0.229, 0.224, 0.225]
- **Output:** Top 3 classes with softmax confidence scores

---

## classes.txt Format

One class name per line, alphabetically sorted (matching training folder order):

```
Apple___Apple_scab
Apple___Black_rot
Apple___Cedar_apple_rust
Apple___healthy
Blueberry___healthy
...
```

Generate it from your training dataset:
```python
import os
classes = sorted(os.listdir("path/to/training/data"))
with open("classes.txt", "w") as f:
    f.write("\n".join(classes))
```

---

## How to Run

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Expo Go app installed on your phone
- ngrok installed (ngrok.com/download)

---

### Step 1 — Place model files

Copy these into `artifacts\mobile\backend\`:
- `best_shufflenet_model.pth`
- `classes.txt`

---

### Step 2 — Start the backend

Open **Terminal 1**:
```bash
cd artifacts\mobile\backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

You should see:
```
INFO: Uvicorn running on http://0.0.0.0:8000
INFO: Application startup complete.
```

---

### Step 3 — Start ngrok

Open **Terminal 2**:
```bash
ngrok http 8000
```

Copy the URL shown, e.g.:
```
Forwarding  https://abc123.ngrok-free.app -> localhost:8000
```

---

### Step 4 — Update the API URL

Open `artifacts\mobile\utils\api.ts` and set your ngrok URL:

```ts
const BACKEND_URL =
  Platform.OS === "web"
    ? "http://localhost:8000"
    : "https://abc123.ngrok-free.app";   // ← paste your ngrok URL here
```

---

### Step 5 — Start the Expo app

Open **Terminal 3**:
```bash
cd artifacts\mobile
npm install        # only needed first time
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `w` for browser.

---

### Every Time You Restart

If you restart ngrok or your network changes:
1. Run `ngrok http 8000` again
2. Copy the new URL
3. Update `utils\api.ts` with the new URL
4. Save — app reloads automatically

**Tip:** Create a free ngrok account at ngrok.com to get a fixed URL that never changes.

---

## API Reference

### POST /predict

**Request:** `multipart/form-data` with field `file` (image)

**Response:**
```json
{
  "predictions": [
    { "disease": "Tomato___Early_blight", "confidence": 0.82 },
    { "disease": "Tomato___Septoria_leaf_spot", "confidence": 0.10 },
    { "disease": "Tomato___healthy", "confidence": 0.05 }
  ]
}
```

### GET /healthz

Returns `{"status": "ok"}` if backend is running.

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| "Unable to reach server" | Check ngrok is running and URL in api.ts is current |
| Image not showing on phone | Make sure expo-image is used (not react-native Image) |
| Backend crashes on startup | Check model files exist in backend/ folder |
| Wrong predictions | Verify classes.txt order matches training dataset |
| Phone can't connect | Use ngrok — direct IP rarely works with hotspot |

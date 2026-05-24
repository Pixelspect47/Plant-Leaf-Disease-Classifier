import io
from pathlib import Path
from typing import List

import torch
import torch.nn as nn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
from torchvision import models, transforms

BASE_DIR = Path(__file__).parent

# ── Load class labels ──────────────────────────────────────────────────────
CLASSES_FILE = BASE_DIR / "classes.txt"
if not CLASSES_FILE.exists():
    raise FileNotFoundError(
        f"classes.txt not found at {CLASSES_FILE}. "
        "Place it in the same directory as main.py."
    )

with open(CLASSES_FILE) as f:
    CLASS_NAMES: List[str] = [line.strip() for line in f if line.strip()]

NUM_CLASSES = len(CLASS_NAMES)
print(f"Loaded {NUM_CLASSES} classes from {CLASSES_FILE}")

# ── MobileNetV2 model────────────────────
MODEL_FILE = BASE_DIR / "best_model_mobilenet.pth"
if not MODEL_FILE.exists():
    raise FileNotFoundError(
        f"Model file not found at {MODEL_FILE}. "
        "Place best_model_mobilenet.pth in the same directory as main.py."
    )

model = models.mobilenet_v2(weights=None)

# Replace classifier to match training code:
# model.classifier = nn.Sequential(nn.Dropout(0.4), nn.Linear(model.last_channel, num_classes))
model.classifier = nn.Sequential(
    nn.Dropout(0.4),
    nn.Linear(model.last_channel, NUM_CLASSES)
)

model.load_state_dict(
    torch.load(str(MODEL_FILE), map_location=torch.device("cpu"))
)
model.eval()
print("MobileNetV2 model loaded and ready.")

# ── Preprocessing ──────────────────
TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    ),
])

# ── FastAPI app ────────────────────────────────────────────────────────────
app = FastAPI(title="Plant Leaf Disease Classifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionItem(BaseModel):
    disease: str
    confidence: float


class PredictResponse(BaseModel):
    predictions: List[PredictionItem]


@app.get("/healthz")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Send an image.",
        )

    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file received.")

    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail=f"Cannot decode image: {exc}"
        ) from exc

    tensor = TRANSFORM(image).unsqueeze(0)  # (1, 3, 224, 224)

    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1).squeeze(0)

    top3_probs, top3_indices = torch.topk(probs, k=min(3, NUM_CLASSES))

    predictions = [
        PredictionItem(
            disease=CLASS_NAMES[int(idx)],
            confidence=float(prob),
        )
        for prob, idx in zip(top3_probs.tolist(), top3_indices.tolist())
    ]

    return PredictResponse(predictions=predictions)

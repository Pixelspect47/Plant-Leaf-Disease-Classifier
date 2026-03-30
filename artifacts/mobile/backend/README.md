# Plant Leaf Disease Classifier — Backend

FastAPI backend serving a ShuffleNetV2 PyTorch model trained on 184 plant disease classes.

## Setup

1. Place your model files in this directory:
   - `best_shufflenet_model.pth` — trained ShuffleNetV2 weights
   - `classes.txt` — one class label per line (184 lines, alphabetically sorted)

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Endpoints

- `GET  /healthz` — health check
- `POST /predict` — send an image as `multipart/form-data` with field name `file`

### Response format

```json
{
  "predictions": [
    { "disease": "Tomato___Early_blight", "confidence": 0.82 },
    { "disease": "Tomato___Septoria_leaf_spot", "confidence": 0.10 },
    { "disease": "Tomato___healthy", "confidence": 0.05 }
  ]
}
```

## Notes

- The server uses CPU only — no GPU required.
- Preprocessing: Resize(256) → CenterCrop(224) → ToTensor → Normalize(ImageNet mean/std)
- Model architecture: ShuffleNetV2 x1.0 with 184-class output head

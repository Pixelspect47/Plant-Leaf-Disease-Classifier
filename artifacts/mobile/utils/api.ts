import { Platform } from "react-native";

export interface Prediction {
  disease: string;
  confidence: number;
}

export interface PredictResponse {
  predictions: Prediction[];
}

const API_BASE_URL =
  process.env.EXPO_PUBLIC_DOMAIN
    ? `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`
    : Platform.OS === "web"
      ? "/api"
      : "https://fe9e-103-248-208-100.ngrok-free.app";

export async function predictDisease(image: {
  uri: string;
  type: string;
  name: string;
}): Promise<Prediction[]> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    const response = await fetch(image.uri);
    const blob = await response.blob();
    formData.append("file", blob, image.name);
  } else {
    formData.append("file", {
      uri: image.uri,
      type: image.type,
      name: image.name,
    } as unknown as Blob);
  }

  const url = `${API_BASE_URL}/predict`;
  let res: Response;

  try {
    res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Network error: ${msg}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Server error (${res.status}): ${text}`);
  }

  const rawText = await res.text();
  console.log("Backend response:", rawText.substring(0, 300));

  let data: PredictResponse;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Bad response (not JSON): ${rawText.substring(0, 150)}`);
  }

  return data.predictions;
}

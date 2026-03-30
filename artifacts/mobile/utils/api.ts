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
    : "http://192.168.1.5:8000";

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
    });
  } catch {
    throw new Error(
      "Unable to reach the prediction server. Make sure the backend is running."
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Server error (${res.status}): ${text}`);
  }

  const data: PredictResponse = await res.json();
  return data.predictions;
}

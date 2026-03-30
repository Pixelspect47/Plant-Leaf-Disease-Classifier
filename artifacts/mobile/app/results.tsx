import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

interface Prediction {
  disease: string;
  confidence: number;
}

const RANK_COLORS = [Colors.light.primary, "#1565C0", "#6A1B9A"];
const RANK_BG = ["#E8F5E9", "#E3F2FD", "#F3E5F5"];
const RANK_ICONS: Array<"award" | "star" | "tag"> = ["award", "star", "tag"];

function formatConfidence(c: number) {
  return `${(c * 100).toFixed(1)}%`;
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.barTrack}>
      <View
        style={[
          styles.barFill,
          { width: `${Math.round(value * 100)}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    imageUri: string;
    predictions: string;
  }>();

  const imageUri = params.imageUri ?? "";
  const predictions: Prediction[] = params.predictions
    ? JSON.parse(params.predictions)
    : [];

  const topPadding =
    Platform.OS === "web"
      ? Math.max(insets.top, 67)
      : insets.top + 8;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/home")}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 : insets.bottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {imageUri ? (
          <View style={styles.imageCard}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              contentFit="cover"
            />
            <View style={styles.imageBadge}>
              <Feather name="check-circle" size={14} color="#fff" />
              <Text style={styles.imageBadgeText}>Analyzed</Text>
            </View>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Top Predictions</Text>

        {predictions.map((pred, idx) => {
          const isTop = idx === 0;
          const color = RANK_COLORS[idx] ?? Colors.light.text;
          const bg = RANK_BG[idx] ?? Colors.light.border;
          const icon = RANK_ICONS[idx] ?? "tag";

          return (
            <View
              key={idx}
              style={[
                styles.predictionCard,
                isTop && styles.predictionCardTop,
              ]}
            >
              {isTop && (
                <View style={styles.topBanner}>
                  <Feather name="trending-up" size={12} color={Colors.light.primary} />
                  <Text style={styles.topBannerText}>Highest Confidence</Text>
                </View>
              )}
              <View style={styles.predictionHeader}>
                <View style={[styles.rankBadge, { backgroundColor: bg }]}>
                  <Feather name={icon} size={18} color={color} />
                  <Text style={[styles.rankText, { color }]}>
                    #{idx + 1}
                  </Text>
                </View>
                <View style={styles.predictionInfo}>
                  <Text
                    style={[
                      styles.diseaseName,
                      isTop && styles.diseaseNameTop,
                    ]}
                    numberOfLines={2}
                  >
                    {pred.disease.replace(/_/g, " ")}
                  </Text>
                  <Text style={[styles.confidenceText, { color }]}>
                    {formatConfidence(pred.confidence)}
                  </Text>
                </View>
              </View>
              <ConfidenceBar value={pred.confidence} color={color} />
            </View>
          );
        })}

        {predictions.length === 0 && (
          <View style={styles.emptyCard}>
            <Feather name="alert-circle" size={36} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No predictions available</Text>
          </View>
        )}

        <View style={styles.disclaimerCard}>
          <Feather name="info" size={16} color={Colors.light.textSecondary} />
          <Text style={styles.disclaimerText}>
            AI predictions are for guidance only. Consult an agronomist for
            definitive diagnosis.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={() => router.push("/home")}
          activeOpacity={0.85}
        >
          <Feather name="refresh-cw" size={18} color="#fff" />
          <Text style={styles.tryAgainText}>Try Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    fontFamily: "Inter_600SemiBold",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  imageCard: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 20,
  },
  imageBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.light.text,
    fontFamily: "Inter_700Bold",
  },
  predictionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  predictionCardTop: {
    borderColor: Colors.light.primaryLight,
    borderWidth: 2,
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.12,
  },
  topBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  topBannerText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Inter_600SemiBold",
  },
  predictionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rankText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  predictionInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
    fontFamily: "Inter_600SemiBold",
    textTransform: "capitalize",
  },
  diseaseNameTop: {
    fontSize: 17,
  },
  confidenceText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  barTrack: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
  },
  emptyCard: {
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
  },
  disclaimerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  tryAgainButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  tryAgainText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});

import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/colors";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const topPadding =
    Platform.OS === "web"
      ? Math.max(insets.top, 67)
      : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <View style={styles.backgroundCircle3} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Feather name="camera" size={52} color={Colors.light.primary} />
          </View>
          <View style={styles.iconBadge}>
            <Feather name="zap" size={14} color="#fff" />
          </View>
        </View>

        <Text style={styles.title}>Plant Leaf{"\n"}Disease Classifier</Text>
        <Text style={styles.subtitle}>Detect plant diseases using AI</Text>

        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <Feather name="camera" size={20} color={Colors.light.primary} />
            <Text style={styles.featureText}>Camera</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.feature}>
            <Feather name="image" size={20} color={Colors.light.primary} />
            <Text style={styles.featureText}>Gallery</Text>
          </View>
          <View style={styles.featureDivider} />
          <View style={styles.feature}>
            <Feather name="cpu" size={20} color={Colors.light.primary} />
            <Text style={styles.featureText}>AI Analysis</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/home")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Feather name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Powered by MobileNetV2 · 184 plant disease classes
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: "space-between",
  },
  backgroundCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.light.primaryLight,
    opacity: 0.07,
    top: -80,
    right: -80,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.light.accent,
    opacity: 0.08,
    bottom: 120,
    left: -60,
  },
  backgroundCircle3: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.light.primary,
    opacity: 0.05,
    bottom: -40,
    right: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    position: "relative",
    marginBottom: 36,
  },
  iconBg: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: Colors.light.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: 44,
    marginBottom: 12,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 17,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: "Inter_400Regular",
  },
  featuresRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  feature: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  featureDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
  },
  featureText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_500Medium",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    gap: 12,
    alignItems: "center",
  },
  button: {
    width: "100%",
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
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    opacity: 0.7,
  },
});

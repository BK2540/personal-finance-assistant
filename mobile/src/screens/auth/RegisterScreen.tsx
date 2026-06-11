import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  COMPONENT,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SHADOW,
  SPACING,
} from "../../constants/theme";
import { useAuthStore } from "../../store/authStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParams } from "../../navigation/AuthStack";
import { authAPI } from "../../services/api";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParams, "Login">;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [fullnameFocused, setFullnameFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState("");

  const setToken = useAuthStore((s) => s.setToken);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Email and password required");
      return; // ← added
    }
    if (password !== confirm) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    console.log(email, fullName, password);

    setLoading(true);
    try {
      const res = await authAPI.register(
        email.trim().toLowerCase(),
        password,
        fullName || undefined,
      );
      await setToken(res.data.access_token);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Registration failed.";
      console.log(err);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.canGoBack() && navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.flexWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Spacer — pushes card to lower half */}
        <View style={styles.flex} />

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Set up your Sage account in a minute.
          </Text>

          {/* full name */}
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={[styles.input, fullnameFocused && styles.inputFocused]}
            placeholder="your full name"
            placeholderTextColor={COLORS.ink2}
            autoCapitalize="none"
            autoCorrect={false}
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setFullnameFocused(true)}
            onBlur={() => setFullnameFocused(false)}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailFocused && styles.inputFocused]}
            placeholder="you@email.com"
            placeholderTextColor={COLORS.ink2}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <Pressable
            style={[styles.inputRow, passwordFocused && styles.inputFocused]}
          >
            <TextInput
              style={styles.inputRowInner}
              placeholder="At least 8 characters"
              placeholderTextColor={COLORS.ink2}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={8}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.ink2}
              />
            </TouchableOpacity>
          </Pressable>

          {/* confirm password */}
          <Text style={styles.label}>Confirm password</Text>
          <Pressable
            style={[styles.inputRow, confirmFocused && styles.inputFocused]}
          >
            <TextInput
              style={styles.inputRowInner}
              placeholder="Re-Enter password"
              placeholderTextColor={COLORS.ink2}
              secureTextEntry={!showConfirmPassword}
              value={confirm}
              onChangeText={setConfirm}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((v) => !v)}
              hitSlop={8}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.ink2}
              />
            </TouchableOpacity>
          </Pressable>

          {/* Login button */}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              loading && { opacity: COMPONENT.primaryButton.disabledOpacity },
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Create account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Spacer — pushes footer to bottom */}
        <View style={styles.flex} />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flexWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  flex: {
    height: "10%",
  },
  backBtn: {
    marginTop: SPACING.sm,
    marginLeft: SPACING.lg,
    ...COMPONENT.roundedButton,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.card,
    marginHorizontal: SPACING.lg,
    padding: COMPONENT.cardPadding,
    ...SHADOW.card,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.extraBold,
    color: COLORS.electric,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.ink2,
    marginBottom: SPACING.lg,
  },

  // ── Inputs ────────────────────────────────────────────────────────────────
  label: {
    fontSize: FONT_SIZE.label,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.ink,
    marginBottom: 6,
  },
  input: {
    height: COMPONENT.minTouchTarget,
    borderWidth: 1,
    borderColor: COLORS.borderAlpha,
    borderRadius: RADIUS.button,
    paddingHorizontal: 14,
    fontSize: FONT_SIZE.body,
    color: COLORS.ink,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  inputRow: {
    height: COMPONENT.minTouchTarget,
    borderWidth: 1,
    borderColor: COLORS.borderAlpha,
    borderRadius: RADIUS.button,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  inputRowInner: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    color: COLORS.ink,
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: COLORS.electric,
    ...SHADOW.focusRing,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  primaryBtn: {
    height: COMPONENT.primaryButton.height,
    backgroundColor: COMPONENT.primaryButton.bg,
    borderRadius: COMPONENT.primaryButton.radius,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW.button,
  },
  primaryBtnText: {
    color: COMPONENT.primaryButton.textColor,
    fontSize: COMPONENT.primaryButton.fontSize,
    fontWeight: COMPONENT.primaryButton.fontWeight,
  },
  forgotWrap: {
    marginTop: SPACING.md,
    alignItems: "center",
  },
  forgotText: {
    fontSize: FONT_SIZE.label,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.electric,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // paddingVertical: SPACING.xl,
    marginVertical: 32,
  },
  footerText: {
    fontSize: FONT_SIZE.label,
    color: COLORS.ink2,
  },
  footerLink: {
    fontSize: FONT_SIZE.label,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.electric,
  },
});

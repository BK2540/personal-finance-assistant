import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { authAPI } from "../../services/api";
import {
  COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SHADOW,
  SPACING,
  COMPONENT,
} from "../../constants/theme";
import { AuthStackParams } from "../../navigation/AuthStack";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParams, "Login">;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  const setToken = useAuthStore((s) => s.setToken);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await authAPI.login(email.trim().toLowerCase(), password);
      await setToken(data.access_token);
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Login failed. Please try again.";
      Alert.alert("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.canGoBack() && navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.spacer} />

          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Log in to pick up where you left off.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="you@email.com"
              placeholderTextColor={COLORS.ink2}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
            />

            <Text style={styles.label}>Password</Text>
            <Pressable
              style={[styles.inputRow, passwordFocused && styles.inputFocused]}
              onPress={() => passwordRef.current?.focus()}
            >
              <TextInput
                ref={passwordRef}
                style={styles.inputRowInner}
                placeholder="••••••••"
                placeholderTextColor={COLORS.ink2}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.ink2}
                />
              </TouchableOpacity>
            </Pressable>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: COMPONENT.primaryButton.disabledOpacity }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.primaryBtnText}>Log in</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotWrap} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  backBtn: {
    marginTop: SPACING.sm,
    marginLeft: SPACING.lg,
    ...COMPONENT.roundedButton,
  },
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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

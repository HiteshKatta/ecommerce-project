import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from '../../assets/styles/signup.styles';
import COLORS from "../../constants/colors";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Signup() {
     const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
   const {user, register, isLoading, token} = useAuthStore();

  
  const router = useRouter();

  const handleSignUp = async  () => {
    const result = await register(username, email, password);
    if (!result.success) {
      Alert.alert("Error", result.error || "Failed to create account");
    } else {
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.push("/") },
      ]);
    }
  }
   
    return (
        <KeyboardAvoidingView
       style={{ flex: 1 }}
       behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // ✅ Add this
       >
           

          <View style={styles.container}>
            <View style={styles.card}>
              {/* HEADER */}
              <View style={styles.header}>
                <Text style={styles.title}>BookCircle</Text>
                <Text style={styles.subtitle}>Share your favorite reads</Text>
              </View>

              <View style={styles.formContainer}>
                {/* USERNAME INPUT */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      placeholderTextColor={COLORS.placeholderText}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                 <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  placeholderTextColor={COLORS.placeholderText}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

                {/* PASSWORD INPUT */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter password"
                      placeholderTextColor={COLORS.placeholderText}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                 <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
              </View>
            </View>
          </View>

        </KeyboardAvoidingView>
    );
}
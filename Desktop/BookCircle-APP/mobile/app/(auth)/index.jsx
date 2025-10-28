import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import styles from '../../assets/styles/login.styles';
import { Link } from "expo-router";
import COLORS from '../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const {isLoading, login} = useAuthStore();


    const handleLogin = async () => {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert("Login Failed", result.error);
      }
    }


    return (
        <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
    

        <View style={styles.container}>
            <View style={styles.topIllustration}>
            <Image
                source={require('../../assets/images/Reading1.png')}
                style={styles.illustrationImage}
                resizeMode="contain"
            />
            </View>
            
            <View style={styles.card}>
            <View style={styles.formContainer}>

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
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>



             <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                {/* LEFT ICON */}
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                {/* INPUT */}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
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

            {/* Login Button */}
             <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>


            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/auth/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>


          
            </View>
         </View>

        </View>
      </KeyboardAvoidingView>
    );
}


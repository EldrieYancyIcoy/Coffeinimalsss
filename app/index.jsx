import { useRouter } from "expo-router"; // ✅ for navigation
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function AuthScreen() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const { register, login } = useAuth();
  const router = useRouter(); // ✅ router instance

  const handleAuth = async () => {
    try {
      if (isSignIn) {
        // 🔑 Login
        await login(email, password);
        Alert.alert("Success", "Signed in!");
        router.replace("/tabs/search"); // ✅ go to /tabs/search
      } else {
        // 🆕 Register
        if (password !== confirm) {
          Alert.alert("Error", "Passwords do not match");
          return;
        }
        await register(name, email, password);
        Alert.alert("Success", "Account created! Please sign in.");

        // ✅ Switch back to Sign In screen & reset form
        setIsSignIn(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
      }
    } catch (error) {
      Alert.alert("Auth Error", error.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>☕ Coffeinimals</Text>

      <Text style={styles.title}>
        {isSignIn ? "Welcome Back" : "Create Account"}
      </Text>
      <Text style={styles.subtitle}>
        {isSignIn
          ? "Sign in to continue your coffee journey"
          : "Sign up and explore your coffee flavors"}
      </Text>

      {/* Name input (Sign Up only) */}
      {!isSignIn && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
      )}

      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Confirm password (Sign Up only) */}
      {!isSignIn && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
      )}

      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isSignIn ? "Sign In" : "Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* Switch between Sign In / Sign Up */}
      <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
        <Text style={styles.switchText}>
          {isSignIn
            ? "Don’t have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#6b4226",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6b4226",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  switchText: {
    marginTop: 18,
    fontSize: 14,
    color: "#6b4226",
    textAlign: "center",
  },
});

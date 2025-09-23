// AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebaseConfig";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load stored user when app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch (err) {
        console.log("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  // Register a new user
  const register = async (name, email, password) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) throw new Error("Email already exists");

    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
      password,
      favorites: [],
    });

    const newUser = { id: docRef.id, name, email, favorites: [] };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
  };

  // Login existing user
  const login = async (email, password) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", email),
      where("password", "==", password)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error("Invalid email or password");

    const userData = snapshot.docs[0].data();
    const userId = snapshot.docs[0].id;

    const loggedUser = { id: userId, ...userData };
    setUser(loggedUser);
    await AsyncStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  // 🔹 Update user favorites
  const updateFavorites = async (favorites) => {
    if (!user?.id) return;
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { favorites });
    const updatedUser = { ...user, favorites };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // 🔹 Update user profile (name & email)
  const updateProfile = async ({ name, email }) => {
    if (!user?.id) throw new Error("No user logged in");

    const userRef = doc(db, "users", user.id);

    // Update Firestore
    await updateDoc(userRef, { name, email });

    // Update local state + storage
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser;
  };

  // Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        updateFavorites,
        updateProfile, // 👈 make it available
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

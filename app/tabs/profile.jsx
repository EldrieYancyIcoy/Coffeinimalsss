import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();

  // Local state for modal and form fields
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Confirm logout
  const confirmLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
  try {
    await updateProfile({ name, email });
    Alert.alert("Profile Updated", "Your changes were saved!");
    setModalVisible(false);
  } catch (err) {
    Alert.alert("Error", err.message);
  }
};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top section */}
      <View style={styles.centerContent}>
        {/* Coffee Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="cafe" size={100} color={colors.accent} />
        </View>

        {/* Name */}
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.name || "Guest"}
        </Text>

        {/* Email */}
        <Text style={[styles.email, { color: colors.subText }]}>
          @{user?.email || "No email"}
        </Text>

        {/* Edit Profile button */}
        <TouchableOpacity
          style={[styles.fullWidthButton, { backgroundColor: colors.accent }]}
          onPress={handleEditProfile}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Toggle Theme Button */}
        <TouchableOpacity
          style={[styles.fullWidthButton, { backgroundColor: colors.accent }]}
          onPress={toggleTheme}
        >
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>
            {isDark ? "Light Mode" : "Dark Mode"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom section */}
      <View style={{ width: "100%" }}>
        {/* Logout button */}
        <TouchableOpacity
          style={[styles.fullWidthButton, styles.logoutButton]}
          onPress={confirmLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
        <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Profile
            </Text>

            {/* Name Label + Input */}
            <Text style={[styles.label, { color: colors.text }]}>Name</Text>
            <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.accent }]}
                placeholder="Enter name"
                placeholderTextColor={colors.subText}
                value={name}
                onChangeText={setName}
            />

            {/* Email Label + Input */}
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.accent }]}
                placeholder="Enter email"
                placeholderTextColor={colors.subText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            {/* Save + Cancel */}
            <View style={styles.modalButtons}>
                <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.accent }]}
                onPress={handleSaveProfile}
                >
                <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                >
                <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  centerContent: {
    alignItems: "center",
    width: "100%",
    paddingTop: 50,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  email: { fontSize: 16, marginBottom: 30 },
  fullWidthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#d9534f",
    marginBottom: 0,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#d9534f",
  },
  label: {
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 6,
},

});

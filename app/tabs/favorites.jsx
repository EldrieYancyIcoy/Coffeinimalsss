import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { allItems } from "../../data/allItems"; // import your items list
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { user, updateFavorites } = useAuth();

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  if (!user) return null; // optional: handle null user

  const getItemDetails = (name) => allItems.find((item) => item.name === name);

  // Delete a favorite
  const handleDelete = async (itemToDelete) => {
    if (!user?.favorites) return;
    const updated = user.favorites.filter((f) => f !== itemToDelete);
    await updateFavorites(updated); // update Firestore + AsyncStorage
    setDeleteItem(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>❤️ Favorites & Collections</Text>

      <FlatList
        data={user.favorites || []}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        renderItem={({ item }) => {
          const details = getItemDetails(item);
          return (
            <TouchableOpacity
              style={[styles.item, { backgroundColor: colors.card }]}
              onPress={() => setSelectedItem(details)}
              onLongPress={() => setDeleteItem(item)}
            >
              <Text style={{ color: colors.text, fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.subText, fontSize: 16 }}>No favorites added yet.</Text>
          </View>
        }
      />

      {/* Item Details Modal */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedItem?.name}</Text>
            <Text style={{ color: colors.subText, marginBottom: 20 }}>{selectedItem?.description}</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.accent }]}
              onPress={() => setSelectedItem(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={!!deleteItem}
        animationType="fade"
        transparent
        onRequestClose={() => setDeleteItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Delete "{deleteItem}"?
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.accent, flex: 1, marginRight: 10 }]}
                onPress={() => handleDelete(deleteItem)}
              >
                <Text style={styles.closeButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: "#999", flex: 1 }]}
                onPress={() => setDeleteItem(null)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  item: { padding: 14, borderRadius: 8, marginBottom: 10 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  closeButton: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

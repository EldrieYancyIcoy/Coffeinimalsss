import { useState } from "react";
import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const { user, updateFavorites } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const cardSize = (screenWidth - 48) / 2; // two columns with spacing

  const categories = [
    { name: "🍓 Fruity", description: "Bright and refreshing flavors inspired by fruits like berries, citrus, and tropical fruits. They add sweetness and tanginess to coffee." },
    { name: "🌰 Nutty", description: "Warm, earthy notes resembling nuts such as hazelnut, almond, and pecan. Often found in flavored lattes and mochas." },
    { name: "🌸 Floral", description: "Delicate, aromatic flavors such as rose, jasmine, and lavender. These bring a fragrant and sophisticated touch." },
    { name: "🍫 Chocolatey", description: "Rich cocoa flavors ranging from sweet milk chocolate to intense dark chocolate. Perfect for mochas and dessert coffees." },
    { name: "🧑‍🍳 Spiced", description: "Bold and warming flavors from spices like cinnamon, cardamom, nutmeg, and ginger. Popular in chai lattes and seasonal drinks." },
    { name: "🍮 Creamy", description: "Smooth and indulgent flavors such as vanilla, caramel, and Irish cream. They add sweetness and richness to beverages." },
    { name: "🥥 Exotic", description: "Unique flavors like coconut, taro, and matcha. These create adventurous and exciting coffee experiences." },
    { name: "☕ Classic", description: "Timeless and familiar flavors like plain espresso, milk, and sugar. They highlight the pure taste of coffee itself." },
  ];

  const handleAddToFavorites = async () => {
    if (!selectedCategory || !user?.id) return;

    const newFavorites = user.favorites ? [...user.favorites] : [];
    if (!newFavorites.includes(selectedCategory.name)) {
      newFavorites.unshift(selectedCategory.name);
      await updateFavorites(newFavorites);
    }

    setAddModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>📂 Flavor Categories</Text>

      <FlatList
        data={categories}
        numColumns={2}
        key={"2"}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card, shadowColor: colors.text, width: cardSize, height: cardSize },
            ]}
            onPress={() => setSelectedCategory(item)}
            onLongPress={() => {
              setSelectedCategory(item);
              setAddModalVisible(true);
            }}
          >
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600", textAlign: "center" }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Category Detail Modal */}
      <Modal
        visible={!!selectedCategory && !addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedCategory(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedCategory?.name}</Text>
            <Text style={{ color: colors.subText, marginBottom: 20 }}>{selectedCategory?.description}</Text>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.accent }]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add to Favorites Modal */}
      <Modal
        visible={addModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.addModalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.text, marginBottom: 10 }]}>
                Add "{selectedCategory?.name}" to Favorites?
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.accent }]}
                  onPress={handleAddToFavorites}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#d9534f" }]}
                  onPress={() => setAddModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 16, textAlign: "center" },
  card: { borderRadius: 12, justifyContent: "center", alignItems: "center", shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", padding: 20, borderRadius: 12, alignItems: "center" },
  addModalContent: { width: "80%", padding: 20, borderRadius: 12, alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  closeButton: { paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10, width: "100%" },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

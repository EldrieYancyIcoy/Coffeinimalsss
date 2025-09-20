import { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export default function SearchScreen() {
  const { colors } = useTheme();
  const { user, updateFavorites } = useAuth();

  const [query, setQuery] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const flavors = [
  { name: "Vanilla", icon: "🌼", description: "A classic sweet and creamy flavor derived from vanilla beans." },
  { name: "Chocolate", icon: "🍫", description: "Rich and indulgent, made from cacao beans." },
  { name: "Strawberry", icon: "🍓", description: "Sweet and fruity flavor from fresh strawberries." },
  { name: "Matcha", icon: "🍵", description: "Earthy and slightly bitter, made from powdered green tea leaves." },
  { name: "Caramel", icon: "🍮", description: "Sweet, buttery flavor created by heating sugar." },
  { name: "Hazelnut", icon: "🌰", description: "Nutty and slightly sweet, commonly used in coffee creamers." },
  { name: "Mango", icon: "🥭", description: "Tropical and juicy, with a balance of sweetness and tang." },
  { name: "Coconut", icon: "🥥", description: "Creamy, tropical flavor with mild sweetness." },
  { name: "Blueberry", icon: "🫐", description: "Sweet-tart flavor from blueberries." },
  { name: "Pistachio", icon: "🥜", description: "Nutty, slightly sweet flavor from pistachio nuts." },
  { name: "Lemon", icon: "🍋", description: "Tangy and refreshing citrus flavor." },
  { name: "Raspberry", icon: "🍇", description: "Sweet and tart berry flavor." },
  { name: "Coffee", icon: "☕", description: "Rich, bold flavor made from roasted coffee beans." },
  { name: "Almond", icon: "🌰", description: "Nutty and subtly sweet flavor from almonds." },
  { name: "Banana", icon: "🍌", description: "Sweet and creamy tropical fruit flavor." },
  { name: "Chai", icon: "🫖", description: "Spiced tea flavor with cinnamon, cardamom, and cloves." },
  { name: "Ginger", icon: "🫚", description: "Warm, slightly spicy flavor." },
  { name: "Honey", icon: "🍯", description: "Sweet and floral flavor from natural honey." },
  { name: "Mint", icon: "🌿", description: "Refreshing and cooling flavor." },
  { name: "Peach", icon: "🍑", description: "Sweet, juicy flavor from ripe peaches." },
  { name: "Pear", icon: "🍐", description: "Mildly sweet and delicate flavor from pears." },
  { name: "Plum", icon: "🍑", description: "Sweet-tart flavor from plums." },
  { name: "Blackberry", icon: "🍇", description: "Rich and tangy berry flavor." },
  { name: "Cinnamon", icon: "🌰", description: "Warm, spicy flavor from cinnamon bark." },
  { name: "Pumpkin", icon: "🎃", description: "Sweet and earthy fall-inspired flavor." },
  { name: "Maple", icon: "🍁", description: "Sweet flavor from maple syrup." },
  { name: "Orange", icon: "🍊", description: "Citrus-flavored, tangy and refreshing." },
  { name: "Lychee", icon: "🫐", description: "Sweet tropical flavor from lychee fruit." },
  { name: "Taro", icon: "🍠", description: "Earthy, slightly nutty flavor from taro root." },
  { name: "Ube", icon: "🍠", description: "Sweet, vibrant purple yam flavor." },
  { name: "Cherry", icon: "🍒", description: "Sweet and slightly tart flavor from cherries." },
  { name: "Watermelon", icon: "🍉", description: "Juicy, sweet summer fruit flavor." },
  { name: "Kiwi", icon: "🥝", description: "Sweet-tart tropical fruit flavor." },
  { name: "Passionfruit", icon: "🥭", description: "Tropical, tangy, aromatic flavor." },
  { name: "Cantaloupe", icon: "🍈", description: "Mildly sweet melon flavor." },
  { name: "Grapefruit", icon: "🍊", description: "Citrus flavor with a tangy bite." },
  { name: "Cranberry", icon: "🍇", description: "Slightly tart and fruity flavor." },
  { name: "Blackcurrant", icon: "🫐", description: "Bold, tart berry flavor." },
  { name: "Papaya", icon: "🫛", description: "Tropical, sweet, and juicy flavor." },
  { name: "Dragonfruit", icon: "🐉", description: "Mildly sweet, tropical fruit flavor." },
  { name: "Fig", icon: "🍈", description: "Sweet and earthy fruit flavor." },
];


  const filtered = flavors.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddToFavorites = async () => {
    if (!selectedFlavor || !user?.id) return;

    const newFavorites = user.favorites ? [...user.favorites] : [];
    if (!newFavorites.includes(selectedFlavor.name)) {
      newFavorites.unshift(selectedFlavor.name);
      await updateFavorites(newFavorites);
    }

    setAddModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <TextInput
        style={[styles.searchInput, { borderColor: colors.accent, color: colors.text }]}
        placeholder="Search flavors..."
        placeholderTextColor={colors.subText}
        value={query}
        onChangeText={setQuery}
      />

      {/* Flavor List */}
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={() => setSelectedFlavor(item)}
            onLongPress={() => {
              setSelectedFlavor(item);
              setAddModalVisible(true);
            }}
          >
            <Text style={{ color: colors.text }}>{item.icon} {item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: colors.subText, marginTop: 20, textAlign: "center" }}>
            No flavors found.
          </Text>
        }
      />

      {/* Flavor Modal */}
      <Modal
        visible={!!selectedFlavor && !addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedFlavor(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={styles.modalIcon}>{selectedFlavor?.icon}</Text>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedFlavor?.name}</Text>
            <Text style={{ color: colors.subText, marginBottom: 20 }}>{selectedFlavor?.description}</Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.accent }]}
              onPress={() => setSelectedFlavor(null)}
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
                Add "{selectedFlavor?.name}" to Favorites?
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
  searchInput: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
  item: { padding: 14, borderRadius: 8, marginBottom: 10 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", padding: 20, borderRadius: 12, alignItems: "center" },
  addModalContent: { width: "80%", padding: 20, borderRadius: 12, alignItems: "center" },
  modalIcon: { fontSize: 48, marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  closeButton: { paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10, width: "100%" },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

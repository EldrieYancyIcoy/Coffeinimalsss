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

export default function IngredientsScreen() {
  const { colors } = useTheme();
  const { user, updateFavorites } = useAuth();

  const [query, setQuery] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const ingredients = [
    { name: "Arabica Beans", description: "High-quality coffee beans with a smooth, mild flavor and lower caffeine content." },
    { name: "Robusta Beans", description: "Stronger, more bitter beans with higher caffeine, often used in espresso blends." },
    { name: "Liberica Beans", description: "Rare beans with a woody, smoky flavor profile." },
    { name: "Excelsa Beans", description: "Fruity and tart beans, often used to add depth to blends." },
    { name: "Espresso", description: "Concentrated coffee brewed under pressure, forming the base of many drinks." },
    { name: "Milk", description: "Adds creaminess and sweetness to coffee drinks like lattes and cappuccinos." },
    { name: "Cream", description: "Rich dairy ingredient used for extra indulgence in coffee beverages." },
    { name: "Sugar", description: "Sweetens and balances the bitterness of coffee." },
    { name: "Honey", description: "Natural sweetener with floral notes." },
    { name: "Cinnamon", description: "Spice that adds warmth and sweetness to coffee." },
    { name: "Nutmeg", description: "Aromatic spice that enhances flavor complexity." },
    { name: "Cocoa Powder", description: "Adds a chocolatey note, often sprinkled on cappuccinos." },
    { name: "Vanilla Syrup", description: "Sweet syrup that adds smooth vanilla flavor." },
    { name: "Caramel Syrup", description: "Rich and buttery sweetness for flavored lattes." },
    { name: "Hazelnut Syrup", description: "Nutty and sweet, popular in flavored coffee." },
    { name: "Almond Milk", description: "Plant-based milk with a nutty flavor." },
    { name: "Soy Milk", description: "Creamy plant-based milk, often used as a dairy substitute." },
    { name: "Oat Milk", description: "Smooth, slightly sweet non-dairy milk popular in lattes." },
    { name: "Coconut Milk", description: "Tropical plant-based milk with mild sweetness." },
    { name: "Whipped Cream", description: "Adds a sweet, fluffy topping to coffee drinks." },
    { name: "Ice", description: "Used for iced coffee and cold brews." },
    { name: "Cardamom", description: "Spice with citrusy, herbal notes, popular in Middle Eastern coffee." },
    { name: "Cloves", description: "Strong spice with warming flavor, used in spiced coffee blends." },
    { name: "Ginger", description: "Adds warmth and a slight zing to coffee drinks." },
    { name: "Peppermint Syrup", description: "Minty syrup, often used in holiday coffee drinks." },
    { name: "Maple Syrup", description: "Natural sweetener with a rich, caramel-like taste." },
    { name: "Brown Sugar", description: "Sweetener with a deeper molasses flavor." },
    { name: "Molasses", description: "Thick syrup with bittersweet notes." },
    { name: "Chocolate Chips", description: "Used in mochas and dessert-style coffees." },
    { name: "Cocoa Nibs", description: "Crunchy, slightly bitter chocolate pieces for garnish." },
    { name: "Orange Zest", description: "Citrusy peel that adds brightness to coffee." },
    { name: "Lemon Peel", description: "Used in specialty coffee drinks for a citrus twist." },
    { name: "Star Anise", description: "Spice with licorice flavor, used in spiced coffee blends." },
    { name: "Vanilla Bean", description: "Natural vanilla with rich, aromatic sweetness." },
    { name: "Agave Syrup", description: "Plant-based natural sweetener, lighter than honey." },
    { name: "Stevia", description: "Zero-calorie natural sweetener." },
    { name: "Salt", description: "Enhances flavor and reduces bitterness in coffee." },
    { name: "Alcohol (Baileys)", description: "Creamy liqueur often added to coffee for flavor." },
    { name: "Rum", description: "Occasionally added for warmth and sweetness." },
    { name: "Chili Powder", description: "Adds a spicy kick to specialty coffee drinks." },
  ];

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddToFavorites = async () => {
    if (!selectedIngredient || !user?.id) return;

    const newFavorites = user.favorites ? [...user.favorites] : [];
    if (!newFavorites.includes(selectedIngredient.name)) {
      newFavorites.unshift(selectedIngredient.name);
      await updateFavorites(newFavorites);
    }

    setAddModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>🥄 Ingredients Profile</Text>

      <TextInput
        style={[styles.searchInput, { borderColor: colors.accent, color: colors.text }]}
        placeholder="Search ingredients..."
        placeholderTextColor={colors.subText}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={() => setSelectedIngredient(item)}
            onLongPress={() => {
              setSelectedIngredient(item);
              setAddModalVisible(true);
            }}
          >
            <Text style={{ color: colors.text }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: colors.subText, marginTop: 20 }}>No ingredients found.</Text>
        }
      />

      {/* Ingredient Detail Modal */}
      <Modal
        visible={!!selectedIngredient && !addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedIngredient(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedIngredient?.name}</Text>
            <Text style={{ color: colors.subText, marginBottom: 20 }}>{selectedIngredient?.description}</Text>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.accent }]}
              onPress={() => setSelectedIngredient(null)}
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
                Add "{selectedIngredient?.name}" to Favorites?
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
  searchInput: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
  item: { padding: 14, borderRadius: 8, marginBottom: 10 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", padding: 20, borderRadius: 12, alignItems: "center" },
  addModalContent: { width: "80%", padding: 20, borderRadius: 12, alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  closeButton: { paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10, width: "100%" },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

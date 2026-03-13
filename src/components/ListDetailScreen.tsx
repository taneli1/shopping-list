import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ShoppingItem, ShoppingList } from "../types";
import DraggableList from "./DraggableList";

interface Props {
  list: ShoppingList;
  onBack: () => void;
  onAddItem: (name: string, location: string) => void;
  onToggle: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onReorder: (items: ShoppingItem[]) => void;
}

export default function ListDetailScreen({
  list,
  onBack,
  onAddItem,
  onToggle,
  onRemove,
  onReorder,
}: Props) {
  const [itemName, setItemName] = useState("");
  const [itemLocation, setItemLocation] = useState("");

  const handleAdd = () => {
    const trimmed = itemName.trim();
    if (!trimmed) return;
    onAddItem(trimmed, itemLocation.trim());
    setItemName("");
    setItemLocation("");
  };

  const sorted = [...list.items].sort((a, b) => a.order - b.order);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {list.name}
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Item name…"
          value={itemName}
          onChangeText={setItemName}
          returnKeyType="next"
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 6 }]}
          placeholder="Location…"
          value={itemLocation}
          onChangeText={setItemLocation}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Long-press &amp; drag to reorder items</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        <DraggableList
          items={sorted}
          onToggle={onToggle}
          onRemove={onRemove}
          onReorder={onReorder}
        />
        {sorted.length === 0 && (
          <Text style={styles.empty}>No items yet. Add some above!</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: { marginRight: 12 },
  backText: { fontSize: 16, color: "#1a73e8" },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", flex: 1 },
  inputRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  addBtn: {
    marginLeft: 6,
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  hint: {
    textAlign: "center",
    color: "#bbb",
    fontSize: 12,
    paddingVertical: 6,
  },
  scroll: { flex: 1 },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 15,
  },
});

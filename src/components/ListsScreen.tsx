import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ShoppingList } from "../types";

interface Props {
  lists: ShoppingList[];
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
}

export default function ListsScreen({
  lists,
  onSelect,
  onCreate,
  onDelete,
}: Props) {
  const [name, setName] = useState("");

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  };

  const confirmDelete = (id: string, listName: string) => {
    Alert.alert("Delete list", `Delete "${listName}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Lists</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="New list name…"
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleCreate}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
          <Text style={styles.addBtnText}>＋ Create</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(l) => l.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelect(item.id)}
            onLongPress={() => confirmDelete(item.id, item.name)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>
              {item.items.length} items ·{" "}
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No lists yet. Create one to get started!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: "#1a73e8",
  },
  inputRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  cardSub: { fontSize: 13, color: "#888", marginTop: 4 },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 15,
  },
});

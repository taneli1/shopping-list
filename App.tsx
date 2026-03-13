import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useShoppingLists } from "./src/hooks/useShoppingLists";
import ListsScreen from "./src/components/ListsScreen";
import ListDetailScreen from "./src/components/ListDetailScreen";

export default function App() {
  const {
    lists,
    ready,
    createList,
    deleteList,
    addItem,
    toggleItem,
    removeItem,
    reorderItems,
  } = useShoppingLists();

  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  const selectedList = lists.find((l) => l.id === selectedListId) ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {selectedList ? (
        <ListDetailScreen
          list={selectedList}
          onBack={() => setSelectedListId(null)}
          onAddItem={(name, location) =>
            addItem(selectedList.id, name, location)
          }
          onToggle={(itemId) => toggleItem(selectedList.id, itemId)}
          onRemove={(itemId) => removeItem(selectedList.id, itemId)}
          onReorder={(items) => reorderItems(selectedList.id, items)}
        />
      ) : (
        <ListsScreen
          lists={lists}
          onSelect={setSelectedListId}
          onCreate={(name) => {
            const id = createList(name);
            setSelectedListId(id);
          }}
          onDelete={deleteList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

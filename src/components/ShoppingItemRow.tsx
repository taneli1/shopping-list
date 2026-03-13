import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ShoppingItem } from "../types";

interface Props {
  item: ShoppingItem;
  onToggle: () => void;
  onRemove: () => void;
}

export default function ShoppingItemRow({ item, onToggle, onRemove }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onToggle} style={styles.checkArea}>
        <Text style={styles.check}>{item.checked ? "☑" : "☐"}</Text>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text
          style={[styles.name, item.checked && styles.checkedName]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        {item.location ? (
          <Text style={styles.location} numberOfLines={1}>
            📍 {item.location}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  checkArea: {
    marginRight: 12,
    padding: 4,
  },
  check: {
    fontSize: 22,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: "#222",
  },
  checkedName: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  location: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  removeBtn: {
    padding: 8,
  },
  removeText: {
    fontSize: 18,
    color: "#c62828",
  },
});

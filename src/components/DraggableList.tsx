import React, { useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { ShoppingItem } from "../types";
import ShoppingItemRow from "./ShoppingItemRow";

const ROW_HEIGHT = 62;

interface Props {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (items: ShoppingItem[]) => void;
}

export default function DraggableList({
  items,
  onToggle,
  onRemove,
  onReorder,
}: Props) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const currentOrder = useRef<ShoppingItem[]>(items);
  const dragY = useRef(new Animated.Value(0)).current;
  const dragIndex = useRef<number>(-1);

  // Keep a mutable copy in sync
  React.useEffect(() => {
    currentOrder.current = items;
  }, [items]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderGrant: (evt, _g) => {
        const locationY = evt.nativeEvent.locationY;
        const idx = Math.floor(locationY / ROW_HEIGHT);
        if (idx < 0 || idx >= currentOrder.current.length) {
          dragIndex.current = -1;
          dragging.current = null;
          return;
        }
        dragIndex.current = idx;
        setDraggingIndex(idx);
        dragY.setValue(0);
      },
      onPanResponderMove: (evt, g) => {
        dragY.setValue(g.dy);
        const from = dragIndex.current;
        const locationY = evt.nativeEvent.locationY;
        const to = Math.max(
          0,
          Math.min(
            currentOrder.current.length - 1,
            Math.floor(locationY / ROW_HEIGHT)
          )
        );
        if (from !== to && from >= 0) {
          const arr = [...currentOrder.current];
          const [moved] = arr.splice(from, 1);
          arr.splice(to, 0, moved);
          currentOrder.current = arr;
          dragIndex.current = to;
        }
      },
      onPanResponderRelease: () => {
        setDraggingIndex(null);
        dragY.setValue(0);
        onReorder(currentOrder.current);
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {items.map((item, index) => {
        const isDragging = draggingIndex === index;
        return (
          <Animated.View
            key={item.id}
            style={[
              styles.row,
              isDragging && {
                transform: [{ translateY: dragY }],
                elevation: 6,
                zIndex: 100,
                backgroundColor: "#e8f0fe",
              },
            ]}
          >
            <ShoppingItemRow
              item={item}
              onToggle={() => onToggle(item.id)}
              onRemove={() => onRemove(item.id)}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    height: ROW_HEIGHT,
    justifyContent: "center",
  },
});

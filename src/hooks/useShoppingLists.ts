import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  loadLists,
  saveLists,
  loadSavedItems,
  saveSavedItems,
} from "../storage/storage";
import { ShoppingItem, ShoppingList, SavedItem } from "../types";

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      const [storedLists, storedSaved] = await Promise.all([
        loadLists(),
        loadSavedItems(),
      ]);
      setLists(storedLists);
      setSavedItems(storedSaved);
      setReady(true);
    })();
  }, []);

  // Persist whenever lists change
  useEffect(() => {
    if (ready) saveLists(lists);
  }, [lists, ready]);

  useEffect(() => {
    if (ready) saveSavedItems(savedItems);
  }, [savedItems, ready]);

  /** Create a new list pre-populated with all remembered items */
  const createList = useCallback(
    (name: string) => {
      const items: ShoppingItem[] = [...savedItems]
        .sort((a, b) => a.order - b.order)
        .map((si, idx) => ({
          id: uuidv4(),
          name: si.name,
          location: si.location,
          checked: false,
          order: idx,
        }));
      const newList: ShoppingList = {
        id: uuidv4(),
        name,
        createdAt: new Date().toISOString(),
        items,
      };
      setLists((prev) => [newList, ...prev]);
      return newList.id;
    },
    [savedItems]
  );

  const deleteList = useCallback((listId: string) => {
    setLists((prev) => prev.filter((l) => l.id !== listId));
  }, []);

  /** Add an item to a list and remember it for future lists */
  const addItem = useCallback(
    (listId: string, name: string, location: string) => {
      setLists((prev) =>
        prev.map((list) => {
          if (list.id !== listId) return list;
          const order = list.items.length;
          const newItem: ShoppingItem = {
            id: uuidv4(),
            name,
            location,
            checked: false,
            order,
          };
          return { ...list, items: [...list.items, newItem] };
        })
      );
      // Remember item for future lists
      setSavedItems((prev) => {
        const exists = prev.find(
          (i) => i.name.toLowerCase() === name.toLowerCase()
        );
        if (exists) {
          return prev.map((i) =>
            i.name.toLowerCase() === name.toLowerCase()
              ? { ...i, location }
              : i
          );
        }
        return [...prev, { name, location, order: prev.length }];
      });
    },
    []
  );

  const toggleItem = useCallback((listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  }, []);

  const removeItem = useCallback((listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.filter((item) => item.id !== itemId),
        };
      })
    );
  }, []);

  /** Reorder items after drag-and-drop */
  const reorderItems = useCallback(
    (listId: string, reordered: ShoppingItem[]) => {
      const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId ? { ...list, items: updated } : list
        )
      );
      // Also update saved items order to match
      setSavedItems((prev) => {
        const newSaved = [...prev];
        updated.forEach((item) => {
          const idx = newSaved.findIndex(
            (s) => s.name.toLowerCase() === item.name.toLowerCase()
          );
          if (idx !== -1) {
            newSaved[idx] = { ...newSaved[idx], order: item.order };
          }
        });
        return newSaved;
      });
    },
    []
  );

  return {
    lists,
    savedItems,
    ready,
    createList,
    deleteList,
    addItem,
    toggleItem,
    removeItem,
    reorderItems,
  };
}

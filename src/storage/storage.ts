import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShoppingList, SavedItem } from "../types";

const LISTS_KEY = "@shopping_lists";
const SAVED_ITEMS_KEY = "@saved_items";

// --------------- Shopping Lists ---------------

export async function loadLists(): Promise<ShoppingList[]> {
  const json = await AsyncStorage.getItem(LISTS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveLists(lists: ShoppingList[]): Promise<void> {
  await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
}

// --------------- Saved Items (templates) ---------------

export async function loadSavedItems(): Promise<SavedItem[]> {
  const json = await AsyncStorage.getItem(SAVED_ITEMS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveSavedItems(items: SavedItem[]): Promise<void> {
  await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(items));
}

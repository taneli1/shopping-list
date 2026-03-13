export interface ShoppingItem {
  id: string;
  name: string;
  location: string;
  checked: boolean;
  order: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  items: ShoppingItem[];
}

/** A saved item template that remembers name + location + order */
export interface SavedItem {
  name: string;
  location: string;
  order: number;
}

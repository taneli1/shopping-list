# Shopping List

An Expo (React Native) Android shopping list app that remembers items and their store locations. When you create a new list, previously added items appear in the same order automatically.

## Features

- **Persistent items & locations** – items and their locations are saved locally with AsyncStorage
- **Automatic population** – new lists are pre-filled with all remembered items in their saved order
- **Drag to reorder** – long-press and drag items to rearrange; order is remembered for future lists
- **Simple UI** – check off items, remove them, and manage multiple lists
- **Fully offline** – all data stored on-device

## Getting started

```bash
npm install
npx expo start
```

## Build (Android APK)

The GitHub Actions workflow **Build Android APK** can be triggered manually from the Actions tab to produce a standalone `.apk`.
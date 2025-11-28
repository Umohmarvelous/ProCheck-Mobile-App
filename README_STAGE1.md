# STAGE 1 — Project scaffolding (React Native + TypeScript)

Files were added to initialize the app architecture for Stage 1.

What I added

- `App.tsx` — root app that wires Redux Provider + PersistGate and navigation.
- `src/store/*` — Redux Toolkit store and a `todo` slice with redux-persist configured.
- `src/navigation/AppNavigator.tsx` — Stack + Bottom Tabs wiring.
- `app/screens/{Home,Workspace,Settings}.tsx` — three tab screen placeholders (glass style using `expo-blur`).
- `app/SplashScreen.tsx` — simple splash view with shimmer animation placeholder.
- `src/utils/sqlite.ts` — small SQLite helper (expo-sqlite) and table creation.
- `src/services/tflite.ts` — placeholder for on-device TF Lite integration.
- `server/` — minimal Node.js + Express scaffold with Postgres pool and a WebSocket server.

Next steps / Install

1. From the project root, install runtime/native dependencies. Example list (choose yarn or npm):

- @reduxjs/toolkit
- react-redux
- redux-persist
- @react-native-async-storage/async-storage
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs
- expo-blur
- expo-sqlite
- react-native-screens
- react-native-safe-area-context

For the server (dev) you can install: express, pg, ws

2. Run the app (Expo / React Native) as you normally do for this project (e.g. `expo start`).

Notes

- These files are lightweight scaffolds and reference packages that may not yet be installed — install the deps above.
- I intentionally kept the TF Lite and FCM pieces as placeholders — real integration depends on your chosen native setup or Expo bare workflow.

Suggested next tasks

- install and pin the dependencies and run a quick typecheck/build
- wire a sample todo CRUD UI to demonstrate store + sqlite persistence

Tests

- I added a small test suite for the `todo` slice under `__tests__/todoSlice.test.ts` (Jest). To run tests after installing dev deps, add:

```bash
# install jest + ts-jest + types
yarn add -D jest ts-jest @types/jest

# run tests
yarn jest
```

Notes on verification

- After installing the packages listed in this README you should be able to start the app (`expo start`) and see the Home tab. The Home screen now contains a small todo CRUD UI that persists to SQLite and syncs to the Redux store.

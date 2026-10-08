# 🛍️ Luxury Cosmetic E-Commerce Mobile App

A high-performance, studio-grade React Native e-commerce mobile application built for browsing, filtering, and purchasing from top cosmetic brands. Powered by the [Makeup API](http://makeup-api.herokuapp.com/) with real-time multi-dimensional filtering, interactive range sliders, quick-return collapsible headers, and persistent bag state.

---

## 🚀 Steps to Run the Project

### Prerequisites
Before starting, ensure your development environment is set up according to the official [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) guide for **React Native CLI**:
- **Node.js**: `>= 22.11.0`
- **JDK**: OpenJDK 17
- **Android Studio**: Android SDK, Command-line Tools, and an Android Emulator / Physical Device with USB Debugging enabled.
- **macOS (for iOS)**: Xcode 15+, CocoaPods, and iOS Simulator.

---

### 1. Clone & Navigate
```bash
cd "Ecommerse_app"
```

### 2. Install Dependencies
```bash
npm install
```

> **Note for iOS**: Install CocoaPods dependencies after npm install:
> ```bash
> cd ios && pod install && cd ..
> ```

### 3. Start Metro Dev Server
In your first terminal window, start the Metro bundler:
```bash
npm start
```
*Tip: If you ever need to clear cache, run `npm start -- --reset-cache`.*

### 4. Build and Run the App

#### For Android:
```bash
npm run android
```

#### For iOS:
```bash
npm run ios
```

### 5. Verify TypeScript Integrity
The codebase enforces strict type safety with **0 TypeScript errors**:
```bash
npx tsc --noEmit
```

---

## 📦 Packages Used & Purpose

| Package | Version | Purpose |
| :--- | :---: | :--- |
| **`react`** | `19.2.3` | Core React library powering functional components and hooks. |
| **`react-native`** | `0.86.3` | Core mobile framework with New Architecture support. |
| **`@react-navigation/native`** | `^7.5.0` | Navigation container providing routing lifecycle and state across screens. |
| **`@react-navigation/native-stack`** | `^7.20.0` | Native view controller stack navigator with hardware-accelerated transitions. |
| **`axios`** | `^1.20.0` | Promise-based HTTP networking client configured with interceptors, timeouts, and logging. |
| **`@react-native-async-storage/async-storage`** | `^2.1.2` | Persistent, unencrypted key-value store for user auth sessions and shopping bag cart items. |
| **`react-native-safe-area-context`** | `^5.5.2` | Device notch, dynamic island, status bar, and gesture navigation bar inset handling. |
| **`react-native-gesture-handler`** | `^3.3.0` | Native touch handling providing smooth 60 FPS interactions for range sliders and gestures. |
| **`react-native-screens`** | `^4.28.0` | Native primitives for memory-efficient view controllers and navigation. |
| **`react-native-vector-icons`** | `^10.2.0` | Vector icons with custom graceful SVG/Unicode fallback system. |
| **`react-native-keyboard-controller`** | `^1.16.2` | Advanced keyboard interaction handling preventing inputs from being obscured on mobile. |

---

## ✨ Features & Requirements Breakdown

### 1. Home Page (Brand Catalog)
- Displays brand cards for all **7 mandatory brands**:
  1. **Annabelle** (`annabelle`)
  2. **Covergirl** (`covergirl`)
  3. **Dior** (`dior`)
  4. **Glossier** (`glossier`)
  5. **L'Oréal** (`l'oreal`)
  6. **Maybelline** (`maybelline`)
  7. **Revlon** (`revlon`)
- Tapping any brand card transitions to a **dedicated Brand Page** with custom brand palette styling.
- Features real-time brand search and trending product showcase.

### 2. Dedicated Brand Page
- Fetches brand catalog dynamically using the Makeup API:  
  `https://makeup-api.herokuapp.com/api/v1/products.json?brand=<brand>`
- Product cards render:
  - **Product Name**: Sanitized via `cleanProductName` to strip API newline and whitespace bugs.
  - **Product Image**: Rendered with `ProgressiveImage` featuring loading skeleton and fallback pedestal.
  - **Price**: Formatted with localized currency signs (`$`, `£`, etc.).
  - **Description**: Cleaned of raw HTML markup and trimmed to a 2-line snippet.
- **View Mode Toggle**: Switch between **2-column Grid View** and **Detailed List View**.

### 3. Real-Time Multi-Dimensional Filters
- **Product Type Filter**: All 10 mandatory categories supported:
  - `blush`, `bronzer`, `eyebrow`, `eyeliner`, `eyeshadow`, `foundation`, `lip_liner`, `lipstick`, `mascara`, `nail_polish`
- **Dual-Thumb Price Slider**: Interactive range slider for `price_greater_than` and `price_less_than` (Default: `$0 – $100`).
- **Dual-Thumb Rating Slider**: Interactive range slider for `rating_greater_than` and `rating_less_than` (Default: `0 – 5 ★`).
- **Bonus Search Bar**: Real-time keyword search across product names, categories, and descriptions.
- **Sorting Modes**: Featured, Price: Low to High, Price: High to Low, Top Rated, and Alphabetical (A–Z).

### 4. Quick-Return Collapsible Header
- **Scroll-Down**: The search, filter, and sorting rows collapse smoothly into a bounded container with `overflow: 'hidden'`, giving product cards **100% of the viewport height**.
- **Scroll-Up**: Controls seamlessly glide back into view without any status bar overlap.
- **Status Bar Safety**: Pinned navigation bar (`< Brand items 👜`) with `zIndex: 10` and `elevation: 4` protects the status bar.

### 5. Shopping Bag & Auth Flow
- **Persistent Cart**: Powered by `AsyncStorage` with increment, decrement, and item removal.
- **Isolated Auth State**: Independent loading spinners for email submit vs. Google/Apple/Facebook social sign-in.
- **Custom Modal System**: Eliminates generic native `Alert.alert` with a custom luxury dark dialog.

---

## 📂 Project Directory Structure

```
Ecommerse_app/
├── src/
│   ├── apis/                   # Axios client instance, endpoints & types
│   │   ├── client.ts           # Interceptors, timeouts, and error handling
│   │   └── index.ts            # API services and endpoint definitions
│   ├── components/             # Reusable UI components
│   │   ├── CustomModal/        # Custom popup modal replacing Alert.alert
│   │   ├── Keyboard/           # KeyboardAwareContainer
│   │   ├── ProgressiveImage/   # Skeleton loading & image fallbacks
│   │   ├── RangeSlider/        # Touch-driven dual-thumb range slider
│   │   └── VectorIcon/         # Safe vector icon with fallback
│   ├── context/                # Global React Context providers
│   │   ├── AuthContext.tsx     # Authentication and session persistence
│   │   ├── CartContext.tsx     # Shopping bag cart management
│   │   └── ModalContext.tsx    # Modal notification service
│   ├── navigation/             # React Navigation stack setup & types
│   │   ├── AppNavigator.tsx    # Native stack router
│   │   └── types.ts            # Route parameter TypeScript definitions
│   ├── screens/                # Feature screens (index, style, hook)
│   │   ├── Auth/               # Social and email authentication
│   │   ├── Brand/              # Brand catalog, filters, range sliders
│   │   ├── Cart/               # Shopping bag checkout
│   │   ├── Home/               # 7 cosmetic brand tiles showcase
│   │   ├── ProductDetails/     # Product specs, shade selector, add to bag
│   │   └── Splash/             # Luxury branded splash screen
│   ├── theme/                  # Global color palettes and styling tokens
│   │   └── colors.ts
│   └── utils/                  # Utility helpers
│       └── product.ts          # Price formatter & product name sanitization
├── App.tsx                     # Application entry point with providers
└── package.json
```

---

## 📝 Additional Notes

1. **API Protocol Normalization**: The Makeup API frequently returns protocol-relative image URLs (`//s3.amazonaws.com/...`). Our `resolveProductImageUrl` utility automatically normalizes these to secure `https://` URLs to prevent failed image loads on modern Android/iOS.
2. **Data Sanitization**: Product names returned by the API frequently contain newline characters and up to 28 trailing spaces (e.g., `"\n   Junon   \n"`). The `cleanProductName` helper strips these rogue characters to avoid premature ellipsis truncation.
3. **Client-Side Windowed Virtualization**: The Makeup API does not provide server-side pagination headers. Products are virtualized through optimized React Native `FlatList` with `windowSize={5}`, `initialNumToRender={8}`, and `removeClippedSubviews={true}` for smooth 60 FPS scrolling.
4. **Zero Warning / Zero Red-Line Policy**: The entire codebase compiles cleanly under TypeScript strict mode (`npx tsc --noEmit`).

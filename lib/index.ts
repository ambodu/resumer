// Core utilities
export * from "./utils";
export * from "./types";

// Store and state management
export { makeStore, type RootState, type AppDispatch } from "./store";

// I18n utilities
export {
  getStoredLocale,
  setStoredLocale,
  defaultLocale,
  locales,
} from "./i18n";

// AI and optimization modules removed

// Templates
export * from "./templates";
export * from "./template-metadata";


// 新的优化后的模块
export * from "./storage-manager";
export * from "./pdf-generator";
export * from "./app-hooks";

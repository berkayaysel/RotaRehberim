import { Platform } from "react-native";

const primaryLight = "#2B7A4B";
const primaryDark = "#4CAF50";
const accentLight = "#FF6B35";
const accentDark = "#FF8555";

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#666666",
    textTertiary: "#999999",
    buttonText: "#FFFFFF",
    tabIconDefault: "#BBBBBB",
    tabIconSelected: primaryLight,
    link: primaryLight,
    primary: primaryLight,
    primaryLight: "#4CAF50",
    primaryDark: "#1B5E33",
    accent: accentLight,
    accentLight: "#FF8555",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    border: "#E8E8E8",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
    info: "#2196F3",
    backgroundRoot: "#FAFAFA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    backgroundTertiary: "#EEEEEE",
  },
  dark: {
    text: "#F5F5F5",
    textSecondary: "#B0B0B0",
    textTertiary: "#808080",
    buttonText: "#FFFFFF",
    tabIconDefault: "#606060",
    tabIconSelected: primaryDark,
    link: primaryDark,
    primary: primaryDark,
    primaryLight: "#4CAF50",
    primaryDark: "#1B5E33",
    accent: accentDark,
    accentLight: "#FF8555",
    background: "#121212",
    surface: "#1E1E1E",
    border: "#333333",
    success: "#4CAF50",
    warning: "#FFC107",
    error: "#F44336",
    info: "#2196F3",
    backgroundRoot: "#0A0A0A",
    backgroundDefault: "#121212",
    backgroundSecondary: "#1A1A1A",
    backgroundTertiary: "#252525",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  inputHeight: 48,
  buttonHeight: 48,
  fabSize: 56,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

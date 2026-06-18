// colors.ts
// Paleta de cores do projeto — equivalente a app_colors.dart, light_colors.dart e dark_colors.dart

// Equivalente a AppColors (app_colors.dart)
export const appColors = {
  // Primary colors
  forestGreen: "#01403A",
  sageGreen: "#ADD9B8",
  mintGreen: "#CEF2C4",

  // Accent / Action colors
  limeGreen: "#B5F230",
  lightLime: "#CBF277",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",
  grey50: "#FAFAFA",
  grey100: "#F5F5F5",
  grey200: "#EEEEEE",
  grey300: "#E0E0E0",
  grey600: "#757575",
  grey800: "#424242",
  grey900: "#212121",

  // Status colors
  error: "#D32F2F",
  success: "#388E3C",
  warning: "#FBC02D",
  info: "#1976D2",
} as const;

// Equivalente a LightColors (light_colors.dart)
export const lightColors = {
  primary: appColors.forestGreen,
  onPrimary: appColors.white,

  secondary: appColors.sageGreen,
  onSecondary: appColors.forestGreen,

  accent: appColors.limeGreen,
  onAccent: appColors.forestGreen,

  background: appColors.grey50,
  onBackground: appColors.grey900,

  surface: appColors.mintGreen,
  onSurface: appColors.forestGreen,

  error: appColors.error,
  onError: appColors.white,
} as const;

// Equivalente a DarkColors (dark_colors.dart)
export const darkColors = {
  primary: appColors.sageGreen,
  onPrimary: appColors.forestGreen,

  secondary: appColors.forestGreen,
  onSecondary: appColors.white,

  accent: appColors.limeGreen,
  onAccent: appColors.grey900,

  background: appColors.grey900,
  onBackground: appColors.grey50,

  surface: "#1E2F2C", // Dark variant of forest/sage green
  onSurface: appColors.grey50,

  error: appColors.error,
  onError: appColors.white,
} as const;

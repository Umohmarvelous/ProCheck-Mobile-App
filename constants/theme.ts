/**
 * Glassmorphic Theme System
 * Modern UI design with blur effects, transparency, and layered glass containers
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Glassmorphic Design System
 * Modern UI with blur, transparency, and glass effect containers
 */

export const GlassTheme = {
  // Light mode colors
  light: {
    // background
    background: '#dededeff',

    // Glass containers - semi-transparent with blur
    glassLight: 'rgba(255, 255, 255, 0.7)',
    glassMedium: 'rgba(255, 255, 255, 0.5)',
    glassDark: 'rgba(255, 255, 255, 0.3)',
    
    // Gradient overlays
    glassOverlay: 'rgba(0, 0, 0, 0.08)',
    
    // Primary colors
    primary: '#0a84ff',
    primaryLight: '#5ac8fa',
    

    // Color Palete
    checkerPrimary: '#02be21',
    checkerBackground: '#F4F9F5',
    checkerSurface: '#FFFFFF',
    checkerText: '#1A1C1A',
    checkerTextSecondary: '#6E7570',
    checkerBorder: '#E0E0E0',
    checkerSuccess: '#02be21', // Your green is naturally a success color
    checkerError: '#D32F2F',
    checkerHighlight: '#D1F2D6',



    // Secondary colors
    secondary: '#908fd5ff',
    success: '#7bc18cff',
    warning: '#916931ff',
    danger: '#d86b6dff',
    
    // Text colors
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Borders
    borderLight: 'rgba(0, 0, 0, 0.1)',
    borderMedium: 'rgba(0, 0, 0, 0.2)',
  },

  // Dark mode colors
  dark: {
    // background
    background: '#212121ff',

    // Glass containers - semi-transparent with blur
    glassLight: '#ffffff1a',
    glassMedium: '#ffffff14',
    glassDark: '#ffffff0d',
    
    // Gradient overlays
    glassOverlay: '#ffffff14',
    
    // Primary colors
    primary: '#0a84ff',
    primaryLight: '#5ac8fa',
    
    checkerPrimary: '#02be21',
    checkerBackground: '#121212',
    checkerSurface: '#212121ff',
    checkerText: '#E4E6E4',
    checkerTextMain: '#90afa2ff',
    checkerTextSecondary: '#A0A3A0',
    checkerTextTertiary: '#a9af90',
    checkerBorder: '#6a6a6aff',
    checkerSuccess: '#00E676', // Slightly lighter for visibility on dark
    checkerError: '#EF5350',
    checkerHighlight: '#003309',
    
// 35fb56ad


    // Secondary colors
    secondary: '#5856d6',
    warning: '#ff9500ff',
    danger: '#ff4d4f',
    
    // Text colors
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#393838ff',
    
    // Borders
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderMedium: 'rgba(255, 255, 255, 0.2)',
  },

  // Blur intensity values
  blur: {
    subtle: 10,
    light: 20,
    medium: 40,
    heavy: 60,
    intense: 90,
  },

  // Shadow styles
  shadow: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    heavy: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // Border radius values
  radius: {
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 30,
    extraxLarge: 50,
    round: 9999,
  },

  // Spacing values
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

export default GlassTheme;


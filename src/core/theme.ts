import { Platform, StyleSheet } from 'react-native';

// Paleta de cores
const colorPalette = {
  // Primárias
  primary: '#00A3FF',
  secondary: '#7D5AFF',
  accent: '#FF2D55',
  
  // Tons de cinza
  white: '#FFFFFF',
  gray50: '#F5F5F5',
  gray100: '#E0E0E0',
  gray200: '#BDBDBD',
  gray300: '#9E9E9E',
  gray400: '#757575',
  gray500: '#616161',
  gray600: '#424242',
  gray700: '#303030',
  gray800: '#212121',
  gray900: '#121212',
  black: '#000000',
  
  // Cores de status
  success: '#00C853',
  error: '#FF3B30',
  warning: '#FFC107',
  info: '#00B0FF',
  
  // Cores de fundo (tema escuro)
  background: '#0A0A0A',
  surface: '#121212',
  card: '#1E1E1E',
  
  // Cores de texto (tema escuro)
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#757575',
  
  // Bordas
  border: 'rgba(255, 255, 255, 0.12)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  borderDark: 'rgba(255, 255, 255, 0.2)',
};

export const colors = {
  light: {
    ...colorPalette,
    background: colorPalette.white,
    surface: colorPalette.gray50,
    card: colorPalette.white,
    text: colorPalette.gray900,
    textSecondary: colorPalette.gray700,
    textTertiary: colorPalette.gray600,
    border: colorPalette.gray200,
    borderLight: colorPalette.gray100,
    borderDark: colorPalette.gray300,
  },
  dark: {
    ...colorPalette,
    primary: '#00A3FF',
    background: '#0A0A0A',
    surface: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#757575',
    border: 'rgba(255, 255, 255, 0.12)',
    borderLight: 'rgba(255, 255, 255, 0.08)',
    borderDark: 'rgba(255, 255, 255, 0.2)',
  },
};

// Sistema de espaçamento baseado em 4px (0.25rem)
const baseSpacing = 4;

export const spacing = {
  // Espaçamentos base
  _0: 0,
  _1: baseSpacing * 1,    // 4px
  _2: baseSpacing * 2,    // 8px
  _3: baseSpacing * 3,    // 12px
  _4: baseSpacing * 4,    // 16px
  _5: baseSpacing * 5,    // 20px
  _6: baseSpacing * 6,    // 24px
  _8: baseSpacing * 8,    // 32px
  _10: baseSpacing * 10,  // 40px
  _12: baseSpacing * 12,  // 48px
  _16: baseSpacing * 16,  // 64px
  _20: baseSpacing * 20,  // 80px
  _24: baseSpacing * 24,  // 96px
  _32: baseSpacing * 32,  // 128px
  
  // Aliases para compatibilidade
  xs: baseSpacing * 2,    // 8px
  sm: baseSpacing * 3,    // 12px
  md: baseSpacing * 4,    // 16px
  lg: baseSpacing * 6,    // 24px
  xl: baseSpacing * 8,    // 32px
  xxl: baseSpacing * 12,  // 48px
};

// Bordas arredondadas
export const borderRadius = {
  none: 0,
  xs: baseSpacing * 0.5,  // 2px
  sm: baseSpacing * 1,    // 4px
  md: baseSpacing * 2,    // 8px
  lg: baseSpacing * 3,    // 12px
  xl: baseSpacing * 4,    // 16px
  xxl: baseSpacing * 6,   // 24px
  full: 9999,             // Para círculos
};

// Tipografia
export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),
  lineHeights: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 0.75,
    widest: 1,
  },
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
};

// Sombras
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Estilos globais
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.background,
  },
  content: {
    flex: 1,
    padding: spacing._4,
  },
  card: {
    backgroundColor: colorPalette.card,
    borderRadius: borderRadius.md,
    padding: spacing._4,
    marginBottom: spacing._4,
    ...shadows.sm,
  },
  input: {
    backgroundColor: colorPalette.white,
    borderWidth: 1,
    borderColor: colorPalette.border,
    borderRadius: borderRadius.md,
    padding: spacing._3,
    fontSize: typography.sizes.md,
    color: colorPalette.text,
  },
  button: {
    backgroundColor: colorPalette.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing._3,
    paddingHorizontal: spacing._4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colorPalette.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  text: {
    color: colorPalette.text,
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },
  textSecondary: {
    color: colorPalette.textSecondary,
    fontSize: typography.sizes.sm,
  },
  heading1: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colorPalette.text,
    marginBottom: spacing._4,
  },
  heading2: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colorPalette.text,
    marginBottom: spacing._3,
  },
  heading3: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colorPalette.text,
    marginBottom: spacing._2,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colorPalette.textSecondary,
    marginBottom: spacing._1,
  },
});

// Exportar um tema completo para uso com React Context ou ThemeProvider
export const theme = {
  colors: colorPalette,
  spacing,
  borderRadius,
  typography,
  shadows,
  styles: globalStyles,
};

export type Theme = typeof theme;

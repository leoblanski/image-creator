import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewStyle,
} from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../../core/theme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  shadow?: keyof typeof shadows;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'sm',
  onPress,
  ...touchableProps
}) => {
  const cardStyle = [
    styles.base,
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    styles[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.95}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.light.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  
  // Padding variants
  paddingXs: { padding: spacing.xs },
  paddingSm: { padding: spacing.sm },
  paddingMd: { padding: spacing.md },
  paddingLg: { padding: spacing.lg },
  paddingXl: { padding: spacing.xl },
  paddingXxl: { padding: spacing.xxl },
  
  // Shadow variants
  shadowSm: shadows.sm,
  shadowMd: shadows.md,
  shadowLg: shadows.lg,
});

import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../core/theme';

interface SegmentedOption<T> {
  label: string;
  value: T;
}

interface SegmentedProps<T> {
  options: SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  style?: ViewStyle;
  optionStyle?: ViewStyle;
  textStyle?: TextStyle;
  selectedOptionStyle?: ViewStyle;
  selectedTextStyle?: TextStyle;
}

export function Segmented<T>({
  options,
  value,
  onValueChange,
  style,
  optionStyle,
  textStyle,
  selectedOptionStyle,
  selectedTextStyle,
}: SegmentedProps<T>) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => {
        const isSelected = option.value === value;
        
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              optionStyle,
              isSelected && styles.selectedOption,
              isSelected && selectedOptionStyle,
            ]}
            onPress={() => onValueChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.text,
                textStyle,
                isSelected && styles.selectedText,
                isSelected && selectedTextStyle,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    padding: 2,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.light.textSecondary,
  },
  selectedText: {
    color: colors.light.text,
    fontWeight: typography.weights.semibold,
  },
});

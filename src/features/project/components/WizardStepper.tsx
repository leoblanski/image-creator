import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, spacing, typography } from '../../../core/theme';
import { WizardStep } from '../wizardStore';

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  onStepPress?: (stepIndex: number) => void;
  style?: any;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStep,
  onStepPress,
  style,
}) => {
  const renderStep = (step: WizardStep, index: number) => {
    const isActive = index === currentStep;
    const isCompleted = step.completed;
    const isAccessible = index <= currentStep || step.completed;

    return (
      <TouchableOpacity
        key={step.id}
        style={[
          styles.step,
          isActive && styles.activeStep,
          isCompleted && styles.completedStep,
          !isAccessible && styles.disabledStep,
        ]}
        onPress={() => isAccessible && onStepPress?.(index)}
        disabled={!isAccessible}
        activeOpacity={0.7}
      >
        <View style={[
          styles.stepIndicator,
          isActive && styles.activeIndicator,
          isCompleted && styles.completedIndicator,
        ]}>
          <Text style={[
            styles.stepNumber,
            isActive && styles.activeStepNumber,
            isCompleted && styles.completedStepNumber,
          ]}>
            {isCompleted ? '✓' : index + 1}
          </Text>
        </View>
        
        <Text style={[
          styles.stepTitle,
          isActive && styles.activeStepTitle,
          isCompleted && styles.completedStepTitle,
          !isAccessible && styles.disabledStepTitle,
        ]}>
          {step.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => renderStep(step, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  activeStep: {
    // Active step styling
  },
  completedStep: {
    // Completed step styling
  },
  disabledStep: {
    opacity: 0.5,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    borderWidth: 2,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  activeIndicator: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  completedIndicator: {
    backgroundColor: colors.light.success,
    borderColor: colors.light.success,
  },
  stepNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.light.textSecondary,
  },
  activeStepNumber: {
    color: colors.light.text,
  },
  completedStepNumber: {
    color: colors.light.text,
  },
  stepTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  activeStepTitle: {
    color: colors.light.primary,
    fontWeight: typography.weights.semibold,
  },
  completedStepTitle: {
    color: colors.light.success,
  },
  disabledStepTitle: {
    color: colors.light.textSecondary,
  },
});

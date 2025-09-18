import { PresetId, getAllPresets } from '@src/core/presets';
import { colors, spacing, typography } from '@src/core/theme';
import { useAIStore } from '@src/features/project/aiStore';
import { ImagePickerGrid } from '@src/features/project/components/ImagePickerGrid';
import { WizardStepper } from '@src/features/project/components/WizardStepper';
import { createAIRequest } from '@src/features/project/models/AIRequest';
import { createSlide } from '@src/features/project/models/Slide';
import { generateCarousel } from '@src/features/project/openai';
import { useProjectStore } from '@src/features/project/store';
import { useWizardStore } from '@src/features/project/wizardStore';
import { Button } from '@src/shared/ui/Button';
import { Card } from '@src/shared/ui/Card';
import { Segmented } from '@src/shared/ui/Segmented';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  { label: 'Technology', value: 'Technology' },
  { label: 'Business', value: 'Business' },
  { label: 'Education', value: 'Education' },
  { label: 'Lifestyle', value: 'Lifestyle' },
  { label: 'Health', value: 'Health' },
  { label: 'Entertainment', value: 'Entertainment' },
];

const goals = [
  { label: 'Education', value: 'Education' },
  { label: 'CTA', value: 'CTA' },
  { label: 'Awareness', value: 'Awareness' },
  { label: 'Engagement', value: 'Engagement' },
  { label: 'Sales', value: 'Sales' },
];

const tones = [
  { label: 'Casual', value: 'Casual' },
  { label: 'Professional', value: 'Professional' },
  { label: 'Bold', value: 'Bold' },
  { label: 'Friendly', value: 'Friendly' },
  { label: 'Authoritative', value: 'Authoritative' },
];

const languages = [
  { label: 'English', value: 'en-US' },
  { label: 'Português', value: 'pt-BR' },
];

export default function WizardScreen() {
  const {
    currentStep,
    steps,
    data,
    setCurrentStep,
    nextStep,
    previousStep,
    updateStepData,
    markStepCompleted,
    canProceed,
  } = useWizardStore();

  const { createNewProject } = useProjectStore();
  const { setLoading, setError, setResponse } = useAIStore();

  const [keyPointText, setKeyPointText] = useState('');

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Final step - generate AI content and create project
      await handleGenerateContent();
    } else {
      markStepCompleted(currentStep);
      nextStep();
    }
  };

  const handleGenerateContent = async () => {
    try {
      setLoading(true);
      
      // Create slides from selected images
      const slides = data.selectedImages.map((uri, index) =>
        createSlide(`slide_${Date.now()}_${index}`, index, uri, data.presetId)
      );

      // Create AI request
      const aiRequest = createAIRequest(
        data.category,
        data.goal,
        data.audience,
        data.tone,
        data.language,
        data.selectedImages.length,
        data.keyPoints,
        data.presetId,
        data.cta,
        data.hashtags
      );

      // Generate AI content
      const aiResponse = await generateCarousel(aiRequest);
      setResponse(aiResponse);

      // Update slides with AI content
      const updatedSlides = slides.map((slide, index) => {
        const aiSlide = aiResponse.slides[index];
        if (aiSlide) {
          return {
            ...slide,
            textTitle: aiSlide.title,
            textBody: aiSlide.body,
          };
        }
        return slide;
      });

      // Create project
      createNewProject(updatedSlides, data.language, data.presetId);
      
      // Navigate to preview
      router.push('/preview');
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again.');
      Alert.alert('Error', 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyPoint = () => {
    if (keyPointText.trim()) {
      updateStepData({
        keyPoints: [...data.keyPoints, keyPointText.trim()],
      });
      setKeyPointText('');
    }
  };

  const handleRemoveKeyPoint = (index: number) => {
    const newKeyPoints = data.keyPoints.filter((_, i) => i !== index);
    updateStepData({ keyPoints: newKeyPoints });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Images
        return (
          <ImagePickerGrid
            selectedImages={data.selectedImages}
            onImagesChange={(images) => updateStepData({ selectedImages: images })}
          />
        );

      case 1: // Content & Goal
        return (
          <View style={styles.stepContent}>
            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Category</Text>
              <Segmented
                options={categories}
                value={data.category}
                onValueChange={(value) => updateStepData({ category: value })}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Goal</Text>
              <Segmented
                options={goals}
                value={data.goal}
                onValueChange={(value) => updateStepData({ goal: value })}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Target Audience</Text>
              <TextInput
                style={styles.textInput}
                value={data.audience}
                onChangeText={(text) => updateStepData({ audience: text })}
                placeholder="e.g., Young professionals, Students, Entrepreneurs"
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Language</Text>
              <Segmented
                options={languages}
                value={data.language}
                onValueChange={(value) => updateStepData({ language: value })}
              />
            </Card>
          </View>
        );

      case 2: // Tone & Style
        return (
          <View style={styles.stepContent}>
            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Tone</Text>
              <Segmented
                options={tones}
                value={data.tone}
                onValueChange={(value) => updateStepData({ tone: value })}
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Style Preset</Text>
              <Segmented
                options={getAllPresets().map(preset => ({
                  label: preset.name,
                  value: preset.id,
                }))}
                value={data.presetId}
                onValueChange={(value) => updateStepData({ presetId: value as PresetId })}
              />
            </Card>
          </View>
        );

      case 3: // Key Points
        return (
          <View style={styles.stepContent}>
            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Key Points</Text>
              <View style={styles.keyPointInput}>
                <TextInput
                  style={styles.textInput}
                  value={keyPointText}
                  onChangeText={setKeyPointText}
                  placeholder="Enter a key point..."
                  multiline
                />
                <Button
                  title="Add"
                  onPress={handleAddKeyPoint}
                  disabled={!keyPointText.trim()}
                  size="sm"
                />
              </View>
              
              {data.keyPoints.map((point, index) => (
                <View key={index} style={styles.keyPointItem}>
                  <Text style={styles.keyPointText}>{point}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveKeyPoint(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Card>
          </View>
        );

      case 4: // CTA & Hashtags
        return (
          <View style={styles.stepContent}>
            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Call to Action (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={data.cta}
                onChangeText={(text) => updateStepData({ cta: text })}
                placeholder="e.g., Follow for more tips, Learn more at..."
              />
            </Card>

            <Card style={styles.inputCard}>
              <Text style={styles.inputLabel}>Hashtags (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={data.hashtags.join(', ')}
                onChangeText={(text) => updateStepData({ hashtags: text.split(',').map(t => t.trim()).filter(t => t) })}
                placeholder="e.g., #marketing, #business, #tips"
              />
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <WizardStepper
        steps={steps}
        currentStep={currentStep}
        onStepPress={setCurrentStep}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Previous"
          variant="outline"
          onPress={previousStep}
          disabled={currentStep === 0}
          style={styles.footerButton}
        />
        <Button
          title={currentStep === steps.length - 1 ? 'Generate & Create' : 'Next'}
          onPress={handleNext}
          disabled={!canProceed()}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  stepContent: {
    gap: spacing.lg,
  },
  inputCard: {
    padding: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily,
    color: colors.light.text,
    backgroundColor: colors.light.background,
  },
  keyPointInput: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  keyPointText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.light.text,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.light.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.light.text,
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  footerButton: {
    flex: 1,
  },
});

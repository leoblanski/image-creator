import { PresetId, getAllPresets } from '@src/core/presets';
import { colors, spacing, typography } from '@src/core/theme';
import { useAIStore } from '@src/features/project/aiStore';
import { ImagePickerGrid } from '@src/features/project/components/ImagePickerGrid';
import { TrendingTopicsSelector } from '@src/features/project/components/TrendingTopicsSelector';
import { createAIRequest } from '@src/features/project/models/AIRequest';
import { createSlide } from '@src/features/project/models/Slide';
import { generateCarousel } from '@src/features/project/openai';
import { useProjectStore } from '@src/features/project/store';
import { useWizardStore } from '@src/features/project/wizardStore';
import { useTranslation } from '@src/hooks/useTranslation';
import { Segmented } from '@src/shared/ui/Segmented';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  { label: '🚀 Carreira em TI', value: '🚀 Carreira em TI' },
  { label: '💻 Tecnologias em Alta', value: '💻 Tecnologias em Alta' },
  { label: '🌎 Trabalho Remoto', value: '🌎 Trabalho Remoto' },
  { label: '📚 Aprendizado', value: '📚 Aprendizado' },
  { label: '💡 Dicas Rápidas', value: '💡 Dicas Rápidas' },
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
  const { t, changeLanguage, appLanguage } = useTranslation();

  const { currentStep, steps, nextStep, previousStep, updateStepData, data } = useWizardStore();
  const { createNewProject } = useProjectStore();
  const { setLoading, setError, setResponse, isLoading: aiLoading } = useAIStore();

  // Initialize steps with translations
  const { initializeSteps } = useWizardStore();
  
  // Initialize steps when the component mounts or when the translation changes
  useEffect(() => {
    initializeSteps(t);
  }, [t, initializeSteps]);

  // Sync language changes
  useEffect(() => {
    if (data.language !== appLanguage) {
      const newLanguage = data.language === 'pt-BR' ? 'pt' : 'en';
      changeLanguage(newLanguage);
    }
  }, [data.language, appLanguage, changeLanguage]);

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Final step - generate AI content and create project
      await handleGenerateContent();
    } else {
      nextStep();
    }
  };

  const handleGenerateContent = async () => {
    try {
      setLoading(true);

      console.log('Selected images:', data.selectedImages);

      // Create slides from selected images with unique IDs
      const slides = data.selectedImages.map((uri, index) => {
        const uniqueId = `slide_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 7)}`;
        return createSlide(uniqueId, index, uri, data.presetId);
      });

      console.log('Created slides:', slides);

      // Create AI request with selected topic
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
        data.hashtags,
        data.selectedTopic
      );

      // Generate AI content
      const aiResponse = await generateCarousel(aiRequest);
      setResponse(aiResponse);

      console.log('AI Response received:', aiResponse);

      // Calculate number of content slides (total - 2 for cover and CTA)
      const contentSlidesCount = Math.max(1, slides.length - 2);
      
      // Update slides with AI content
      const updatedSlides = slides.map((slide, index) => {
        const aiSlide = aiResponse.slides[index];
        if (!aiSlide) return slide;

        // Clean title: remove numbers and bullet points
        let cleanTitle = (aiSlide.title || '')
          .replace(/^\d+\s*[-–•]\s*/, '') // Remove "1 -", "2 -", etc.
          .replace(/^\d+\.\s*/, '') // Remove "1.", "2.", etc.
          .replace(/^\•\s*/, '') // Remove bullet points
          .trim();

        let cleanBody = (aiSlide.body || '').trim();
        
        // First slide - Cover
        if (index === 0) {
          if (data.selectedTopic) {
            // Format as "X dicas sobre [topic]"
            cleanTitle = t('wizard.titles.tipsCount', {
              count: contentSlidesCount,
              topic: data.selectedTopic.title,
              category: data.selectedTopic.category
            });
          }
          // Center the body text for the cover
          cleanBody = cleanBody.split('\n').map(line => line.trim()).join('\n');
        }
        // Last slide - CTA
        else if (index === slides.length - 1) {
          cleanTitle = cleanTitle || t('wizard.titles.followForMore');
          cleanBody = aiResponse.cta || t('wizard.defaults.cta');
        }
        // Content slides
        else {
          // Format as "Dica X: [Title]" for content slides
          cleanTitle = cleanTitle || t('wizard.titles.tipNumber', { number: index });
          
          // Ensure body has proper line breaks for better readability
          cleanBody = cleanBody
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n\n');
        }

        return {
          ...slide,
          textTitle: cleanTitle,
          textBody: cleanBody || t('wizard.defaults.slideBody', { number: index + 1 }),
        };
      });

      // Create project
      console.log('Final slides with AI content:', updatedSlides);
      createNewProject(updatedSlides, data.language, data.presetId);

      // Navigate to preview
      router.push('/preview');
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error && error.message.includes('Network request failed')
        ? 'Verifique sua conexão com a internet e tente novamente.'
        : 'Erro ao gerar conteúdo com IA. Verifique sua conexão e API key.';

      setError(errorMessage);
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Ensure steps is loaded and currentStep is valid
  if (!steps.length || currentStep >= steps.length) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#ff3366" />
        <Text style={styles.loadingText}>{t('wizard.loading') || 'Carregando...'}</Text>
      </View>
    );
  }

  const currentStepData = steps[currentStep] || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentStepData.title || ''}</Text>
        <Text style={styles.subtitle}>
          {currentStep === 0 ? t('wizard.category.title') : ''}
        </Text>
      </View>

      <ScrollView style={styles.stepContainer}>
        {currentStep === 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('wizard.category.language')}
              </Text>
              <Segmented
                options={languages}
                value={data.language}
                onValueChange={(value) =>
                  updateStepData({ ...data, language: value as 'en-US' | 'pt-BR' })
                }
                style={{ backgroundColor: '#1a1a1a' }}
                selectedOptionStyle={{ backgroundColor: '#ff3366' }}
                selectedTextStyle={{ color: '#fff' }}
                textStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('wizard.category.selectCategory')}
              </Text>
              <Segmented
                options={categories}
                value={data.category}
                onValueChange={(value) =>
                  updateStepData({ ...data, category: value as string })
                }
                style={{ backgroundColor: '#1a1a1a' }}
                selectedOptionStyle={{ backgroundColor: '#ff3366' }}
                selectedTextStyle={{ color: '#fff' }}
                textStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </View>
          </>
        )}

        {currentStep === 1 && (
          <TrendingTopicsSelector
            category={data.category}
            selectedTopic={data.selectedTopic}
            onTopicSelect={(topic) => updateStepData({ ...data, selectedTopic: topic })}
          />
        )}

        {currentStep === 2 && (
          <ImagePickerGrid
            selectedImages={data.selectedImages}
            onImagesChange={(images) => updateStepData({ ...data, selectedImages: images })}
          />
        )}

        {currentStep === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('wizard.style.tone')}
            </Text>
            <Segmented
              options={tones}
              value={data.tone}
              onValueChange={(value) =>
                updateStepData({ ...data, tone: value as string })
              }
              style={{ backgroundColor: '#1a1a1a' }}
              selectedOptionStyle={{ backgroundColor: '#ff3366' }}
              selectedTextStyle={{ color: '#fff' }}
              textStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
            />
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('wizard.style.style')}
            </Text>
            <Segmented
              options={getAllPresets().map(preset => ({
                label: preset.name,
                value: preset.id,
              }))}
              value={data.presetId}
              onValueChange={(value) =>
                updateStepData({ ...data, presetId: value as PresetId })
              }
              style={{ backgroundColor: '#1a1a1a' }}
              selectedOptionStyle={{ backgroundColor: '#ff3366' }}
              selectedTextStyle={{ color: '#fff' }}
              textStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity
            onPress={previousStep}
            style={[styles.button, styles.secondaryButton]}
            disabled={aiLoading}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              {t('wizard.buttons.previous')}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.button,
            styles.primaryButton,
            currentStep === 0 && { marginLeft: 'auto' },
          ]}
          disabled={aiLoading}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            {currentStep === steps.length - 1
              ? t('wizard.buttons.generate')
              : t('wizard.buttons.next')}
          </Text>
          {aiLoading && <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
    fontFamily: typography.fontFamily,
  },
  header: {
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#0f0f0f',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
    lineHeight: 22,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Espaço extra para o botão flutuante
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#0f0f0f',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    marginRight: 12,
  },
  primaryButton: {
    backgroundColor: '#ff3366',
    shadowColor: '#ff3366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.9)',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  keyPointInput: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: typography.weights.regular,
    lineHeight: 21,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.light.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.light.text,
    fontSize: 18,
    fontWeight: typography.weights.bold,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.background,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButton: {
    height: 48,
    borderRadius: 12,
    minWidth: 120,
  },
  previousButton: {
    flex: 0,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  nextButton: {
    flex: 1,
    backgroundColor: colors.light.primary,
  },
  fullWidthButton: {
    flex: 1,
    backgroundColor: colors.light.primary,
  },
});

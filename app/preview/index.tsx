import { colors, spacing, typography } from '@src/core/theme';
import { PreviewPager } from '@src/features/project/components/PreviewPager';
import { useProjectStore } from '@src/features/project/store';
import { Button } from '@src/shared/ui/Button';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function PreviewScreen() {
  const { currentProject, updateSlideInProject, saveProject } = useProjectStore();
  const [showSafeArea, setShowSafeArea] = useState(false);

  if (!currentProject) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No project found</Text>
        <Button
          title="Go Home"
          onPress={() => router.push('/')}
          style={styles.button}
        />
      </View>
    );
  }

  const handleSlideUpdate = (slideId: string, updatedSlide: any) => {
    updateSlideInProject(slideId, updatedSlide);
  };

  const handleExport = () => {
    saveProject();
    router.push('/export');
  };

  const handleBack = () => {
    router.back();
  };

  const handleToggleSafeArea = () => {
    setShowSafeArea(!showSafeArea);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Preview</Text>
          <Text style={styles.subtitle}>
            {currentProject.slides.length} slides
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleToggleSafeArea}
          style={styles.safeAreaButton}
        >
          <Text style={styles.safeAreaButtonText}>
            {showSafeArea ? 'Hide' : 'Show'} Grid
          </Text>
        </TouchableOpacity>
      </View>

      <PreviewPager
        slides={currentProject.slides}
        onSlideUpdate={handleSlideUpdate}
        showSafeArea={showSafeArea}
        language={currentProject.language}
      />

      <View style={styles.footer}>
        <Button
          title="Edit Project"
          variant="outline"
          onPress={() => router.push('/wizard')}
          style={styles.footerButton}
        />
        <Button
          title="Export"
          onPress={handleExport}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    fontSize: typography.sizes.md,
    color: colors.light.primary,
    fontWeight: typography.weights.medium,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
  },
  safeAreaButton: {
    padding: spacing.sm,
  },
  safeAreaButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.light.primary,
    fontWeight: typography.weights.medium,
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
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    marginHorizontal: spacing.xl,
  },
});

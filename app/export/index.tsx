import { getExportDirectory, saveSlideImage, shareImage } from '@src/core/export';
import { colors, spacing, typography } from '@src/core/theme';
import { SlideCanvas } from '@src/features/project/components/SlideCanvas';
import { useProjectStore } from '@src/features/project/store';
import { Button } from '@src/shared/ui/Button';
import { Card } from '@src/shared/ui/Card';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

export default function ExportScreen() {
  const { currentProject } = useProjectStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFiles, setExportedFiles] = useState<string[]>([]);
  const [exportProgress, setExportProgress] = useState(0);
  
  const viewShotRefs = useRef<(ViewShot | null)[]>([]);

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

  const handleExportAll = async () => {
    try {
      setIsExporting(true);
      setExportProgress(0);
      setExportedFiles([]);

      const files: string[] = [];
      
      for (let i = 0; i < currentProject.slides.length; i++) {
        const slide = currentProject.slides[i];
        const viewShotRef = viewShotRefs.current[i];
        
        if (viewShotRef) {
          try {
            const uri = await viewShotRef.capture();
            const filename = `project_${currentProject.id}_slide_${i + 1}.png`;
            const savedPath = await saveSlideImage(uri, filename);
            files.push(savedPath);
          } catch (error) {
            console.error(`Error capturing slide ${i + 1}:`, error);
          }
        }
        
        setExportProgress((i + 1) / currentProject.slides.length);
      }

      setExportedFiles(files);
      Alert.alert(
        'Export Complete',
        `Successfully exported ${files.length} slides to ${getExportDirectory()}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Error', 'Failed to export slides. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareAll = async () => {
    if (exportedFiles.length === 0) {
      Alert.alert('No Files', 'Please export slides first.');
      return;
    }

    try {
      for (const file of exportedFiles) {
        await shareImage(file);
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Share Error', 'Failed to share files. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderSlide = (slide: any, index: number) => (
    <View key={slide.id} style={styles.slideContainer}>
      <Text style={styles.slideTitle}>Slide {index + 1}</Text>
      <ViewShot
        ref={(ref) => {
          viewShotRefs.current[index] = ref;
        }}
        options={{
          format: 'png',
          quality: 1,
          width: 1080,
          height: 1350,
        }}
      >
        <SlideCanvas
          slide={slide}
          isPreview={false}
          showSafeArea={false}
        />
      </ViewShot>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Export Slides</Text>
        <Text style={styles.subtitle}>
          {currentProject.slides.length} slides ready for export
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentProject.slides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Back"
          variant="outline"
          onPress={handleBack}
          style={styles.footerButton}
        />
        
        <Button
          title={isExporting ? 'Exporting...' : 'Export All'}
          onPress={handleExportAll}
          disabled={isExporting}
          loading={isExporting}
          style={styles.footerButton}
        />
        
        {exportedFiles.length > 0 && (
          <Button
            title="Share All"
            onPress={handleShareAll}
            style={styles.footerButton}
          />
        )}
      </View>

      {isExporting && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Exporting... {Math.round(exportProgress * 100)}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${exportProgress * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {exportedFiles.length > 0 && (
        <Card style={styles.successCard}>
          <Text style={styles.successTitle}>Export Complete!</Text>
          <Text style={styles.successText}>
            {exportedFiles.length} slides exported successfully
          </Text>
          <Text style={styles.successPath}>
            Saved to: {getExportDirectory()}
          </Text>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.light.textSecondary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  slideContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  footerButton: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.light.surface,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  progressText: {
    fontSize: typography.sizes.md,
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.light.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.light.primary,
  },
  successCard: {
    margin: spacing.md,
    backgroundColor: colors.light.success,
    padding: spacing.lg,
  },
  successTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  successText: {
    fontSize: typography.sizes.md,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  successPath: {
    fontSize: typography.sizes.sm,
    color: colors.light.text,
    opacity: 0.8,
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

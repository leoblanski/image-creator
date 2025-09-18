import { colors, spacing, typography } from '@src/core/theme';
import { useProjectStore } from '@src/features/project/store';
import { Button } from '@src/shared/ui/Button';
import { Card } from '@src/shared/ui/Card';
import { router } from 'expo-router';
import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { recentProjects, loadProject } = useProjectStore();

  const handleNewProject = () => {
    router.push('/wizard');
  };

  const handleLoadProject = (projectId: string) => {
    loadProject(projectId);
    router.push('/preview');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const renderProjectItem = ({ item }: { item: any }) => (
    <Card
      style={styles.projectCard}
      onPress={() => handleLoadProject(item.id)}
    >
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>
          {item.name || `Project ${item.id.slice(-6)}`}
        </Text>
        <Text style={styles.projectDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.projectSlides}>
        {item.slides.length} slides
      </Text>
    </Card>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>CarouselCraft</Text>
        <Text style={styles.subtitle}>
          Create stunning Instagram carousels with AI
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="New Project"
          onPress={handleNewProject}
          size="lg"
          style={styles.newProjectButton}
        />
        
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettings}
        >
          <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      {recentProjects.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <FlatList
            data={recentProjects}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      )}

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Features</Text>
        
        <Card style={styles.featureCard}>
          <Text style={styles.featureIcon}>🎨</Text>
          <Text style={styles.featureTitle}>AI-Powered Content</Text>
          <Text style={styles.featureDescription}>
            Generate engaging titles and descriptions using OpenAI
          </Text>
        </Card>

        <Card style={styles.featureCard}>
          <Text style={styles.featureIcon}>📱</Text>
          <Text style={styles.featureTitle}>Instagram Ready</Text>
          <Text style={styles.featureDescription}>
            Perfect 1080×1350 dimensions for Instagram carousels
          </Text>
        </Card>

        <Card style={styles.featureCard}>
          <Text style={styles.featureIcon}>🎭</Text>
          <Text style={styles.featureTitle}>Multiple Styles</Text>
          <Text style={styles.featureDescription}>
            Choose from various preset styles and customize text
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.black,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  newProjectButton: {
    marginBottom: spacing.md,
  },
  settingsButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingsButtonText: {
    fontSize: typography.sizes.md,
    color: colors.light.primary,
    fontWeight: typography.weights.medium,
  },
  recentSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
    marginBottom: spacing.lg,
  },
  projectCard: {
    marginBottom: spacing.md,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  projectTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    flex: 1,
  },
  projectDate: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
  },
  projectSlides: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
  },
  features: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.light.text,
    marginBottom: spacing.xs,
    flex: 1,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
    flex: 1,
  },
});

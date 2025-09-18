import { useProjectStore } from '@src/features/project/store';
import { Button } from '@src/shared/ui/Button';
import { Card } from '@src/shared/ui/Card';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Spacing constants
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Theme colors
const COLORS = {
  background: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceLight: '#222222',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  primary: '#ff3366',
  border: 'rgba(255, 255, 255, 0.1)',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
} as const;

// Typography
const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
} as const;

export default function HomeScreen() {
  const { t } = useTranslation();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const renderProjectItem = ({ item }: { item: any }) => (
    <Card
      style={styles.projectCard}
      onPress={() => handleLoadProject(item.id)}
    >
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle} numberOfLines={1}>
          {item.name || `${t('project')} ${item.id.slice(-4)}`}
        </Text>
        <Text style={styles.projectDate}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <View style={styles.projectFooter}>
        <View style={styles.slideCountBadge}>
          <Ionicons name="images" size={14} color={COLORS.primary} />
          <Text style={styles.slideCountText}>
            {item.slides.length} {item.slides.length === 1 ? t('slide') : t('slides')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={48} color={COLORS.textSecondary} />
      <Text style={styles.emptyStateTitle}>{t('noProjects')}</Text>
      <Text style={styles.emptyStateText}>
        {t('createYourFirstProject')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('appName')}</Text>
          <Text style={styles.subtitle}>
            {t('appTagline')}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title={t('newProject')}
            onPress={handleNewProject}
            style={styles.newProjectButton}
            textStyle={styles.newProjectButtonText}
            icon={() => <Ionicons name="add" size={20} color="#fff" style={styles.buttonIcon} />}
          />
          
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettings}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recentProjects')}</Text>
            {recentProjects.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAllText}>{t('seeAll')}</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentProjects.length > 0 ? (
            <FlatList
              data={recentProjects.slice(0, 3)}
              renderItem={renderProjectItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.projectsList}
            />
          ) : (
            renderEmptyState()
          )}
        </View>

        <View style={styles.features}>
          <Text style={styles.sectionTitle}>{t('features')}</Text>
          
          <View style={styles.featuresGrid}>
            <Card style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(255, 51, 102, 0.1)' }]}>
                <Ionicons name="sparkles" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>{t('aiPowered')}</Text>
              <Text style={styles.featureDescription}>
                {t('aiPoweredDesc')}
              </Text>
            </Card>

            <Card style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Ionicons name="image" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.featureTitle}>{t('templates')}</Text>
              <Text style={styles.featureDescription}>
                {t('templatesDesc')}
              </Text>
            </Card>

            <Card style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Ionicons name="share-social" size={24} color="#2196F3" />
              </View>
              <Text style={styles.featureTitle}>{t('quickExport')}</Text>
              <Text style={styles.featureDescription}>
                {t('quickExportDesc')}
              </Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    textAlign: 'left',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'left',
    marginBottom: 0,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  newProjectButton: {
    flex: 1,
    marginRight: SPACING.md,
    height: 52,
    borderRadius: 12,
  },
  newProjectButtonText: {
    ...TYPOGRAPHY.button,
    color: '#fff',
    marginLeft: SPACING.xs,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  settingsButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSection: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  seeAllText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '500',
  },
  projectsList: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 0,
  },
  projectCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  slideCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 51, 102, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  slideCountText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  projectTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.sm,
  },
  projectDate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptyStateText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  features: {
    paddingHorizontal: SPACING.lg,
  },
  featuresGrid: {
    gap: SPACING.md,
  },
  featureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featureTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { topicsService } from '../topicsService';
import { TrendingTopic } from '../trendingService';

// Theme constants matching index.tsx
const COLORS = {
  background: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceLight: '#222222',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  primary: '#ff3366',
  border: 'rgba(255, 255, 255, 0.1)',
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

const TYPOGRAPHY = {
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
} as const;

interface TrendingTopicsSelectorProps {
  category: string;
  selectedTopic: TrendingTopic | null;
  onTopicSelect: (topic: TrendingTopic) => void;
}

export const TrendingTopicsSelector: React.FC<TrendingTopicsSelectorProps> = ({
  category,
  selectedTopic,
  onTopicSelect,
}) => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrendingTopics = useCallback(async () => {
    if (!category) return;

    setLoading(true);
    setError(null);
    try {
      const topics = topicsService.getTopicsByCategory(category) || [];
      const topicsWithPopularity = topics.map(topic => ({
        ...topic,
        id: topic.id,
        title: topic.title,
        description: topic.description,
        category: category,
        popularity: Math.floor(Math.random() * 30) + 70,
        tags: topic.tags || [],
        source: 'mock' as const,
        prompt: topic.prompt,
        cta: topic.cta
      }));

      setTopics(topicsWithPopularity);
    } catch (error) {
      console.error('Error loading topics:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to load topics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadTrendingTopics();
  }, [loadTrendingTopics]);


  const renderTopicItem = ({ item }: { item: TrendingTopic }) => {
    const isSelected = selectedTopic?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.topicItem,
          isSelected && styles.selectedTopicItem,
        ]}
        onPress={() => onTopicSelect({ ...item, popularity: 100 })}
        activeOpacity={0.7}
      >
        <Text style={styles.topicTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.topicDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map((tag: string, index: number) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {item.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{item.tags.length - 2}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadTrendingTopics}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        renderItem={renderTopicItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
    ...TYPOGRAPHY.body,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  topicItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedTopicItem: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  topicTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  topicDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
    marginRight: SPACING.xs,
    marginTop: SPACING.xs,
  },
  tagText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  moreTagsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginLeft: SPACING.xs,
    alignSelf: 'center',
  },
  separator: {
    height: SPACING.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default TrendingTopicsSelector;

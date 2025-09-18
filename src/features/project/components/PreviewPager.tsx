import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PresetId } from '../../../core/presets';
import { borderRadius, colors, spacing, typography } from '../../../core/theme';
import { Slide, updateSlideStyle, updateSlideText } from '../models/Slide';
import { SlideCanvas } from './SlideCanvas';
import { TextOverlayEditor } from './TextOverlayEditor';

interface PreviewPagerProps {
  slides: Slide[];
  onSlideUpdate: (slideId: string, updatedSlide: Slide) => void;
  showSafeArea?: boolean;
  language?: 'pt-BR' | 'en-US';
}

const { width: screenWidth } = Dimensions.get('window');
const THUMBNAIL_SIZE = 80;

export const PreviewPager: React.FC<PreviewPagerProps> = ({
  slides,
  onSlideUpdate,
  showSafeArea = false,
  language = 'en-US',
}) => {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

  const selectedSlide = slides[selectedSlideIndex];

  const handleSlidePress = (index: number) => {
    setSelectedSlideIndex(index);
  };

  const handleEditSlide = (slide: Slide) => {
    setEditingSlide(slide);
    setIsEditing(true);
  };

  const handleSaveEdit = (title: string, body: string, styleId: PresetId) => {
    if (editingSlide) {
      const updatedSlide = updateSlideStyle(
        updateSlideText(editingSlide, title, body),
        styleId
      );
      onSlideUpdate(editingSlide.id, updatedSlide);
    }
    setIsEditing(false);
    setEditingSlide(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSlide(null);
  };

  const handleCopyDescription = async () => {
    const description = slides
      .map((slide, index) => {
        const title = slide.textTitle || `Slide ${index + 1}`;
        const body = slide.textBody || '';
        return body ? `${title}\n\n${body}` : title;
      })
      .join('\n\n---\n\n');
    
    await Clipboard.setStringAsync(description);
    Alert.alert('Copied!', 'Description copied to clipboard');
  };

  const renderThumbnail = ({ item, index }: { item: Slide; index: number }) => (
    <TouchableOpacity
      style={[
        styles.thumbnail,
        selectedSlideIndex === index && styles.selectedThumbnail,
      ]}
      onPress={() => handleSlidePress(index)}
      activeOpacity={0.7}
    >
      <SlideCanvas
        slide={item}
        isPreview={true}
        showSafeArea={false}
        language={language}
      />
    </TouchableOpacity>
  );

  const renderMainSlide = () => {
    if (!selectedSlide) return null;

    return (
      <View style={styles.mainSlideContainer}>
        <SlideCanvas
          slide={selectedSlide}
          isPreview={false}
          showSafeArea={showSafeArea}
          language={language}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditSlide(selectedSlide)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Preview ({selectedSlideIndex + 1}/{slides.length})
        </Text>
        <Text style={styles.subtitle}>
          Tap thumbnail to switch slides, tap main slide to edit
        </Text>
      </View>

      {renderMainSlide()}

      <View style={styles.thumbnailsContainer}>
        <FlatList
          data={slides}
          renderItem={renderThumbnail}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailsList}
        />
      </View>

      <View style={styles.copyButtonContainer}>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopyDescription}
        >
          <Text style={styles.copyButtonText}>📋 Copy Description</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isEditing}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {editingSlide && (
          <TextOverlayEditor
            title={editingSlide.textTitle || ''}
            body={editingSlide.textBody || ''}
            styleId={editingSlide.styleId}
            onTitleChange={() => {}}
            onBodyChange={() => {}}
            onStyleChange={() => {}}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  mainSlideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  editButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  editButtonText: {
    color: colors.light.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  thumbnailsContainer: {
    paddingVertical: spacing.md,
  },
  thumbnailsList: {
    paddingHorizontal: spacing.md,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: colors.light.primary,
  },
  
  copyButtonContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  copyButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  copyButtonText: {
    color: colors.light.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});

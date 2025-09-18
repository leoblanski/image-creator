import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { MAX_SLIDES, MIN_SLIDES } from '../../../core/sizes';
import { borderRadius, colors, spacing, typography } from '../../../core/theme';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';

interface ImagePickerGridProps {
  selectedImages: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImagePickerGrid: React.FC<ImagePickerGridProps> = ({
  selectedImages,
  onImagesChange,
  maxImages = MAX_SLIDES,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ]);
      
      return Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const pickImages = async () => {
    try {
      setIsLoading(true);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages - selectedImages.length,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        const updatedImages = [...selectedImages, ...newImages].slice(0, maxImages);
        onImagesChange(updatedImages);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <Card style={styles.imageCard} onPress={() => removeImage(index)}>
      <Image source={{ uri: item }} style={styles.image} />
      <View style={styles.removeButton}>
        <Text style={styles.removeButtonText}>×</Text>
      </View>
    </Card>
  );

  const renderAddButton = () => (
    <Card style={styles.addCard} onPress={pickImages}>
      <View style={styles.addContent}>
        <Text style={styles.addIcon}>+</Text>
        <Text style={styles.addText}>Add Image</Text>
      </View>
    </Card>
  );

  const canAddMore = selectedImages.length < maxImages;
  const hasMinimumImages = selectedImages.length >= MIN_SLIDES;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Images</Text>
        <Text style={styles.subtitle}>
          {selectedImages.length}/{maxImages} images selected
        </Text>
      </View>

      <FlatList
        data={[...selectedImages, ...(canAddMore ? ['add'] : [])]}
        renderItem={({ item, index }) => 
          item === 'add' ? renderAddButton() : renderImageItem({ item, index })
        }
        keyExtractor={(item, index) => item === 'add' ? 'add' : `${item}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Button
          title="Pick from Gallery"
          onPress={pickImages}
          disabled={!canAddMore || isLoading}
          loading={isLoading}
          style={styles.pickButton}
        />
        
        {!hasMinimumImages && (
          <Text style={styles.warningText}>
            Select at least {MIN_SLIDES} images to continue
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.lg,
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
  },
  grid: {
    paddingBottom: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  imageCard: {
    width: '48%',
    aspectRatio: 1,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: colors.light.text,
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },
  addCard: {
    width: '48%',
    aspectRatio: 1,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  addContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 32,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  addText: {
    fontSize: typography.sizes.sm,
    color: colors.light.textSecondary,
    fontWeight: typography.weights.medium,
  },
  footer: {
    marginTop: spacing.lg,
  },
  pickButton: {
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: typography.sizes.sm,
    color: colors.light.error,
    textAlign: 'center',
  },
});

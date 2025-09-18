import { Directory } from 'expo-file-system';
import { copyAsync, makeDirectoryAsync } from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export const generateFilename = (projectId: string, slideIndex: number): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `project_${timestamp}_slide_${slideIndex + 1}.png`;
};

export const getExportDirectory = (): string => {
  // Use cache directory for temporary files
  return 'CarouselCraft/';
};

export const ensureExportDirectory = async (): Promise<void> => {
  const dirPath = getExportDirectory();
  const directory = new Directory(dirPath);
  
  if (!directory.exists) {
    await makeDirectoryAsync(dirPath, { intermediates: true });
  }
};

export const saveSlideImage = async (
  imageUri: string,
  filename: string
): Promise<string> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      // Try to create/find album
      const albumName = 'CarouselCraft';
      let album = await MediaLibrary.getAlbumAsync(albumName);
      if (!album) {
        album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      return asset.uri ?? imageUri;
    }
  } catch (error) {
    // Fallback to internal directory if media library fails
    console.warn('MediaLibrary save failed, falling back to internal storage', error);
  }

  await ensureExportDirectory();
  const destination = `${getExportDirectory()}${filename}`;
  await copyAsync({ from: imageUri, to: destination });
  return destination;
};

export const shareImage = async (imageUri: string): Promise<void> => {
  if (Platform.OS === 'ios') {
    await Sharing.shareAsync(imageUri);
  } else {
    // Android sharing
    await Sharing.shareAsync(imageUri);
  }
};

export const shareMultipleImages = async (imageUris: string[]): Promise<void> => {
  try {
    // Share images one by one with proper error handling
    for (const uri of imageUris) {
      try {
        await shareImage(uri);
        // Small delay to prevent overwhelming the share sheet
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (individualError) {
        console.error('Failed to share individual image:', uri, individualError);
        // Continue with next image instead of stopping
      }
    }
  } catch (error) {
    console.warn('Bulk sharing failed:', error);
  }
};

export const getExportQuality = (): number => {
  // High quality for Instagram
  return 1.0;
};

export const getExportFormat = (): 'png' | 'jpg' => {
  return 'png';
};

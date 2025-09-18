import { copyAsync, documentDirectory, getInfoAsync, makeDirectoryAsync } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export const generateFilename = (projectId: string, slideIndex: number): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `project_${timestamp}_slide_${slideIndex + 1}.png`;
};

export const getExportDirectory = (): string => {
  return `${documentDirectory}CarouselCraft/`;
};

export const ensureExportDirectory = async (): Promise<void> => {
  const dir = getExportDirectory();
  const dirInfo = await getInfoAsync(dir);
  
  if (!dirInfo.exists) {
    await makeDirectoryAsync(dir, { intermediates: true });
  }
};

export const saveSlideImage = async (
  imageUri: string,
  filename: string
): Promise<string> => {
  await ensureExportDirectory();
  const destination = `${getExportDirectory()}${filename}`;
  
  await copyAsync({
    from: imageUri,
    to: destination,
  });
  
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
  // For multiple images, we'll share them one by one
  // In a production app, you might want to create a zip file
  for (const uri of imageUris) {
    await shareImage(uri);
  }
};

export const getExportQuality = (): number => {
  // High quality for Instagram
  return 1.0;
};

export const getExportFormat = (): 'png' | 'jpg' => {
  return 'png';
};

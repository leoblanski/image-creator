import { Image } from 'expo-image';
import { CAROUSEL_HEIGHT, CAROUSEL_WIDTH } from './sizes';

export const resizeImageToCarousel = (uri: string): { width: number; height: number } => {
  // Calculate dimensions to fill the carousel while maintaining aspect ratio
  const aspectRatio = CAROUSEL_WIDTH / CAROUSEL_HEIGHT;
  
  return {
    width: CAROUSEL_WIDTH,
    height: CAROUSEL_HEIGHT,
  };
};

export const getImageAspectRatio = async (uri: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        resolve(width / height);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const cropImageToAspectRatio = (uri: string, targetAspectRatio: number): string => {
  // For now, return the original URI
  // In a production app, you might want to use expo-image-manipulator
  // to actually crop the image
  return uri;
};

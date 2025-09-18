import { Image } from 'expo-image';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { getPreset } from '../../../core/presets';
import { CAROUSEL_HEIGHT, CAROUSEL_WIDTH, PREVIEW_HEIGHT, PREVIEW_WIDTH } from '../../../core/sizes';
import { colors } from '../../../core/theme';
import { Slide } from '../models/Slide';

interface SlideCanvasProps {
  slide: Slide;
  showSafeArea?: boolean;
  isPreview?: boolean;
  viewShotRef?: React.RefObject<ViewShot>;
  language?: 'pt-BR' | 'en-US';
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  showSafeArea = false,
  isPreview = true,
  viewShotRef,
  language = 'en-US',
}) => {
  const preset = getPreset(slide.styleId);
  const { textTitle, textBody, backgroundUri } = slide;

  console.log('SlideCanvas render:', {
    slideId: slide.id,
    backgroundUri,
    textTitle,
    textBody,
    styleId: slide.styleId,
    isPreview
  });

  // Use full size for both preview and final output to ensure consistency
  const canvasSize = Math.min(CAROUSEL_WIDTH, CAROUSEL_HEIGHT);
  const scale = 1;

  const renderOverlay = () => {
    // Enhanced dark overlay for better text readability
    return (
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: '#000000',
            opacity: 0.5, // Increased opacity for better text visibility
          },
        ]}
      />
    );
  };

  const renderTextContent = () => {
    const formatTitleForInstagram = (text?: string): string | undefined => {
      if (!text) return text;

      // Professional line breaking for Instagram carousels
      const words = text.split(' ');

      if (words.length <= 4) {
        return text; // Keep short titles on one line
      }

      // Smart breaking: aim for 2-3 lines max, balanced word distribution
      if (words.length <= 8) {
        // Split roughly in half
        const mid = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, mid).join(' ');
        const secondLine = words.slice(mid).join(' ');
        return `${firstLine}\n${secondLine}`;
      } else {
        // For longer titles, try 3 lines
        const wordsPerLine = Math.ceil(words.length / 3);
        const lines = [];
        for (let i = 0; i < words.length; i += wordsPerLine) {
          lines.push(words.slice(i, i + wordsPerLine).join(' '));
        }
        return lines.slice(0, 3).join('\n');
      }
    };

    return (
      <View style={[
        styles.textContainer,
        {
          paddingHorizontal: 40 * scale,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: canvasSize * 0.15, // 15% from top
          paddingBottom: canvasSize * 0.15, // 15% from bottom
        }
      ]}>
        <View style={styles.titleContainer}>
          {textTitle && (
            <Text style={[
              styles.title,
              {
                fontSize: 30 * scale,
                fontWeight: '800',
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 36 * scale,
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 8,
                letterSpacing: -0.5 * scale,
                padding: 8 * scale,
              }
            ]}
              numberOfLines={4}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {formatTitleForInstagram(textTitle)}
            </Text>
          )}
        </View>
      </View>
    );
  };


  const renderSafeArea = () => {
    if (!showSafeArea) return null;

    return (
      <View style={styles.safeArea}>
        <View style={styles.safeAreaLine} />
        <View style={[styles.safeAreaLine, { top: canvasSize - 20 }]} />
        <View style={[styles.safeAreaLine, { width: 1, height: canvasSize, top: 0, left: 20 }]} />
        <View style={[styles.safeAreaLine, { width: 1, height: canvasSize, top: 0, right: 20 }]} />
      </View>
    );
  };

  return (
    <ViewShot
      ref={viewShotRef}
      options={{
        format: 'png',
        quality: 1,
        width: CAROUSEL_WIDTH,
        height: CAROUSEL_HEIGHT,
      }}
      style={[
        styles.canvas,
        {
          width: isPreview ? PREVIEW_WIDTH : canvasSize,
          height: isPreview ? PREVIEW_HEIGHT : canvasSize,
          aspectRatio: 1, // Ensure 1:1 aspect ratio
          transform: isPreview ? [{ scale: 1 / 3 }] : [],
          transformOrigin: 'top left',
        },
      ]}
    >
      {backgroundUri ? (
        <Image
          source={{ uri: backgroundUri }}
          style={styles.backgroundImage}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.backgroundImage, { backgroundColor: colors.light.surface }]} />
      )}

      {renderOverlay()}
      {/* First slide navigation hint */}
      {slide.index === 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: canvasSize * 0.2, // 20% padding bottom
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              paddingHorizontal: 24 * scale,
              paddingVertical: 8 * scale,
              borderRadius: 20 * scale,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16 * scale,
                fontWeight: '600',
                letterSpacing: 0.5 * scale,
              }}
            >
              {language === 'pt-BR' ? 'Deslize para ver mais →' : 'Swipe for more →'}
            </Text>
          </View>
        </View>
      )}
      {renderTextContent()}
      {renderSafeArea()}
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  canvas: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.light.surface,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontWeight: '900',
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  safeAreaLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    width: '100%',
    height: 1,
    top: 20,
  },
});

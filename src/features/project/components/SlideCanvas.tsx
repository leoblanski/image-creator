import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  showSafeArea = false,
  isPreview = true,
  viewShotRef,
}) => {
  const preset = getPreset(slide.styleId);
  const { textTitle, textBody, backgroundUri } = slide;

  const canvasWidth = isPreview ? PREVIEW_WIDTH : CAROUSEL_WIDTH;
  const canvasHeight = isPreview ? PREVIEW_HEIGHT : CAROUSEL_HEIGHT;

  const scale = isPreview ? 1/3 : 1;

  const renderOverlay = () => {
    if (preset.overlay.type === 'gradient' && preset.overlay.gradient) {
      return (
        <LinearGradient
          colors={preset.overlay.gradient.colors}
          start={preset.overlay.gradient.start}
          end={preset.overlay.gradient.end}
          style={[
            styles.overlay,
            { opacity: preset.overlay.opacity },
          ]}
        />
      );
    } else {
      return (
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: preset.overlay.color,
              opacity: preset.overlay.opacity,
            },
          ]}
        />
      );
    }
  };

  const renderTextContent = () => {
    const titleStyle = {
      ...preset.titleStyle,
      fontSize: preset.titleStyle.fontSize * scale,
      position: {
        top: preset.titleStyle.position.top * scale,
        left: preset.titleStyle.position.left * scale,
        right: preset.titleStyle.position.right * scale,
      },
    };

    const bodyStyle = {
      ...preset.bodyStyle,
      fontSize: preset.bodyStyle.fontSize * scale,
      position: {
        top: preset.bodyStyle.position.top * scale,
        left: preset.bodyStyle.position.left * scale,
        right: preset.bodyStyle.position.right * scale,
      },
    };

    return (
      <View style={styles.textContainer}>
        {textTitle && (
          <Text style={[styles.title, titleStyle]}>
            {textTitle}
          </Text>
        )}
        {textBody && (
          <Text style={[styles.body, bodyStyle]}>
            {textBody}
          </Text>
        )}
      </View>
    );
  };

  const renderBackgroundCard = () => {
    if (!preset.backgroundCard) return null;

    const cardStyle = {
      ...preset.backgroundCard,
      position: {
        top: preset.backgroundCard.position.top * scale,
        left: preset.backgroundCard.position.left * scale,
        right: preset.backgroundCard.position.right * scale,
        bottom: preset.backgroundCard.position.bottom * scale,
      },
      padding: preset.backgroundCard.padding * scale,
      borderRadius: preset.backgroundCard.borderRadius * scale,
    };

    return (
      <View style={[styles.backgroundCard, cardStyle]}>
        {renderTextContent()}
      </View>
    );
  };

  const renderSafeArea = () => {
    if (!showSafeArea) return null;

    return (
      <View style={styles.safeArea}>
        <View style={styles.safeAreaLine} />
        <View style={[styles.safeAreaLine, { top: canvasHeight - 20 }]} />
        <View style={[styles.safeAreaLine, { width: 1, height: canvasHeight, top: 0, left: 20 }]} />
        <View style={[styles.safeAreaLine, { width: 1, height: canvasHeight, top: 0, right: 20 }]} />
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
          width: canvasWidth,
          height: canvasHeight,
        },
      ]}
    >
      <Image
        source={{ uri: backgroundUri }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      
      {renderOverlay()}
      
      {preset.backgroundCard ? renderBackgroundCard() : renderTextContent()}
      
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
    position: 'absolute',
    fontWeight: '900',
  },
  body: {
    position: 'absolute',
  },
  backgroundCard: {
    position: 'absolute',
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


export type PresetId = 'classic_black' | 'tech_blue' | 'bold_card';

export interface Preset {
  id: PresetId;
  name: string;
  description: string;
  titleStyle: {
    fontSize: number;
    fontWeight: '400' | '500' | '600' | '700' | '900';
    color: string;
    textAlign: 'left' | 'center' | 'right';
    position: { top: number; left: number; right: number };
    textShadow?: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
  };
  bodyStyle: {
    fontSize: number;
    fontWeight: '400' | '500' | '600' | '700' | '900';
    color: string;
    textAlign: 'left' | 'center' | 'right';
    position: { top: number; left: number; right: number };
    textShadow?: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
    };
  };
  overlay: {
    type: 'solid' | 'gradient';
    color?: string;
    gradient?: {
      colors: string[];
      start: { x: number; y: number };
      end: { x: number; y: number };
    };
    opacity: number;
  };
  backgroundCard?: {
    backgroundColor: string;
    borderRadius: number;
    padding: number;
    position: { top: number; left: number; right: number; bottom: number };
  };
}

export const presets: Record<PresetId, Preset> = {
  classic_black: {
    id: 'classic_black',
    name: 'Classic Black',
    description: 'Dark overlay with top-left aligned text',
    titleStyle: {
      fontSize: 32,
      fontWeight: '900',
      color: '#FFFFFF',
      textAlign: 'left',
      position: { top: 60, left: 40, right: 40 },
      textShadow: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
    },
    bodyStyle: {
      fontSize: 18,
      fontWeight: '500',
      color: '#FFFFFF',
      textAlign: 'left',
      position: { top: 120, left: 40, right: 40 },
      textShadow: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
    },
    overlay: {
      type: 'solid',
      color: '#000000',
      opacity: 0.4,
    },
  },
  tech_blue: {
    id: 'tech_blue',
    name: 'Tech Blue',
    description: 'Blue gradient with centered text',
    titleStyle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
      position: { top: 200, left: 40, right: 40 },
      textShadow: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
      },
    },
    bodyStyle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FFFFFF',
      textAlign: 'center',
      position: { top: 260, left: 40, right: 40 },
      textShadow: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
      },
    },
    overlay: {
      type: 'gradient',
      gradient: {
        colors: ['#0EA5E9', '#2563EB'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      opacity: 0.35,
    },
  },
  bold_card: {
    id: 'bold_card',
    name: 'Bold Card',
    description: 'Semi-transparent card with bottom text',
    titleStyle: {
      fontSize: 30,
      fontWeight: '800',
      color: '#000000',
      textAlign: 'left',
      position: { top: 0, left: 0, right: 0 },
    },
    bodyStyle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333333',
      textAlign: 'left',
      position: { top: 0, left: 0, right: 0 },
    },
    overlay: {
      type: 'solid',
      color: '#000000',
      opacity: 0.1,
    },
    backgroundCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 24,
      position: { top: 800, left: 40, right: 40, bottom: 60 },
    },
  },
};

export const getPreset = (id: PresetId): Preset => {
  return presets[id];
};

export const getAllPresets = (): Preset[] => {
  return Object.values(presets);
};

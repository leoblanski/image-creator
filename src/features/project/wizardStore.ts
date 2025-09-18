import { create } from 'zustand';
import { PresetId } from '../../core/presets';
import { TrendingTopic } from './trendingService';

export interface WizardStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface WizardData {
  selectedImages: string[];
  category: string;
  selectedTopic: TrendingTopic | null;
  goal: string;
  audience: string;
  language: 'pt-BR' | 'en-US';
  tone: string;
  presetId: PresetId;
  keyPoints: string[];
  cta: string;
  hashtags: string[];
}

interface WizardStore {
  currentStep: number;
  steps: WizardStep[];
  data: WizardData;
  isCompleted: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateStepData: (updates: Partial<WizardData>) => void;
  markStepCompleted: (stepIndex: number) => void;
  resetWizard: () => void;
  canProceed: () => boolean;
  initializeSteps: (t: (key: string) => string) => void;
}

const getInitialSteps = (t: (key: string) => string): WizardStep[] => [
  { id: 'category', title: t('wizard.steps.category'), completed: false },
  { id: 'topics', title: t('wizard.steps.topics'), completed: false },
  { id: 'images', title: t('wizard.steps.images'), completed: false },
  { id: 'style', title: t('wizard.steps.style'), completed: false },
  { id: 'cta', title: t('wizard.steps.cta'), completed: false },
];

const initialData: WizardData = {
  selectedImages: [],
  category: '',
  selectedTopic: null,
  goal: 'Education',
  audience: '',
  language: 'en-US',
  tone: '',
  presetId: 'classic_black',
  keyPoints: [],
  cta: '',
  hashtags: [],
};

export const useWizardStore = create<WizardStore>((set, get) => ({
  currentStep: 0,
  steps: [],
  data: initialData,
  isCompleted: false,

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  updateStepData: (updates) => {
    const { data } = get();
    set({ data: { ...data, ...updates } });
  },

  markStepCompleted: (stepIndex) => {
    const { steps } = get();
    const updatedSteps = steps.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    );
    set({ steps: updatedSteps });
  },

  resetWizard: () => {
    set({
      currentStep: 0,
      steps: [],
      data: initialData,
      isCompleted: false,
    });
  },

  initializeSteps: (t) => {
    set({ steps: getInitialSteps(t) });
  },

  canProceed: () => {
    const { currentStep, data } = get();
    
    switch (currentStep) {
      case 0: // Category
        return data.category.length > 0;
      case 1: // Trending Topics
        return data.selectedTopic !== null;
      case 2: // Images
        return data.selectedImages.length >= 2;
      case 3: // Tone & Style
        return data.tone.length > 0;
      case 4: // CTA & Hashtags
        return true; // Optional step
      default:
        return false;
    }
  },
}));

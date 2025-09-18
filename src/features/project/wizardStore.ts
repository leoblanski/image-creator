import { create } from 'zustand';
import { PresetId } from '../../core/presets';

export interface WizardStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface WizardData {
  selectedImages: string[];
  category: string;
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
}

const initialSteps: WizardStep[] = [
  { id: 'images', title: 'Select Images', completed: false },
  { id: 'content', title: 'Content & Goal', completed: false },
  { id: 'style', title: 'Tone & Style', completed: false },
  { id: 'points', title: 'Key Points', completed: false },
  { id: 'cta', title: 'CTA & Hashtags', completed: false },
];

const initialData: WizardData = {
  selectedImages: [],
  category: '',
  goal: '',
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
  steps: initialSteps,
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
      steps: initialSteps,
      data: initialData,
      isCompleted: false,
    });
  },

  canProceed: () => {
    const { currentStep, data } = get();
    
    switch (currentStep) {
      case 0: // Images
        return data.selectedImages.length >= 2;
      case 1: // Content & Goal
        return data.category.length > 0 && data.goal.length > 0 && data.audience.length > 0;
      case 2: // Tone & Style
        return data.tone.length > 0;
      case 3: // Key Points
        return data.keyPoints.length > 0;
      case 4: // CTA & Hashtags
        return true; // Optional step
      default:
        return false;
    }
  },
}));

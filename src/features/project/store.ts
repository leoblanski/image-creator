import { create } from 'zustand';
import { PresetId } from '../../core/presets';
import { Project, addSlide, createProject, removeSlide, reorderSlides, updateProjectMetadata, updateSlide } from './models/Project';
import { Slide } from './models/Slide';

interface ProjectStore {
  currentProject: Project | null;
  recentProjects: Project[];
  
  // Actions
  createNewProject: (slides: Slide[], language?: 'pt-BR' | 'en-US', presetId?: PresetId) => void;
  updateCurrentProject: (updates: Partial<Project>) => void;
  addSlideToProject: (slide: Slide) => void;
  updateSlideInProject: (slideId: string, updatedSlide: Slide) => void;
  removeSlideFromProject: (slideId: string) => void;
  reorderProjectSlides: (slideIds: string[]) => void;
  saveProject: () => void;
  loadProject: (projectId: string) => void;
  clearCurrentProject: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  recentProjects: [],

  createNewProject: (slides, language = 'en-US', presetId = 'classic_black') => {
    const project = createProject(
      `project_${Date.now()}`,
      slides,
      language,
      presetId
    );
    set({ currentProject: project });
  },

  updateCurrentProject: (updates) => {
    const { currentProject } = get();
    if (currentProject) {
      const updatedProject = updateProjectMetadata(currentProject, updates);
      set({ currentProject: updatedProject });
    }
  },

  addSlideToProject: (slide) => {
    const { currentProject } = get();
    if (currentProject) {
      const updatedProject = addSlide(currentProject, slide);
      set({ currentProject: updatedProject });
    }
  },

  updateSlideInProject: (slideId, updatedSlide) => {
    const { currentProject } = get();
    if (currentProject) {
      const updatedProject = updateSlide(currentProject, slideId, updatedSlide);
      set({ currentProject: updatedProject });
    }
  },

  removeSlideFromProject: (slideId) => {
    const { currentProject } = get();
    if (currentProject) {
      const updatedProject = removeSlide(currentProject, slideId);
      set({ currentProject: updatedProject });
    }
  },

  reorderProjectSlides: (slideIds) => {
    const { currentProject } = get();
    if (currentProject) {
      const updatedProject = reorderSlides(currentProject, slideIds);
      set({ currentProject: updatedProject });
    }
  },

  saveProject: () => {
    const { currentProject, recentProjects } = get();
    if (currentProject) {
      const updatedRecent = [currentProject, ...recentProjects.slice(0, 4)];
      set({ recentProjects: updatedRecent });
    }
  },

  loadProject: (projectId) => {
    const { recentProjects } = get();
    const project = recentProjects.find(p => p.id === projectId);
    if (project) {
      set({ currentProject: project });
    }
  },

  clearCurrentProject: () => {
    set({ currentProject: null });
  },
}));

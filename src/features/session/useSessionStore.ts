import { create } from 'zustand';
import type { Exercise } from '../../types';

export interface SessionState {
  queue: Exercise[];
  currentIndex: number;
  isRunning: boolean;
  elapsed: number;
  startSession: (exercises: Exercise[], startIndex?: number) => void;
  toggleRun: () => void;
  next: () => void;
  prev: () => void;
  addToSession: (exercise: Exercise) => void;
  tick: () => void;
}

const initialState = {
  queue: [] as Exercise[],
  currentIndex: -1,
  isRunning: false,
  elapsed: 0,
};

export const useSessionStore = create<SessionState>()((set, get) => ({
  ...initialState,

  startSession: (exercises: Exercise[], startIndex = 0) => {
    if (exercises.length === 0) {
      set({
        queue: [],
        currentIndex: -1,
        isRunning: false,
        elapsed: 0,
      });
      return;
    }
    const validIndex = Math.max(0, Math.min(startIndex, exercises.length - 1));
    set({
      queue: exercises,
      currentIndex: validIndex,
      elapsed: 0,
      isRunning: true,
    });
  },

  toggleRun: () => {
    const { isRunning, queue, currentIndex } = get();
    if (queue.length === 0) return;
    if (currentIndex === -1) {
      set({ currentIndex: 0, isRunning: true, elapsed: 0 });
    } else {
      set({ isRunning: !isRunning });
    }
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1, elapsed: 0 });
    } else {
      set({ isRunning: false, elapsed: 0 });
    }
  },

  prev: () => {
    const { currentIndex, elapsed } = get();
    if (currentIndex < 0) return;
    if (elapsed > 3) {
      set({ elapsed: 0 });
    } else if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, elapsed: 0 });
    } else {
      set({ elapsed: 0 });
    }
  },

  addToSession: (exercise: Exercise) => {
    const { queue, currentIndex } = get();
    if (queue.some((e) => e.id === exercise.id)) {
      return;
    }
    const newQueue = [...queue, exercise];
    set({
      queue: newQueue,
      currentIndex: currentIndex === -1 ? 0 : currentIndex,
    });
  },

  tick: () => {
    const { queue, currentIndex, elapsed, isRunning } = get();
    if (!isRunning || currentIndex < 0 || currentIndex >= queue.length) return;
    const current = queue[currentIndex];
    if (!current) return;

    if (elapsed + 1 >= current.duration) {
      get().next();
    } else {
      set({ elapsed: elapsed + 1 });
    }
  },
}));


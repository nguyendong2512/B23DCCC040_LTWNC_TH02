export interface Routine {
  id: string;
  name: string;
  exerciseIds: string[];
}

export type RoutineAction =
  | { type: 'create'; payload: { name: string; id?: string } }
  | { type: 'rename'; payload: { id: string; name: string } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'addExercise'; payload: { routineId: string; exerciseId: string } }
  | { type: 'removeExercise'; payload: { routineId: string; exerciseId: string } };

export const routineReducer = (
  state: Routine[],
  action: RoutineAction
): Routine[] => {
  switch (action.type) {
    case 'create': {
      const newRoutine: Routine = {
        id:
          action.payload.id ||
          `routine-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: action.payload.name,
        exerciseIds: [],
      };
      return [...state, newRoutine];
    }
    case 'rename': {
      return state.map((r) =>
        r.id === action.payload.id ? { ...r, name: action.payload.name } : r
      );
    }
    case 'remove': {
      const exists = state.some((r) => r.id === action.payload.id);
      if (!exists) {
        return state;
      }
      return state.filter((r) => r.id !== action.payload.id);
    }
    case 'addExercise': {
      return state.map((r) => {
        if (r.id !== action.payload.routineId) return r;
        if (r.exerciseIds.includes(action.payload.exerciseId)) return r;
        return {
          ...r,
          exerciseIds: [...r.exerciseIds, action.payload.exerciseId],
        };
      });
    }
    case 'removeExercise': {
      return state.map((r) => {
        if (r.id !== action.payload.routineId) return r;
        return {
          ...r,
          exerciseIds: r.exerciseIds.filter(
            (id) => id !== action.payload.exerciseId
          ),
        };
      });
    }
    default:
      return state;
  }
};


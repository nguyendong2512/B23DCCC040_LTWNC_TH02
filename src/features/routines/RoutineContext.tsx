import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { Routine, RoutineAction } from './routineReducer';
import { routineReducer } from './routineReducer';
import { withLogger } from './withLogger';

export const RoutineStateContext = createContext<Routine[] | null>(null);
export const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | null>(null);

const ROUTINES_STORAGE_KEY = 'workout-routines';

const loadInitialRoutines = (): Routine[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ROUTINES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export interface RoutineProviderProps {
  children: ReactNode;
  initialRoutines?: Routine[];
}

export const RoutineProvider = ({
  children,
  initialRoutines,
}: RoutineProviderProps) => {
  const [routines, dispatch] = useReducer(
    withLogger(routineReducer),
    initialRoutines ?? undefined,
    (init) => init ?? loadInitialRoutines()
  );

  useEffect(() => {
    try {
      localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(routines));
    } catch {
      // ignore
    }
  }, [routines]);

  return (
    <RoutineDispatchContext.Provider value={dispatch}>
      <RoutineStateContext.Provider value={routines}>
        {children}
      </RoutineStateContext.Provider>
    </RoutineDispatchContext.Provider>
  );
};

export function useRoutines(): Routine[] {
  const context = useContext(RoutineStateContext);
  if (!context) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
}

export function useRoutineDispatch(): React.Dispatch<RoutineAction> {
  const context = useContext(RoutineDispatchContext);
  if (!context) {
    throw new Error('useRoutineDispatch must be used within a RoutineProvider');
  }
  return context;
}

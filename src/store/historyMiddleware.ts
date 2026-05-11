// History middleware for Zustand stores
// Captures state snapshots and provides undo/redo

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function createHistoryMiddleware<T extends object>(
  limit = 50
) {
  return (config: any) => {
    return (set: any, get: any, api: any) => {
      let history: HistoryState<T> = {
        past: [],
        present: config.init,
        future: [],
      };

      const recordChange = (newState: T) => {
        // Only record if state actually changed
        if (newState === history.present) return;

        history = {
          past: [...history.past, history.present].slice(-limit),
          present: newState,
          future: [],
        };
      };

      const undo = () => {
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);
        history = {
          past: newPast,
          present: previous,
          future: [history.present, ...history.future],
        };
        set(previous);
      };

      const redo = () => {
        if (history.future.length === 0) return;
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        history = {
          past: [...history.past, history.present],
          present: next,
          future: newFuture,
        };
        set(next);
      };

      const canUndo = () => history.past.length > 0;
      const canRedo = () => history.future.length > 0;

      // Wrap the original set to capture changes
      const wrappedSet = (partial: Partial<T> | ((state: T) => Partial<T>)): void => {
        const prev = get();
        set(partial);
        // After state updates, record it
        setTimeout(() => {
          const current = get();
          recordChange(current);
        }, 0);
      };

      // Expose history operations as actions
      const stateWithHistory = {
        ...config(),
        __history: history,
        __undo: undo,
        __redo: redo,
        __canUndo: canUndo,
        __canRedo: canRedo,
        __clearHistory: () => {
          history = { past: [], present: get(), future: [] };
        },
      };

      return {
        ...stateWithHistory,
        set: wrappedSet,
        getState: () => history.present,
      };
    };
  };
}

// Usage example (for manual integration):
// export const usePortfolioStore = create(historyMiddleware((set, get) => ({ ... })));

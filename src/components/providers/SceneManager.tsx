'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SceneState } from '@/types';

interface SceneContextType {
  scene: SceneState;
  setScene: (s: SceneState) => void;
  transitionTo: (s: SceneState) => void;
}

const SceneContext = createContext<SceneContextType>({
  scene: 'loading',
  setScene: () => {},
  transitionTo: () => {},
});

export function useScene() {
  return useContext(SceneContext);
}

interface SceneManagerProps {
  children: ReactNode;
}

export function SceneManager({ children }: SceneManagerProps) {
  const [scene, setScene] = useState<SceneState>('loading');

  const transitionTo = useCallback((newScene: SceneState) => {
    setScene(newScene);
  }, []);

  return (
    <SceneContext value={{ scene, setScene, transitionTo }}>
      {children}
    </SceneContext>
  );
}

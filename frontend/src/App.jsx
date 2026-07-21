import React, { useEffect } from 'react';
import { useUserStore } from './store/userStore';
import { useGameStore } from './store/gameStore';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultScreen } from './screens/ResultScreen';

export function App() {
  const initUser = useUserStore((state) => state.initUser);
  const screen = useGameStore((state) => state.screen);

  useEffect(() => {
    initUser();
  }, [initUser]);

  return (
    <main className="w-full min-h-screen bg-cyber-dark text-cyber-text antialiased">
      {screen === 'home' && <HomeScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'result' && <ResultScreen />}
    </main>
  );
}

export default App;

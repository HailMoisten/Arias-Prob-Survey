
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen.js';
import GameScreen from './components/GameScreen.js';
import { GameMode } from './types.js';
import { GameStateProvider } from './hooks/useGameState.js';

const App: React.FC = () => {
  return (
    <GameStateProvider>
      <div className="min-h-screen w-full max-w-md mx-auto bg-yellow-100/50 shadow-2xl flex flex-col font-jp">
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/game" element={<GameScreen mode={GameMode.NORMAL} />} />
            <Route path="/training" element={<GameScreen mode={GameMode.TRAINING} />} />
          </Routes>
        </HashRouter>
      </div>
    </GameStateProvider>
  );
};

export default App;
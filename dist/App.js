import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen.tsx';
import GameScreen from './components/GameScreen.tsx';
import { GameMode } from './types.ts';
import { GameStateProvider } from './hooks/useGameState.tsx';
const App = () => {
    return (_jsx(GameStateProvider, { children: _jsx("div", { className: "min-h-screen w-full max-w-md mx-auto bg-yellow-100/50 shadow-2xl flex flex-col font-jp", children: _jsx(HashRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomeScreen, {}) }), _jsx(Route, { path: "/game", element: _jsx(GameScreen, { mode: GameMode.NORMAL }) }), _jsx(Route, { path: "/training", element: _jsx(GameScreen, { mode: GameMode.TRAINING }) })] }) }) }) }));
};
export default App;

import { jsx, Fragment } from "react/jsx-runtime";
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen.js';
import GameScreen from './components/GameScreen.js';
import { GameMode } from './types.js';
import { GameStateProvider } from './hooks/useGameState.js';
const App = () => {
    return (jsx(GameStateProvider, { children: jsx("div", { className: "min-h-screen w-full max-w-md mx-auto bg-yellow-100/50 shadow-2xl flex flex-col font-jp", children: jsx(HashRouter, { children: jsx(Routes, { children: jsxs(Fragment, { children: [jsx(Route, { path: "/", element: jsx(HomeScreen, {}) }), jsx(Route, { path: "/game", element: jsx(GameScreen, { mode: GameMode.NORMAL }) }), jsx(Route, { path: "/training", element: jsx(GameScreen, { mode: GameMode.TRAINING }) })] }) }) }) }) }));
};
export default App;

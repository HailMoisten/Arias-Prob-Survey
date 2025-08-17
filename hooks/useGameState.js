
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerState } from '../types.js';
import { INITIAL_CHIPS, INITIAL_TRAINING_CHIPS, DAILY_CHIP_REWARD } from '../constants.js';

const GAME_STATE_KEY = 'aria-probability-game-state';
const LAST_DAILY_CHIP_DATE_KEY = 'aria-probability-last-daily-chip-date';

interface GameStateContextType {
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  canPlayNormalMode: boolean;
  addChips: (amount: number) => void;
  markAsPlayed: () => void;
  claimDailyChip: () => boolean;
  hasClaimedDailyChipToday: boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

const getInitialState = (): PlayerState => {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return { ...parsedState, chipHistory: parsedState.chipHistory || [] };
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return {
    chips: INITIAL_CHIPS,
    trainingChips: INITIAL_TRAINING_CHIPS,
    lastPlayedDate: null,
    chipHistory: [],
  };
};

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerState>(getInitialState);
  const [canPlayNormalMode, setCanPlayNormalMode] = useState<boolean>(true);
  const [hasClaimedDailyChipToday, setHasClaimedDailyChipToday] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastRewardDate = localStorage.getItem(LAST_DAILY_CHIP_DATE_KEY);
    setHasClaimedDailyChipToday(lastRewardDate === today);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(playerState));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
    const today = new Date().toISOString().split('T')[0];
    setCanPlayNormalMode(playerState.lastPlayedDate !== today);
  }, [playerState]);

  const addChips = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    setPlayerState(prevState => {
      const newChips = Math.max(0, prevState.chips + amount);
      const newHistory = [...prevState.chipHistory];
      const todayEntryIndex = newHistory.findIndex(entry => entry.date === today);

      if (todayEntryIndex > -1) {
        newHistory[todayEntryIndex].chips = newChips;
      } else {
        newHistory.push({ date: today, chips: newChips });
      }
      
      return {
        ...prevState,
        chips: newChips,
        chipHistory: newHistory.slice(-30),
      };
    });
  };

  const markAsPlayed = () => {
    const today = new Date().toISOString().split('T')[0];
    setPlayerState(prevState => ({
      ...prevState,
      lastPlayedDate: today,
    }));
  };

  const claimDailyChip = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const lastRewardDate = localStorage.getItem(LAST_DAILY_CHIP_DATE_KEY);

    if (lastRewardDate !== today) {
        addChips(DAILY_CHIP_REWARD);
        localStorage.setItem(LAST_DAILY_CHIP_DATE_KEY, today);
        setHasClaimedDailyChipToday(true);
        return true;
    }
    return false;
  };
  
  const value = { playerState, setPlayerState, canPlayNormalMode, addChips, markAsPlayed, claimDailyChip, hasClaimedDailyChipToday };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
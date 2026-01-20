import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@lucky_draw_session";
const SETTINGS_KEY = "@lucky_draw_settings";

interface GameSessionContextType {
  currentNumber: number | null;
  generatedNumbers: number[];
  availableNumbers: number[];
  isSessionComplete: boolean;
  isPaused: boolean;
  isAutoMode: boolean;
  autoSpeed: number;
  generateNumber: () => void;
  clearSession: () => void;
  togglePause: () => void;
  setAutoMode: (value: boolean) => void;
  setAutoSpeed: (value: number) => void;
  isLoading: boolean;
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

interface GameSessionProviderProps {
  children: ReactNode;
}

export function GameSessionProvider({ children }: GameSessionProviderProps) {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoSpeed, setAutoSpeedState] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  const availableNumbers = Array.from({ length: 100 }, (_, i) => i + 1).filter(
    (n) => !generatedNumbers.includes(n)
  );

  const isSessionComplete = availableNumbers.length === 0;

  useEffect(() => {
    loadSession();
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveSession();
    }
  }, [generatedNumbers, currentNumber, isPaused, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveSettings();
    }
  }, [isAutoMode, autoSpeed, isLoading]);

  const loadSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { currentNumber: savedCurrent, generatedNumbers: savedGenerated, isPaused: savedPaused } = JSON.parse(stored);
        setCurrentNumber(savedCurrent);
        setGeneratedNumbers(savedGenerated || []);
        setIsPaused(savedPaused !== undefined ? savedPaused : true);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const { isAutoMode: savedAutoMode, autoSpeed: savedAutoSpeed } = JSON.parse(stored);
        setIsAutoMode(savedAutoMode || false);
        setAutoSpeedState(savedAutoSpeed || 2);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const saveSession = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentNumber, generatedNumbers, isPaused })
      );
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ isAutoMode, autoSpeed })
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const generateNumber = useCallback(() => {
    if (availableNumbers.length === 0 || isPaused) return;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];

    setCurrentNumber(newNumber);
    setGeneratedNumbers((prev) => [...prev, newNumber]);
  }, [availableNumbers, isPaused]);

  const clearSession = useCallback(async () => {
    setCurrentNumber(null);
    setGeneratedNumbers([]);
    setIsPaused(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const setAutoMode = useCallback((value: boolean) => {
    setIsAutoMode(value);
    if (value) {
      setIsPaused(true);
    }
  }, []);

  const setAutoSpeed = useCallback((value: number) => {
    setAutoSpeedState(Math.max(1, Math.min(10, value)));
  }, []);

  return (
    <GameSessionContext.Provider
      value={{
        currentNumber,
        generatedNumbers,
        availableNumbers,
        isSessionComplete,
        isPaused,
        isAutoMode,
        autoSpeed,
        generateNumber,
        clearSession,
        togglePause,
        setAutoMode,
        setAutoSpeed,
        isLoading,
      }}
    >
      {children}
    </GameSessionContext.Provider>
  );
}

export function useGameSession() {
  const context = useContext(GameSessionContext);
  if (context === undefined) {
    throw new Error("useGameSession must be used within a GameSessionProvider");
  }
  return context;
}

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@lucky_draw_session";

interface GameSessionContextType {
  currentNumber: number | null;
  generatedNumbers: number[];
  availableNumbers: number[];
  isSessionComplete: boolean;
  isPaused: boolean;
  generateNumber: () => void;
  clearSession: () => void;
  togglePause: () => void;
  isLoading: boolean;
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

interface GameSessionProviderProps {
  children: ReactNode;
}

export function GameSessionProvider({ children }: GameSessionProviderProps) {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const availableNumbers = Array.from({ length: 100 }, (_, i) => i + 1).filter(
    (n) => !generatedNumbers.includes(n)
  );

  const isSessionComplete = availableNumbers.length === 0;

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveSession();
    }
  }, [generatedNumbers, currentNumber, isPaused, isLoading]);

  const loadSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { currentNumber: savedCurrent, generatedNumbers: savedGenerated, isPaused: savedPaused } = JSON.parse(stored);
        setCurrentNumber(savedCurrent);
        setGeneratedNumbers(savedGenerated || []);
        setIsPaused(savedPaused || false);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
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
    setIsPaused(false);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  return (
    <GameSessionContext.Provider
      value={{
        currentNumber,
        generatedNumbers,
        availableNumbers,
        isSessionComplete,
        isPaused,
        generateNumber,
        clearSession,
        togglePause,
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

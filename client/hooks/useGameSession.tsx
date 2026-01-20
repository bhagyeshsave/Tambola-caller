import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@lucky_draw_session";

interface GameSessionContextType {
  currentNumber: number | null;
  generatedNumbers: number[];
  availableNumbers: number[];
  isSessionComplete: boolean;
  generateNumber: () => void;
  clearSession: () => void;
  isLoading: boolean;
}

const GameSessionContext = createContext<GameSessionContextType | undefined>(undefined);

interface GameSessionProviderProps {
  children: ReactNode;
}

export function GameSessionProvider({ children }: GameSessionProviderProps) {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
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
  }, [generatedNumbers, currentNumber, isLoading]);

  const loadSession = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { currentNumber: savedCurrent, generatedNumbers: savedGenerated } = JSON.parse(stored);
        setCurrentNumber(savedCurrent);
        setGeneratedNumbers(savedGenerated || []);
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
        JSON.stringify({ currentNumber, generatedNumbers })
      );
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  };

  const generateNumber = useCallback(() => {
    if (availableNumbers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];

    setCurrentNumber(newNumber);
    setGeneratedNumbers((prev) => [...prev, newNumber]);
  }, [availableNumbers]);

  const clearSession = useCallback(async () => {
    setCurrentNumber(null);
    setGeneratedNumbers([]);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  }, []);

  return (
    <GameSessionContext.Provider
      value={{
        currentNumber,
        generatedNumbers,
        availableNumbers,
        isSessionComplete,
        generateNumber,
        clearSession,
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

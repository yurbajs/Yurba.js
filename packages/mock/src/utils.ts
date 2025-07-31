// Utility functions for mock data generation

export const randomBetween = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomBoolean = (probability: number = 0.5): boolean => 
  Math.random() < probability;

export const randomFromArray = <T>(array: T[]): T => 
  array[Math.floor(Math.random() * array.length)];

export const mockEmojis = ['🔥', '⭐', '💎', '🚀', '💯', '🎯', '⚡', '🌟'];

export const generateRandomEmoji = (): string => 
  randomFromArray(mockEmojis);
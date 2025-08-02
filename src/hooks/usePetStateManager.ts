import { useState, useEffect, useCallback } from 'react';

interface UsePetStateManagerProps {
  onStateChange: (state: {
    mood: string;
    lastInteraction: number;
    isVisible: boolean;
    customMessage: string | undefined;
    isNearAboutMe: boolean;
    hasInteracted: boolean;
  }) => void;
}

export const usePetStateManager = ({ onStateChange }: UsePetStateManagerProps) => {
  const [mood, setMood] = useState('happy');
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [isVisible, setIsVisible] = useState(false); // Default to hidden
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [isNearAboutMe, setIsNearAboutMe] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Update message based on interaction and location
  useEffect(() => {
    if (hasInteracted) {
      setCustomMessage('Hi!');
    } else {
      setCustomMessage('Hi! Are you also Song\'s friend?');
    }
  }, [isNearAboutMe, hasInteracted]);

  // Notify parent of state changes
  useEffect(() => {
    onStateChange({
      mood,
      lastInteraction,
      isVisible,
      customMessage,
      isNearAboutMe,
      hasInteracted
    });
  }, [mood, lastInteraction, isVisible, customMessage, isNearAboutMe, hasInteracted, onStateChange]);

  return {
    mood,
    setMood,
    lastInteraction,
    setLastInteraction,
    isVisible,
    setIsVisible,
    customMessage,
    isNearAboutMe,
    setIsNearAboutMe,
    hasInteracted,
    setHasInteracted
  };
};

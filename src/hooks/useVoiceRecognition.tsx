
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";

interface UseVoiceRecognitionProps {
  onResult: (text: string) => void;
}

export function useVoiceRecognition({ onResult }: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  
  // SpeechRecognition setup with proper type checking
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognitionAPI ? new SpeechRecognitionAPI() : null;
  
  useEffect(() => {
    if (!recognition) return;
    
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      toast.error("Sorry, I couldn't hear that.");
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    return () => {
      if (isListening && recognition) {
        recognition.stop();
      }
    };
  }, [recognition, onResult]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info("Listening...");
    }
  }, [isListening, recognition]);

  return {
    isListening,
    toggleListening,
    isSupported: !!recognition
  };
}

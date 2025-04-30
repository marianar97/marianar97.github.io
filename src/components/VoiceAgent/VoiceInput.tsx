
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  isListening: boolean;
  toggleListening: () => void;
  isDisabled: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  isListening, 
  toggleListening, 
  isDisabled 
}) => {
  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleListening}
        disabled={isDisabled}
        className={isListening ? "bg-red-50" : ""}
      >
        {isListening ? (
          <>
            <MicOff className="mr-2 h-4 w-4" /> Stop Listening
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" /> Start Listening
          </>
        )}
      </Button>
    </div>
  );
};

export default VoiceInput;

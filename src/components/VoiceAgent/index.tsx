
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { toast } from "sonner";

import ApiKeyInput from "./ApiKeyInput";
import VoiceInput from "./VoiceInput";
import QuestionForm from "./QuestionForm";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { generateResponse, speakResponse } from "./VoiceAgentService";

interface VoiceAgentProps {
  apiKey?: string;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ apiKey }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey || '');
  
  const handleQuestion = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Get response from service
      const response = generateResponse(text);
      
      // Speak the response using browser's text-to-speech
      speakResponse(response);
      
      toast.success("Response generated");
    } catch (error) {
      toast.error("Sorry, there was an error processing your question.");
      console.error("Voice agent error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuestion(question);
  };
  
  const handleApiKeySubmit = () => {
    setShowApiKeyInput(false);
  };

  const { isListening, toggleListening } = useVoiceRecognition({
    onResult: (text) => {
      setQuestion(text);
      handleQuestion(text);
    }
  });

  const checkApiKeyBeforeListening = () => {
    if (!apiKeyInput) {
      toast.error("Please enter an ElevenLabs API key first");
      setShowApiKeyInput(true);
      return;
    }
    
    toggleListening();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full w-10 h-10 p-0 fixed bottom-6 right-6 shadow-md"
        >
          <Bot className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-medium text-base">Mariana's Voice Assistant</h4>
            <p className="text-sm text-zinc-500">Ask me anything about Mariana</p>
          </div>
          
          {showApiKeyInput ? (
            <ApiKeyInput 
              apiKeyInput={apiKeyInput}
              setApiKeyInput={setApiKeyInput}
              onSubmit={handleApiKeySubmit}
            />
          ) : (
            <>
              <QuestionForm
                question={question}
                setQuestion={setQuestion}
                onSubmit={handleSubmitQuestion}
                isDisabled={isListening || isLoading}
              />
              
              <VoiceInput 
                isListening={isListening}
                toggleListening={checkApiKeyBeforeListening}
                isDisabled={isLoading}
              />
              
              <div className="text-xs text-center text-zinc-500">
                <button 
                  onClick={() => setShowApiKeyInput(true)}
                  className="underline hover:text-zinc-900"
                >
                  Change API Key
                </button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VoiceAgent;

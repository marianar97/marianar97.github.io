
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Bot } from "lucide-react";
import { toast } from "sonner";

interface VoiceAgentProps {
  apiKey?: string;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ apiKey }) => {
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [apiKeyInput, setApiKeyInput] = useState(apiKey || '');
  
  // SpeechRecognition setup with proper type checking
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognitionAPI ? new SpeechRecognitionAPI() : null;
  
  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      handleQuestion(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      toast.error("Sorry, I couldn't hear that.");
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      if (!apiKeyInput) {
        toast.error("Please enter an ElevenLabs API key first");
        setShowApiKeyInput(true);
        return;
      }
      
      recognition.start();
      setIsListening(true);
      toast.info("Listening...");
    }
  };

  const handleQuestion = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Basic responses for demo purposes
      // In a real implementation, this would call the ElevenLabs API
      const responses = {
        "who are you": "I'm Mariana's digital assistant. I can help answer questions about her work and experience.",
        "what does mariana do": "Mariana is an engineer, builder, and explorer who builds things at the intersection of code, design, and curiosity.",
        "what is mariana building": "Mariana is currently working on several projects combining technology and design. You can check out more details by clicking the 'Currently building' link.",
        "contact": "You can reach Mariana via email at mariana.ramirezd97@gmail.com, or through her LinkedIn and GitHub profiles linked on this page.",
      };
      
      // Simplified response matching
      const normalizedQuestion = text.toLowerCase();
      let response = "I don't have information about that. Maybe try asking something about Mariana's work or how to contact her.";
      
      Object.entries(responses).forEach(([key, value]) => {
        if (normalizedQuestion.includes(key)) {
          response = value;
        }
      });
      
      // In a real implementation, we would use ElevenLabs API to convert text to speech
      const utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
      
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
    if (apiKeyInput.trim()) {
      setShowApiKeyInput(false);
      toast.success("API key saved for this session");
    } else {
      toast.error("Please enter a valid API key");
    }
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
            <div className="space-y-2">
              <p className="text-xs text-zinc-500">Enter your ElevenLabs API key to continue:</p>
              <div className="flex space-x-2">
                <Input 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  type="password"
                  placeholder="ElevenLabs API Key"
                  className="flex-1"
                />
                <Button size="sm" onClick={handleApiKeySubmit}>Save</Button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmitQuestion} className="flex space-x-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1"
                  disabled={isListening || isLoading}
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isListening || isLoading || !question.trim()}
                >
                  Ask
                </Button>
              </form>
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleListening}
                  disabled={isLoading}
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

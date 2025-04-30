
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiKeyInputProps {
  apiKeyInput: string;
  setApiKeyInput: (key: string) => void;
  onSubmit: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  apiKeyInput, 
  setApiKeyInput, 
  onSubmit 
}) => {
  const handleApiKeySubmit = () => {
    if (apiKeyInput.trim()) {
      onSubmit();
      toast.success("API key saved for this session");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  return (
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
  );
};

export default ApiKeyInput;

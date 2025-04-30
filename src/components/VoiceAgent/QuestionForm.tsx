
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuestionFormProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDisabled: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  question, 
  setQuestion, 
  onSubmit, 
  isDisabled 
}) => {
  return (
    <form onSubmit={onSubmit} className="flex space-x-2">
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="flex-1"
        disabled={isDisabled}
      />
      <Button 
        type="submit" 
        size="sm"
        disabled={isDisabled || !question.trim()}
      >
        Ask
      </Button>
    </form>
  );
};

export default QuestionForm;

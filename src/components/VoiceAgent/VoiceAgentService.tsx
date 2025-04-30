
/**
 * Helper service for voice agent interactions
 */

// Basic responses for demo purposes
// In a real implementation, this would call the ElevenLabs API
const RESPONSES = {
  "who are you": "I'm Mariana's digital assistant. I can help answer questions about her work and experience.",
  "what does mariana do": "Mariana is an engineer, builder, and explorer who builds things at the intersection of code, design, and curiosity.",
  "what is mariana building": "Mariana is currently working on several projects combining technology and design. You can check out more details by clicking the 'Currently building' link.",
  "contact": "You can reach Mariana via email at mariana.ramirezd97@gmail.com, or through her LinkedIn and GitHub profiles linked on this page.",
};

export const generateResponse = (question: string): string => {
  const normalizedQuestion = question.toLowerCase();
  
  let response = "I don't have information about that. Maybe try asking something about Mariana's work or how to contact her.";
  
  Object.entries(RESPONSES).forEach(([key, value]) => {
    if (normalizedQuestion.includes(key)) {
      response = value;
    }
  });
  
  return response;
};

export const speakResponse = (text: string): void => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};


import React from "react";
import BackgroundDrawings from "@/components/BackgroundDrawings";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CurrentlyBuilding = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <BackgroundDrawings />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
        <section className="glass-card px-8 py-10 max-w-3xl w-[95vw] flex flex-col items-center shadow-glass">
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-8 text-black leading-snug tracking-tight hero-fade-in">
            Currently Building
          </h1>
          
          <div className="w-full max-w-2xl space-y-12 hero-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-black">AI Voice Assistant</h2>
              <p className="text-base text-zinc-800/80 leading-relaxed">
                Building a personal AI voice assistant using ElevenLabs' voice technology. The assistant can answer questions about my background, projects, and expertise.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-black">Personal Knowledge Graph</h2>
              <p className="text-base text-zinc-800/80 leading-relaxed">
                Creating an interconnected knowledge graph to better organize my research, projects, and learnings. This system helps me build connections between different domains.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-medium text-black">Design System Exploration</h2>
              <p className="text-base text-zinc-800/80 leading-relaxed">
                Experimenting with minimalist design principles and glass morphism to create interfaces that are both beautiful and functional.
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mt-8 hero-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Back to Home
          </Button>
        </section>
        
        <footer className="w-full flex flex-col items-center justify-center mt-6 z-10">
          <span className="text-xs text-zinc-500/80 font-inter">
            © {new Date().getFullYear()} Mariana Ramirez
          </span>
        </footer>
      </main>
    </div>
  );
};

export default CurrentlyBuilding;

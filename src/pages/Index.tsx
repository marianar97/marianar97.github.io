
import React from "react";
import BackgroundDrawings from "@/components/BackgroundDrawings";
import VoiceAgent from "@/components/VoiceAgent";

const Index = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <BackgroundDrawings />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] w-full">
        <section className="glass-card px-8 py-10 max-w-2xl w-[95vw] flex flex-col items-center shadow-glass">
          {/* Main Heading */}
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold mb-3 text-black leading-snug tracking-tight hero-fade-in">
            Mariana Ramirez
          </h1>
          {/* Subheading / Tagline */}
          <h2
            className="text-lg sm:text-xl text-zinc-700 font-normal mb-8 font-inter hero-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Engineer &nbsp;&bull;&nbsp; Builder &nbsp;&bull;&nbsp; Explorer
          </h2>
          {/* Bio */}
          <p
            className="text-base text-zinc-800/80 mb-9 text-center leading-relaxed max-w-xl font-inter hero-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {/* Welcome to my digital garden. */}
            <br />
            I build things at the intersection of code, design, and curiosity.
            <br className="hidden sm:block" />
            Currently hacking, tinkering, and learning new crafts every day.
          </p>
          <div className="flex flex-col items-center justify-center">
            <a
              className="story-link font-inter text-zinc-800 font-medium text-base transition-colors duration-150 hover:text-black focus:text-black currently-building-tag"
              href="/currently-building"
            >
              Currently building
            </a>
          </div>

          {/* Main Links */}
          <div className="flex flex-wrap gap-7 mt-2 mb-1">
            {/* Currently Building tag */}
            {/* <a
              className="story-link font-inter text-zinc-800 font-medium text-base transition-colors duration-150 hover:text-black focus:text-black currently-building-tag"
              href="/currently-building"
            >
              Currently building
            </a> */}
            <a
              className="story-link text-zinc-800 font-medium text-base transition-colors duration-150 hover:text-black focus:text-black"
              href="mailto:mariana.ramirezd97@gmail.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Email
            </a>
            <a
              className="story-link text-zinc-800 font-medium text-base transition-colors duration-150 hover:text-black focus:text-black"
              href="https://github.com/marianar97"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="story-link text-zinc-800 font-medium text-base transition-colors duration-150 hover:text-black focus:text-black"
              href="https://linkedin.com/in/marianaramirezd"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </section>
        <footer className="w-full flex flex-col items-center justify-center mt-6 z-10">
          <span className="text-xs text-zinc-500/80 font-inter">
            © {new Date().getFullYear()} Mariana Ramirez
          </span>
        </footer>
      </main>
      
      {/* Add the Voice Agent component */}
      <VoiceAgent />
    </div>
  );
};

export default Index;

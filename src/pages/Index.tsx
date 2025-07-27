
import BackgroundDrawings from "@/components/BackgroundDrawings";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const icons = [
  {
    name: "Home",
    icon: <Home style={{ width: "20px", height: "20px" }} />,
    link: "/",
  },
  {
    name: "Blog",
    icon: <Pencil style={{ width: "20px", height: "20px" }} />,
    link: "/blog",
  },
  {
    name: "GitHub",
    icon: <Icons.github style={{ width: "20px", height: "20px" }} />,
    link: "https://github.com/marianar97",
  },
  {
    name: "LinkedIn",
    icon: <Icons.linkedin style={{ width: "20px", height: "20px" }} />,
    link: "https://www.linkedin.com/in/marianaramirezd",
  },
  {
    name: "X",
    icon: <Icons.x style={{ width: "20px", height: "20px" }}/>,
    link: "https://x.com/marianaramd",
  },
]
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
            Engineer &nbsp;&bull;&nbsp; Builder &nbsp;&bull;&nbsp; Inventor
          </h2>
          {/* Bio */}
          <p
            className="text-base text-zinc-800/80 mb-9 text-center leading-relaxed max-w-xl font-inter hero-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            I build things at the intersection of code, design, and curiosity.
            <br className="hidden sm:block" />
            Currently hacking, tinkering, and learning new crafts every day.
          </p>
         
          <TooltipProvider delayDuration={0}>
            <Dock direction="middle">
              {icons.map((icon) => (
                <DockIcon>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={icon.link} aria-label={icon.name} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-12 rounded-full")}>
                        {icon.icon}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{icon.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              ))}
            </Dock>
          </TooltipProvider>
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

export default Index;

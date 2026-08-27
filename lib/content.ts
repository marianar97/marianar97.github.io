export type BioSegment = string | { text: string; href: string };

export type SocialLabel = "GitHub" | "LinkedIn" | "X";

export interface Social {
  label: SocialLabel;
  href: string;
}

export interface LinkItem {
  title: string;
  date: string;
  href: string;
}

export const site = {
  name: "Mariana Ramirez Duque",
  description: "Founding engineer at Fulcrum.",
  emailText: "mariana.ramirezd97 [at] gmail [dot] com",
  socials: [
    { label: "GitHub", href: "https://github.com/marianar97" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/marianaramirezd/" },
    { label: "X", href: "https://x.com/marianaramd" },
  ] satisfies Social[],
};

export const bio: BioSegment[][] = [
  [
    "I'm a founding engineer at ",
    { text: "Fulcrum", href: "https://www.withfulcrum.com" },
    ". We're building AI that automates work for insurance brokers, so teams can scale their accounts without scaling their headcount.",
   
  ],
  [ "At Fulcrum, I've lead the development of different core products, including Proposals, Loss Runs and currently Employee Benefits.",
    " If you're interested in joining the team, reach out to my email."],
  [
    "Previously, I worked at other startups (YC) and big companies (",
    { text: "SoFi", href: "https://www.sofi.com" },
    "). I earned my master's at ",
    { text: "Carnegie Mellon", href: "https://www.cmu.edu" },
    ".",
  ],
  [
    "Originally from Medellín, Colombia, where I wrote my first program at 13 with Lego Mindstorms after watching The Social Network. Outside of work, you'll find me going down rabbit holes in history and philosophy.",
  ],
];

export const links: LinkItem[] = [
  {
    title: "Lil'Log (Lilian Weng) tech blog",
    date: "Aug 2026",
    href: "https://lilianweng.github.io/",
  },
];

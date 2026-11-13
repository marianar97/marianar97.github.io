export type SocialLabel = "GitHub" | "LinkedIn" | "X" | "Email";

export interface Social {
  label: SocialLabel;
  href: string;
}

export const site = {
  name: "Mariana Ramirez Duque",
  description: "Founding engineer at Fulcrum.",
  spotifyPlaylistUrl: "https://open.spotify.com/playlist/1C71rB32iP5hL6anUEoi3D",
  socials: [
    { label: "GitHub", href: "https://github.com/marianar97" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/marianaramirezd/" },
    { label: "X", href: "https://x.com/marianaramd" },
    { label: "Email", href: "mailto:hi@marianaramirezduque.com" },
  ] satisfies Social[],
};

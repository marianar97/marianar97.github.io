// Sample collection preserved from the approved reading-room prototype.
export interface Book {
 id: string; title: string; author: string; color: string; foil: string;
 lean: number; thought: string; motif: string; number: number;
}
export interface DocumentEntry {
 id: string; type: "book" | "note"; title: string; subtitle: string; html: string;
}
export const books: Book[] = [
  {
    "id": "meditations",
    "title": "Meditations",
    "author": "Marcus Aurelius",
    "color": "#344b43",
    "foil": "#e4d7ac",
    "lean": -0.6,
    "thought": "What’s worth paying attention to?",
    "motif": "<path d=\"M15 90V44a35 35 0 0 1 70 0v46M29 90V44a21 21 0 0 1 42 0v46M43 90V44a7 7 0 0 1 14 0v46\"/>",
    "number": 1
  },
  {
    "id": "lessons-of-history",
    "title": "The Lessons of History",
    "author": "Will & Ariel Durant",
    "color": "#995340",
    "foil": "#f7e3bf",
    "lean": 0.3,
    "thought": "Which things change, and which things only change their clothes?",
    "motif": "<circle cx=\"50\" cy=\"47\" r=\"28\"/><circle cx=\"50\" cy=\"47\" r=\"19\"/><path d=\"M8 85h84M18 91h64M50 6v12M50 76v8M9 47h11M80 47h11M21 18l8 8M72 69l8 8M20 77l9-9M72 26l8-8\"/>",
    "number": 2
  },
  {
    "id": "creative-act",
    "title": "The Creative Act",
    "author": "Rick Rubin",
    "color": "#ded5bf",
    "foil": "#494b3f",
    "lean": -0.3,
    "thought": "Make room for noticing before making something.",
    "motif": "<circle cx=\"35\" cy=\"38\" r=\"25\"/><circle cx=\"65\" cy=\"38\" r=\"25\"/><circle cx=\"50\" cy=\"64\" r=\"25\"/>",
    "number": 3
  },
  {
    "id": "beginning-of-infinity",
    "title": "The Beginning of Infinity",
    "author": "David Deutsch",
    "color": "#304956",
    "foil": "#e8e0c4",
    "lean": 0.6,
    "thought": "A better question can open a much bigger door.",
    "motif": "<path d=\"M7 87h18V70h18V53h18V36h18V19h16M7 97h28V80h18V63h18V46h18V29h6\"/>",
    "number": 4
  },
  {
    "id": "room-of-ones-own",
    "title": "A Room of One’s Own",
    "author": "Virginia Woolf",
    "color": "#b6a36c",
    "foil": "#42492e",
    "lean": -0.6,
    "thought": "What would you make if you had a little more room?",
    "motif": "<path d=\"M50 95V10M50 72C20 73 12 59 14 42c24 1 38 12 36 30ZM50 53c28 0 37-18 34-35-22 4-34 16-34 35ZM50 90C24 91 16 79 18 65c18 1 32 11 32 25Z\"/>",
    "number": 5
  },
  {
    "id": "invention-of-nature",
    "title": "The Invention of Nature",
    "author": "Andrea Wulf",
    "color": "#4c5748",
    "foil": "#e6c9aa",
    "lean": 0,
    "thought": "What becomes visible when you look for connections?",
    "motif": "<ellipse cx=\"50\" cy=\"50\" rx=\"43\" ry=\"19\" transform=\"rotate(-40 50 50)\"/><ellipse cx=\"50\" cy=\"50\" rx=\"43\" ry=\"19\" transform=\"rotate(40 50 50)\"/><circle cx=\"50\" cy=\"50\" r=\"7\" fill=\"currentColor\"/>",
    "number": 6
  }
];
export const notes = [
  {
    "id": "mental-models",
    "title": "Mental models",
    "subtitle": "Thinking clearly"
  },
  {
    "id": "attention-and-control",
    "title": "Attention & control",
    "subtitle": "Philosophy in practice"
  },
  {
    "id": "learning-in-public",
    "title": "Learning in public",
    "subtitle": "Learning & making"
  }
];

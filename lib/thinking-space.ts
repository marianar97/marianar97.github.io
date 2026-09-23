// Books and notes displayed in Thinking Space.
export interface Book {
 id: string; title: string; author: string; color: string; foil: string;
 lean: number; thought: string; motif: string; number: number;
 cover?: { src: string; width: number; height: number; source: string; isbn: string };
}
export interface DocumentEntry {
 id: string; type: "book" | "note"; title: string; subtitle: string; html: string;
 properties: DocumentProperty[];
}
export type PropertyScalar = string | number | boolean;
export interface DocumentProperty { name: string; value: PropertyScalar | PropertyScalar[] }
export const books: Book[] = [
  {
    "id": "beginning-of-infinity",
    "cover": {
      "src": "/thinking-space/covers/beginning-of-infinity.jpg",
      "width": 290,
      "height": 450,
      "source": "https://www.penguinrandomhouse.com/books/293575/the-beginning-of-infinity-by-david-deutsch/",
      "isbn": "9780143121350"
    },
    "title": "The Beginning of Infinity",
    "author": "David Deutsch",
    "color": "#111414",
    "foil": "#eeeae2",
    "lean": 0.6,
    "thought": "A better question can open a much bigger door.",
    "motif": "<path d=\"M7 87h18V70h18V53h18V36h18V19h16M7 97h28V80h18V63h18V46h18V29h6\"/>",
    "number": 1
  },
  {
    "id": "infinity-machine",
    "cover": {
      "src": "/thinking-space/covers/infinity-machine.jpg",
      "width": 298,
      "height": 450,
      "source": "https://www.penguinrandomhouse.com/books/752231/the-infinity-machine-by-sebastian-mallaby/",
      "isbn": "9780593831847"
    },
    "title": "The Infinity Machine",
    "author": "Sebastian Mallaby",
    "color": "#18234d",
    "foil": "#f3eee4",
    "lean": -0.5,
    "thought": "Demis Hassabis, DeepMind, and the Quest for Superintelligence",
    "motif": "<path d=\"M50 50C35 22 10 22 10 50s25 28 40 0 40-28 40 0-25 28-40 0Z\"/>",
    "number": 2
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

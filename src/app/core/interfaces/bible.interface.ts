export interface BibleIndex {
    slug: string;
    name: string;
}

export interface BibleBook {
    id: number;
    name: string;
    slug: string;
}

export interface BibleChapter {
    id: number;
    slug: string;
}

export interface BibleVerse {
    id: number;
    slug: string;
    text: string;
}

export interface Bible {
    book: BibleBook;
    chapter: BibleChapter;
    verse: BibleVerse;
}

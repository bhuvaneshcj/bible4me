import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class StorageService {
    private readonly FONT_SIZE_KEY = "bible_font_size";
    private readonly LAST_READ_BOOK_KEY = "bible_last_read_book";
    private readonly LAST_READ_CHAPTER_KEY = "bible_last_read_chapter";
    private readonly DEFAULT_FONT_SIZE = 16;
    private readonly MIN_FONT_SIZE = 12;
    private readonly MAX_FONT_SIZE = 36;

    constructor() {}

    saveFontSize(size: number): void {
        try {
            const clampedSize = Math.max(this.MIN_FONT_SIZE, Math.min(this.MAX_FONT_SIZE, size));
            localStorage.setItem(this.FONT_SIZE_KEY, clampedSize.toString());
        } catch (error) {
            console.error("Error saving font size:", error);
        }
    }

    getFontSize(): number {
        try {
            const stored = localStorage.getItem(this.FONT_SIZE_KEY);
            if (stored) {
                const size = parseInt(stored, 10);
                return Math.max(this.MIN_FONT_SIZE, Math.min(this.MAX_FONT_SIZE, size));
            }
        } catch (error) {
            console.error("Error reading font size:", error);
        }
        return this.DEFAULT_FONT_SIZE;
    }

    saveLastRead(bookSlug: string, chapterSlug: string): void {
        try {
            localStorage.setItem(this.LAST_READ_BOOK_KEY, bookSlug);
            localStorage.setItem(this.LAST_READ_CHAPTER_KEY, chapterSlug);
        } catch (error) {
            console.error("Error saving last read position:", error);
        }
    }

    getLastRead(): { bookSlug: string | null; chapterSlug: string | null } {
        try {
            return {
                bookSlug: localStorage.getItem(this.LAST_READ_BOOK_KEY),
                chapterSlug: localStorage.getItem(this.LAST_READ_CHAPTER_KEY),
            };
        } catch (error) {
            console.error("Error reading last read position:", error);
            return { bookSlug: null, chapterSlug: null };
        }
    }
}

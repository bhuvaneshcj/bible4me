import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { BibleIndex, Bible, BibleBook, BibleChapter, BibleVerse } from "../interfaces/bible.interface";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: "root",
})
export class BibleService {
    isLoading: boolean = false;
    errorMessage: string = "";

    bibleIndex: BibleIndex[] = [];
    bible: Bible[] = [];

    private books: BibleBook[] = [];
    private booksBySlug: Map<string, BibleBook> = new Map();
    private chaptersByBook: Map<string, BibleChapter[]> = new Map();

    currentBook!: BibleBook;
    currentChapter!: BibleChapter;
    currentVerses: BibleVerse[] = [];

    private currentBookSubject = new BehaviorSubject<BibleBook | null>(null);
    private currentChapterSubject = new BehaviorSubject<BibleChapter | null>(null);
    private currentVersesSubject = new BehaviorSubject<BibleVerse[]>([]);

    currentBook$: Observable<BibleBook | null> = this.currentBookSubject.asObservable();
    currentChapter$: Observable<BibleChapter | null> = this.currentChapterSubject.asObservable();
    currentVerses$: Observable<BibleVerse[]> = this.currentVersesSubject.asObservable();

    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    init() {
        this.isLoading = true;
        this.http.get<BibleIndex[]>("assets/bible-index.json").subscribe({
            next: (data) => {
                this.bibleIndex = data;
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error?.message || "Failed to load bible index";
            },
            complete: () => {
                this.http.get<Bible[]>("assets/bible.json").subscribe({
                    next: (data) => {
                        this.bible = data;
                        this.processBibleData();
                        this.restoreLastReadPosition();
                        this.isLoading = false;
                    },
                    error: (error) => {
                        this.isLoading = false;
                        this.errorMessage = error?.message || "Failed to load bible data";
                    },
                });
            },
        });
    }

    private processBibleData(): void {
        // Extract unique books
        const bookMap = new Map<string, BibleBook>();
        const chapterMap = new Map<string, Map<string, BibleChapter>>();

        this.bible.forEach((item) => {
            const bookSlug = item.book.slug;
            const chapterSlug = item.chapter.slug;

            // Store unique book
            if (!bookMap.has(bookSlug)) {
                bookMap.set(bookSlug, { ...item.book });
            }

            // Store unique chapters per book
            if (!chapterMap.has(bookSlug)) {
                chapterMap.set(bookSlug, new Map());
            }
            const bookChapters = chapterMap.get(bookSlug)!;
            if (!bookChapters.has(chapterSlug)) {
                bookChapters.set(chapterSlug, { ...item.chapter });
            }
        });

        // Convert to arrays and sort
        this.books = Array.from(bookMap.values()).sort((a, b) => a.id - b.id);
        this.books.forEach((book) => {
            this.booksBySlug.set(book.slug, book);
        });

        // Store chapters per book
        chapterMap.forEach((chapters, bookSlug) => {
            const chapterArray = Array.from(chapters.values()).sort((a, b) => a.id - b.id);
            this.chaptersByBook.set(bookSlug, chapterArray);
        });
    }

    private restoreLastReadPosition(): void {
        const lastRead = this.storageService.getLastRead();
        if (lastRead.bookSlug && lastRead.chapterSlug) {
            const book = this.booksBySlug.get(lastRead.bookSlug);
            const chapters = this.chaptersByBook.get(lastRead.bookSlug);
            const chapter = chapters?.find((c) => c.slug === lastRead.chapterSlug);

            if (book && chapter) {
                this.setCurrentBookAndChapter(book, chapter);
                return;
            }
        }

        // Default to first book and chapter
        if (this.books.length > 0) {
            const firstBook = this.books[0];
            const firstChapters = this.chaptersByBook.get(firstBook.slug);
            if (firstChapters && firstChapters.length > 0) {
                this.setCurrentBookAndChapter(firstBook, firstChapters[0]);
            }
        }
    }

    getBooks(): BibleBook[] {
        return [...this.books];
    }

    getChaptersForBook(bookSlug: string): BibleChapter[] {
        return this.chaptersByBook.get(bookSlug) || [];
    }

    setCurrentBookAndChapter(book: BibleBook, chapter: BibleChapter): void {
        this.currentBook = book;
        this.currentChapter = chapter;
        this.getVerses(book, chapter);
        this.storageService.saveLastRead(book.slug, chapter.slug);
        this.currentBookSubject.next(book);
        this.currentChapterSubject.next(chapter);
    }

    getVerses(book: BibleBook, chapter: BibleChapter): void {
        this.currentVerses = this.bible
            .filter((verse) => verse.book.slug === book.slug && verse.chapter.slug === chapter.slug)
            .map((verse) => verse.verse)
            .sort((a, b) => a.id - b.id);
        this.currentVersesSubject.next(this.currentVerses);
    }

    getNextChapter(): { book: BibleBook; chapter: BibleChapter } | null {
        const currentChapters = this.chaptersByBook.get(this.currentBook.slug);
        if (!currentChapters) return null;

        const currentIndex = currentChapters.findIndex((c) => c.slug === this.currentChapter.slug);

        if (currentIndex < currentChapters.length - 1) {
            // Next chapter in same book
            return {
                book: this.currentBook,
                chapter: currentChapters[currentIndex + 1],
            };
        } else {
            // Move to first chapter of next book
            const currentBookIndex = this.books.findIndex((b) => b.slug === this.currentBook.slug);
            if (currentBookIndex < this.books.length - 1) {
                const nextBook = this.books[currentBookIndex + 1];
                const nextBookChapters = this.chaptersByBook.get(nextBook.slug);
                if (nextBookChapters && nextBookChapters.length > 0) {
                    return { book: nextBook, chapter: nextBookChapters[0] };
                }
            }
        }

        return null;
    }

    getPreviousChapter(): { book: BibleBook; chapter: BibleChapter } | null {
        const currentChapters = this.chaptersByBook.get(this.currentBook.slug);
        if (!currentChapters) return null;

        const currentIndex = currentChapters.findIndex((c) => c.slug === this.currentChapter.slug);

        if (currentIndex > 0) {
            // Previous chapter in same book
            return {
                book: this.currentBook,
                chapter: currentChapters[currentIndex - 1],
            };
        } else {
            // Move to last chapter of previous book
            const currentBookIndex = this.books.findIndex((b) => b.slug === this.currentBook.slug);
            if (currentBookIndex > 0) {
                const prevBook = this.books[currentBookIndex - 1];
                const prevBookChapters = this.chaptersByBook.get(prevBook.slug);
                if (prevBookChapters && prevBookChapters.length > 0) {
                    return {
                        book: prevBook,
                        chapter: prevBookChapters[prevBookChapters.length - 1],
                    };
                }
            }
        }

        return null;
    }

    canGoNext(): boolean {
        return this.getNextChapter() !== null;
    }

    canGoPrevious(): boolean {
        return this.getPreviousChapter() !== null;
    }
}

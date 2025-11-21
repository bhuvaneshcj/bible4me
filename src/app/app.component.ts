import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { BibleService } from "./core/services/bible.service";
import { StorageService } from "./core/services/storage.service";
import { ThemeService } from "./core/services/theme.service";
import { BibleBook, BibleChapter } from "./core/interfaces/bible.interface";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
    books: BibleBook[] = [];
    chapters: BibleChapter[] = [];
    currentBook: BibleBook | null = null;
    currentChapter: BibleChapter | null = null;
    fontSize: number = 16;
    isDarkMode: boolean = false;

    private subscriptions: Subscription[] = [];
    private dataCheckInterval: any = null;

    constructor(
        public bibleService: BibleService,
        private storageService: StorageService,
        public themeService: ThemeService
    ) {
        this.isDarkMode = this.themeService.getCurrentTheme() === "dark";
    }

    ngOnInit() {
        this.fontSize = this.storageService.getFontSize();
        this.bibleService.init();

        // Subscribe to service observables
        this.subscriptions.push(
            this.bibleService.currentBook$.subscribe((book) => {
                this.currentBook = book;
                if (book) {
                    this.chapters = this.bibleService.getChaptersForBook(book.slug);
                }
            })
        );

        this.subscriptions.push(
            this.bibleService.currentChapter$.subscribe((chapter) => {
                this.currentChapter = chapter;
            })
        );

        // Subscribe to theme changes
        this.subscriptions.push(
            this.themeService.theme$.subscribe((theme) => {
                this.isDarkMode = theme === "dark";
            })
        );

        // Load books once data is ready
        this.dataCheckInterval = setInterval(() => {
            const books = this.bibleService.getBooks();
            if (books.length > 0) {
                this.books = books;
                this.currentBook = this.bibleService.currentBook;
                this.currentChapter = this.bibleService.currentChapter;
                if (this.currentBook) {
                    this.chapters = this.bibleService.getChaptersForBook(this.currentBook.slug);
                }
                if (this.dataCheckInterval) {
                    clearInterval(this.dataCheckInterval);
                    this.dataCheckInterval = null;
                }
            }
        }, 50);

        // Clear interval after 5 seconds if data doesn't load
        setTimeout(() => {
            if (this.dataCheckInterval) {
                clearInterval(this.dataCheckInterval);
                this.dataCheckInterval = null;
            }
        }, 5000);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        if (this.dataCheckInterval) {
            clearInterval(this.dataCheckInterval);
            this.dataCheckInterval = null;
        }
    }

    onBookChange(book: BibleBook): void {
        const chapters = this.bibleService.getChaptersForBook(book.slug);
        if (chapters.length > 0) {
            this.bibleService.setCurrentBookAndChapter(book, chapters[0]);
        }
    }

    onChapterChange(chapter: BibleChapter): void {
        if (this.currentBook) {
            this.bibleService.setCurrentBookAndChapter(this.currentBook, chapter);
        }
    }

    onFontSizeChange(size: number): void {
        this.fontSize = size;
    }

    onNavigate(direction: "previous" | "next"): void {
        if (direction === "previous") {
            const prev = this.bibleService.getPreviousChapter();
            if (prev) {
                this.bibleService.setCurrentBookAndChapter(prev.book, prev.chapter);
            }
        } else {
            const next = this.bibleService.getNextChapter();
            if (next) {
                this.bibleService.setCurrentBookAndChapter(next.book, next.chapter);
            }
        }
    }
}

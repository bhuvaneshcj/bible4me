import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { BibleService } from "./core/services/bible.service";
import { StorageService } from "./core/services/storage.service";
import { ThemeService } from "./core/services/theme.service";
import { SeoService } from "./core/services/seo.service";
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
    isSidebarOpen: boolean = true;

    @ViewChild("readingArea", { static: false }) readingAreaRef!: ElementRef<HTMLElement>;

    private subscriptions: Subscription[] = [];
    private dataCheckInterval: any = null;

    constructor(
        public bibleService: BibleService,
        private storageService: StorageService,
        public themeService: ThemeService,
        private seoService: SeoService
    ) {
        this.isDarkMode = this.themeService.getCurrentTheme() === "dark";
        // Set initial sidebar state based on screen size
        this.isSidebarOpen = window.innerWidth >= 1024;
    }

    ngOnInit() {
        this.fontSize = this.storageService.getFontSize();
        this.bibleService.init();

        // Set default SEO tags
        this.seoService.setDefaultTags();

        // Set initial theme color
        this.updateThemeColor(this.themeService.getCurrentTheme());

        // Subscribe to service observables
        this.subscriptions.push(
            this.bibleService.currentBook$.subscribe((book) => {
                this.currentBook = book;
                if (book) {
                    this.chapters = this.bibleService.getChaptersForBook(book.slug);
                }
                // Update SEO tags when book changes
                this.updateSeoTags();
            })
        );

        this.subscriptions.push(
            this.bibleService.currentChapter$.subscribe((chapter) => {
                this.currentChapter = chapter;
                // Update SEO tags when chapter changes
                this.updateSeoTags();
                // Scroll to top when chapter changes
                this.scrollToTop();
            })
        );

        // Subscribe to theme changes
        this.subscriptions.push(
            this.themeService.theme$.subscribe((theme) => {
                this.isDarkMode = theme === "dark";
                // Update theme-color meta tag based on theme
                this.updateThemeColor(theme);
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
                // Update SEO tags when data is loaded
                this.updateSeoTags();
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
            // Scroll to top when chapter changes
            this.scrollToTop();
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
                this.scrollToTop();
            }
        } else {
            const next = this.bibleService.getNextChapter();
            if (next) {
                this.bibleService.setCurrentBookAndChapter(next.book, next.chapter);
                this.scrollToTop();
            }
        }
    }

    onToggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    onSidebarBookChange(book: BibleBook): void {
        this.onBookChange(book);
    }

    onSidebarChapterChange(chapter: BibleChapter): void {
        this.onChapterChange(chapter);
    }

    /**
     * Update SEO tags based on current book and chapter
     */
    private updateSeoTags(): void {
        this.seoService.updateTagsForBookAndChapter(this.currentBook, this.currentChapter);
        this.updateStructuredData();
    }

    /**
     * Update structured data (JSON-LD) for SEO
     */
    private updateStructuredData(): void {
        // Remove existing structured data script if any
        const existingScript = document.getElementById("structured-data");
        if (existingScript) {
            existingScript.remove();
        }

        // Generate structured data
        const structuredData = this.seoService.generateStructuredData(this.currentBook, this.currentChapter, this.bibleService.currentVerses);

        // Create and inject new script
        const script = document.createElement("script");
        script.id = "structured-data";
        script.type = "application/ld+json";
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    /**
     * Scroll reading area to top
     */
    private scrollToTop(): void {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
            if (this.readingAreaRef?.nativeElement) {
                this.readingAreaRef.nativeElement.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            } else {
                // Fallback: find reading area by class
                const readingArea = document.querySelector(".reading-area") as HTMLElement;
                if (readingArea) {
                    readingArea.scrollTo({
                        top: 0,
                        behavior: "smooth",
                    });
                }
            }
        }, 100);
    }

    /**
     * Update theme-color meta tag based on current theme
     */
    private updateThemeColor(theme: "light" | "dark"): void {
        const themeColor = theme === "dark" ? "#000000" : "#ffffff";

        // Update theme-color meta tag
        let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
        if (!themeColorMeta) {
            themeColorMeta = document.createElement("meta");
            themeColorMeta.name = "theme-color";
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = themeColor;

        // Update msapplication-TileColor meta tag
        let tileColorMeta = document.querySelector('meta[name="msapplication-TileColor"]') as HTMLMetaElement;
        if (!tileColorMeta) {
            tileColorMeta = document.createElement("meta");
            tileColorMeta.name = "msapplication-TileColor";
            document.head.appendChild(tileColorMeta);
        }
        tileColorMeta.content = themeColor;
    }
}

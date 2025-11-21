import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, HostListener, ElementRef } from "@angular/core";
import { BibleBook, BibleChapter } from "../../core/interfaces/bible.interface";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit, OnChanges {
    @Input() books: BibleBook[] = [];
    @Input() chapters: BibleChapter[] = [];
    @Input() selectedBook: BibleBook | null = null;
    @Input() selectedChapter: BibleChapter | null = null;
    @Input() isOpen: boolean = true;

    @Output() bookChange = new EventEmitter<BibleBook>();
    @Output() chapterChange = new EventEmitter<BibleChapter>();
    @Output() toggleSidebar = new EventEmitter<void>();

    selectedBookSlug: string = "";
    selectedChapterSlug: string = "";
    isBookDropdownOpen: boolean = false;
    searchQuery: string = "";

    filteredBooks: BibleBook[] = [];

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.updateSelectedValues();
        this.filteredBooks = this.books;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["selectedBook"] || changes["selectedChapter"]) {
            this.updateSelectedValues();
        }
        if (changes["books"]) {
            this.filteredBooks = this.books;
            this.filterBooks();
        }
    }

    private updateSelectedValues(): void {
        this.selectedBookSlug = this.selectedBook?.slug || "";
        this.selectedChapterSlug = this.selectedChapter?.slug || "";
    }

    toggleBookDropdown(): void {
        this.isBookDropdownOpen = !this.isBookDropdownOpen;
    }

    selectBook(book: BibleBook): void {
        this.selectedBookSlug = book.slug;
        this.isBookDropdownOpen = false;
        this.searchQuery = "";
        this.filteredBooks = this.books;
        this.bookChange.emit(book);
    }

    selectChapter(chapter: BibleChapter): void {
        this.selectedChapterSlug = chapter.slug;
        this.chapterChange.emit(chapter);
        // Close sidebar on mobile after selection
        if (window.innerWidth < 1024) {
            this.onToggleSidebar();
        }
    }

    onSearchChange(): void {
        this.filterBooks();
    }

    private filterBooks(): void {
        if (!this.searchQuery.trim()) {
            this.filteredBooks = this.books;
            return;
        }

        const query = this.searchQuery.toLowerCase().trim();
        this.filteredBooks = this.books.filter((book) => book.name.toLowerCase().includes(query));
    }

    onToggleSidebar(): void {
        this.toggleSidebar.emit();
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest(".custom-select") && this.isBookDropdownOpen) {
            this.isBookDropdownOpen = false;
        }
    }
}

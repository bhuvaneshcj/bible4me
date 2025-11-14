import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild } from "@angular/core";
import { BibleBook, BibleChapter } from "../../core/interfaces/bible.interface";
import Swiper from "swiper";
import { Navigation, FreeMode } from "swiper/modules";

@Component({
    selector: "app-book-selector",
    templateUrl: "./book-selector.component.html",
    styleUrls: ["./book-selector.component.css"],
})
export class BookSelectorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() books: BibleBook[] = [];
    @Input() chapters: BibleChapter[] = [];
    @Input() selectedBook: BibleBook | null = null;
    @Input() selectedChapter: BibleChapter | null = null;

    @Output() bookChange = new EventEmitter<BibleBook>();
    @Output() chapterChange = new EventEmitter<BibleChapter>();

    @ViewChild("chapterSwiper", { static: false }) chapterSwiperRef!: ElementRef;

    selectedBookSlug: string = "";
    selectedChapterSlug: string = "";
    isBookDropdownOpen: boolean = false;
    swiperInstance: Swiper | null = null;

    ngOnInit(): void {
        this.updateSelectedValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["selectedBook"] || changes["selectedChapter"]) {
            this.updateSelectedValues();
        }
        if (changes["chapters"]) {
            if (this.swiperInstance) {
                setTimeout(() => {
                    this.swiperInstance?.update();
                    this.swiperInstance?.updateSlides();
                    this.scrollToSelectedChapter();
                }, 100);
            } else if (this.chapters.length > 0) {
                setTimeout(() => this.initSwiper(), 100);
            }
        }
    }

    ngAfterViewInit(): void {
        if (this.chapters.length > 0) {
            setTimeout(() => this.initSwiper(), 100);
        }
    }

    private initSwiper(): void {
        if (!this.chapterSwiperRef?.nativeElement || this.chapters.length === 0) return;

        // Destroy existing instance if any
        if (this.swiperInstance) {
            this.swiperInstance.destroy(true, true);
        }

        this.swiperInstance = new Swiper(this.chapterSwiperRef.nativeElement, {
            modules: [Navigation, FreeMode],
            slidesPerView: "auto",
            freeMode: {
                enabled: true,
                sticky: false,
            },
            spaceBetween: 8,
            grabCursor: true,
            centeredSlides: false,
            slideToClickedSlide: true,
            watchOverflow: true,
        });

        setTimeout(() => {
            this.swiperInstance?.update();
            this.scrollToSelectedChapter();
        }, 150);
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
        this.bookChange.emit(book);
    }

    selectChapter(chapter: BibleChapter): void {
        this.selectedChapterSlug = chapter.slug;
        this.chapterChange.emit(chapter);
    }

    scrollToSelectedChapter(): void {
        if (!this.swiperInstance || !this.selectedChapter) return;

        const selectedIndex = this.chapters.findIndex((c) => c.slug === this.selectedChapterSlug);

        if (selectedIndex >= 0) {
            this.swiperInstance.slideTo(selectedIndex, 300);
        }
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest(".custom-select")) {
            this.isBookDropdownOpen = false;
        }
    }

    ngOnDestroy(): void {
        if (this.swiperInstance) {
            this.swiperInstance.destroy(true, true);
        }
    }
}

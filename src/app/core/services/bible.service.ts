import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BibleIndex, Bible, BibleBook, BibleChapter, BibleVerse } from "../interfaces/bible.interface";

@Injectable({
    providedIn: "root",
})
export class BibleService {
    isLoading: boolean = false;
    errorMessage: string = "";

    bibleIndex: BibleIndex[] = [];
    bible: Bible[] = [];

    currentBook!: BibleBook;
    currentChapter!: BibleChapter;
    currentVerses: BibleVerse[] = [];

    constructor(private http: HttpClient) {}

    init() {
        this.isLoading = true;
        this.http.get<BibleIndex[]>("assets/bible-index.json").subscribe({
            next: (data) => {
                this.isLoading = false;
                this.bibleIndex = data;
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error?.message;
            },
            complete: () => {
                this.http.get<Bible[]>("assets/bible.json").subscribe({
                    next: (data) => {
                        this.isLoading = false;
                        this.bible = data;
                        this.currentBook = this.bible[0].book;
                        this.currentChapter = this.bible[0].chapter;
                        this.getVerses(this.currentBook, this.currentChapter);
                    },
                    error: (error) => {
                        this.isLoading = false;
                        this.errorMessage = error?.message;
                    },
                });
            },
        });
    }

    getVerses(book: BibleBook, chapter: BibleChapter) {
        this.currentVerses = this.bible.filter((verse) => verse.book.slug === book.slug && verse.chapter.slug === chapter.slug).map((verse) => verse.verse);
    }
}

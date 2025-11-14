import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BibleIndex, Bible } from "../interfaces/bible.interface";

@Injectable({
    providedIn: "root",
})
export class BibleService {
    isLoading: boolean = false;
    errorMessage: string = "";

    bibleIndex: BibleIndex[] = [];
    bible: Bible[] = [];

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
                    },
                    error: (error) => {
                        this.isLoading = false;
                        this.errorMessage = error?.message;
                    },
                });
            },
        });
    }
}

import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { BibleVerse } from "../../core/interfaces/bible.interface";

@Component({
    selector: "app-reading",
    templateUrl: "./reading.component.html",
    styleUrls: ["./reading.component.css"],
})
export class ReadingComponent implements OnInit, OnChanges {
    @Input() verses: BibleVerse[] = [];
    @Input() fontSize: number = 16;

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["verses"] && this.verses.length > 0) {
            // Scroll to top when verses change
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
}

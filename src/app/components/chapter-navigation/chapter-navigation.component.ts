import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-chapter-navigation",
    templateUrl: "./chapter-navigation.component.html",
    styleUrls: ["./chapter-navigation.component.css"],
})
export class ChapterNavigationComponent {
    @Input() canGoPrevious: boolean = false;
    @Input() canGoNext: boolean = false;

    @Output() navigate = new EventEmitter<"previous" | "next">();

    onPrevious(): void {
        if (this.canGoPrevious) {
            this.navigate.emit("previous");
        }
    }

    onNext(): void {
        if (this.canGoNext) {
            this.navigate.emit("next");
        }
    }
}

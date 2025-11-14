import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { StorageService } from "../../core/services/storage.service";

@Component({
    selector: "app-font-size-control",
    templateUrl: "./font-size-control.component.html",
    styleUrls: ["./font-size-control.component.css"],
})
export class FontSizeControlComponent implements OnInit {
    @Input() fontSize: number = 16;
    @Output() fontSizeChange = new EventEmitter<number>();

    private readonly MIN_SIZE = 12;
    private readonly MAX_SIZE = 36;
    private readonly STEP = 2;

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        const savedSize = this.storageService.getFontSize();
        if (savedSize !== this.fontSize) {
            this.fontSize = savedSize;
            this.fontSizeChange.emit(this.fontSize);
        }
    }

    decreaseFontSize(): void {
        if (this.fontSize > this.MIN_SIZE) {
            this.fontSize = Math.max(this.MIN_SIZE, this.fontSize - this.STEP);
            this.updateFontSize();
        }
    }

    increaseFontSize(): void {
        if (this.fontSize < this.MAX_SIZE) {
            this.fontSize = Math.min(this.MAX_SIZE, this.fontSize + this.STEP);
            this.updateFontSize();
        }
    }

    private updateFontSize(): void {
        this.storageService.saveFontSize(this.fontSize);
        this.fontSizeChange.emit(this.fontSize);
    }

    canDecrease(): boolean {
        return this.fontSize > this.MIN_SIZE;
    }

    canIncrease(): boolean {
        return this.fontSize < this.MAX_SIZE;
    }
}

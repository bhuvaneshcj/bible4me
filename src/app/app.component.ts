import { Component, OnInit } from "@angular/core";
import { BibleService } from "./core/services/bible.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    constructor(public bibleService: BibleService) {}

    ngOnInit() {
        this.bibleService.init();
    }
}

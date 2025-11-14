import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ReadingComponent } from "./components/reading/reading.component";
import { BookSelectorComponent } from "./components/book-selector/book-selector.component";
import { FontSizeControlComponent } from "./components/font-size-control/font-size-control.component";
import { ChapterNavigationComponent } from "./components/chapter-navigation/chapter-navigation.component";

@NgModule({
    declarations: [AppComponent, ReadingComponent, BookSelectorComponent, FontSizeControlComponent, ChapterNavigationComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

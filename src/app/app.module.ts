import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ReadingComponent } from "./components/reading/reading.component";
import { FontSizeControlComponent } from "./components/font-size-control/font-size-control.component";
import { ChapterNavigationComponent } from "./components/chapter-navigation/chapter-navigation.component";
import { ThemeToggleComponent } from "./components/theme-toggle/theme-toggle.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@NgModule({
    declarations: [AppComponent, ReadingComponent, FontSizeControlComponent, ChapterNavigationComponent, ThemeToggleComponent, SidebarComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

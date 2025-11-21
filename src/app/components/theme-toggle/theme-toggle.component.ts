import { Component, OnInit, OnDestroy } from "@angular/core";
import { ThemeService, Theme } from "../../core/services/theme.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-theme-toggle",
    templateUrl: "./theme-toggle.component.html",
    styleUrls: ["./theme-toggle.component.css"],
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
    currentTheme: Theme = "light";
    private subscription: Subscription = new Subscription();

    constructor(public themeService: ThemeService) {}

    ngOnInit(): void {
        this.currentTheme = this.themeService.getCurrentTheme();
        this.subscription = this.themeService.theme$.subscribe((theme) => {
            this.currentTheme = theme;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}

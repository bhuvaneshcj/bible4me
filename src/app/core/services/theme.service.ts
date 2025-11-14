import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    private readonly THEME_KEY = "bible_theme";
    private readonly DARK_THEME_CLASS = "dark";

    constructor() {
        this.initTheme();
    }

    private initTheme(): void {
        const savedTheme = this.getSavedTheme();
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Use system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            this.setTheme(prefersDark ? "dark" : "light");
        }
    }

    getCurrentTheme(): "light" | "dark" {
        return document.documentElement.classList.contains(this.DARK_THEME_CLASS) ? "dark" : "light";
    }

    toggleTheme(): void {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === "light" ? "dark" : "light";
        this.setTheme(newTheme);
    }

    setTheme(theme: "light" | "dark"): void {
        if (theme === "dark") {
            document.documentElement.classList.add(this.DARK_THEME_CLASS);
        } else {
            document.documentElement.classList.remove(this.DARK_THEME_CLASS);
        }
        this.saveTheme(theme);
    }

    private saveTheme(theme: "light" | "dark"): void {
        try {
            localStorage.setItem(this.THEME_KEY, theme);
        } catch (error) {
            console.error("Error saving theme:", error);
        }
    }

    private getSavedTheme(): "light" | "dark" | null {
        try {
            const theme = localStorage.getItem(this.THEME_KEY);
            return theme === "dark" || theme === "light" ? theme : null;
        } catch (error) {
            console.error("Error reading theme:", error);
            return null;
        }
    }
}

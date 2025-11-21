import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export type Theme = "light" | "dark";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    private readonly THEME_KEY = "bible-theme";
    private readonly MANUAL_THEME_KEY = "bible-theme-manual";
    private readonly DARK_THEME_CLASS = "dark";
    private isManualOverride = false;
    private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
    public readonly theme$: Observable<Theme> = this.themeSubject.asObservable();

    constructor() {
        // Check if user has manually set a theme
        this.isManualOverride = localStorage.getItem(this.MANUAL_THEME_KEY) === "true";

        // Apply theme on initialization
        this.applyTheme(this.themeSubject.value);

        // Listen for system theme changes
        if (typeof window !== "undefined" && window.matchMedia) {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

            // Handler for system theme changes
            const handleSystemThemeChange = (e: MediaQueryListEvent) => {
                // Always follow system theme unless user has manually overridden
                if (!this.isManualOverride) {
                    const newTheme = e.matches ? "dark" : "light";
                    this.themeSubject.next(newTheme);
                    this.applyTheme(newTheme);
                }
            };

            mediaQuery.addEventListener("change", handleSystemThemeChange);
        }
    }

    private getInitialTheme(): Theme {
        // Check if user has manually set a theme
        const isManual = localStorage.getItem(this.MANUAL_THEME_KEY) === "true";

        // If user has manually set a theme, use that
        if (isManual) {
            const savedTheme = localStorage.getItem(this.THEME_KEY);
            if (savedTheme === "light" || savedTheme === "dark") {
                return savedTheme;
            }
        }

        // Otherwise, follow system preference
        if (typeof window !== "undefined" && window.matchMedia) {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }

        // Default to dark
        return "dark";
    }

    private applyTheme(theme: Theme): void {
        if (typeof document !== "undefined") {
            const html = document.documentElement;
            if (theme === "dark") {
                html.classList.add(this.DARK_THEME_CLASS);
            } else {
                html.classList.remove(this.DARK_THEME_CLASS);
            }
        }
    }

    getCurrentTheme(): Theme {
        return this.themeSubject.value;
    }

    setTheme(theme: Theme): void {
        this.isManualOverride = true;
        localStorage.setItem(this.MANUAL_THEME_KEY, "true");
        this.themeSubject.next(theme);
        this.applyTheme(theme);
        localStorage.setItem(this.THEME_KEY, theme);
    }

    toggleTheme(): void {
        this.isManualOverride = true;
        localStorage.setItem(this.MANUAL_THEME_KEY, "true");
        const newTheme = this.themeSubject.value === "dark" ? "light" : "dark";
        this.themeSubject.next(newTheme);
        this.applyTheme(newTheme);
        localStorage.setItem(this.THEME_KEY, newTheme);
    }

    followSystemTheme(): void {
        this.isManualOverride = false;
        localStorage.removeItem(this.MANUAL_THEME_KEY);
        localStorage.removeItem(this.THEME_KEY);

        // Apply system theme immediately
        if (typeof window !== "undefined" && window.matchMedia) {
            const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            this.themeSubject.next(newTheme);
            this.applyTheme(newTheme);
        }
    }
}

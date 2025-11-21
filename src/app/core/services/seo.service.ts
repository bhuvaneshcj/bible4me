import { Injectable } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";
import { BibleBook, BibleChapter } from "../interfaces/bible.interface";

@Injectable({
    providedIn: "root",
})
export class SeoService {
    private readonly baseUrl = "https://bible4me.com";
    private readonly defaultTitle = "Bible4Me - தமிழ் பைபிள் ஆன்லைன்";
    private readonly defaultDescription = "Read the Bible online in Tamil. Browse all 66 books and chapters with easy navigation. Free Tamil Bible reading app.";

    constructor(
        private title: Title,
        private meta: Meta
    ) {}

    /**
     * Set default SEO tags
     */
    setDefaultTags(): void {
        this.title.setTitle(this.defaultTitle);
        this.updateMetaDescription(this.defaultDescription);
        this.updateCanonicalUrl(this.baseUrl);
    }

    /**
     * Update SEO tags based on current book and chapter
     */
    updateTagsForBookAndChapter(book: BibleBook | null, chapter: BibleChapter | null): void {
        if (!book || !chapter) {
            this.setDefaultTags();
            return;
        }

        const pageTitle = `${book.name} அத்தியாயம் ${chapter.id} - Bible4Me`;
        const description = `Read ${book.name} Chapter ${chapter.id} in Tamil Bible. Free online Tamil Bible reading with easy navigation.`;
        const url = `${this.baseUrl}/book/${book.slug}/chapter/${chapter.id}`;

        // Update title
        this.title.setTitle(pageTitle);

        // Update meta description
        this.updateMetaDescription(description);

        // Update Open Graph tags
        this.updateOpenGraphTags(pageTitle, description, url);

        // Update Twitter Card tags
        this.updateTwitterCardTags(pageTitle, description);

        // Update canonical URL
        this.updateCanonicalUrl(url);
    }

    /**
     * Update meta description
     */
    private updateMetaDescription(description: string): void {
        this.meta.updateTag({ name: "description", content: description });
    }

    /**
     * Update Open Graph tags
     */
    private updateOpenGraphTags(title: string, description: string, url: string): void {
        this.meta.updateTag({ property: "og:title", content: title });
        this.meta.updateTag({ property: "og:description", content: description });
        this.meta.updateTag({ property: "og:url", content: url });
    }

    /**
     * Update Twitter Card tags
     */
    private updateTwitterCardTags(title: string, description: string): void {
        this.meta.updateTag({ name: "twitter:title", content: title });
        this.meta.updateTag({ name: "twitter:description", content: description });
    }

    /**
     * Update canonical URL
     */
    private updateCanonicalUrl(url: string): void {
        // Remove existing canonical link if any
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (existingCanonical) {
            existingCanonical.remove();
        }

        // Add new canonical link
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", url);
        document.head.appendChild(link);
    }

    /**
     * Generate structured data (JSON-LD) for Bible content
     */
    generateStructuredData(book: BibleBook | null, chapter: BibleChapter | null, verses?: any[]): object {
        if (!book || !chapter) {
            return {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Bible4Me",
                description: this.defaultDescription,
                applicationCategory: "ReligiousApplication",
                operatingSystem: "Web",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
            };
        }

        const structuredData: any = {
            "@context": "https://schema.org",
            "@type": "Book",
            name: book.name,
            bookEdition: "Tamil Bible",
            inLanguage: "ta",
            about: {
                "@type": "Chapter",
                name: `${book.name} - Chapter ${chapter.id}`,
                position: chapter.id,
            },
            isPartOf: {
                "@type": "Book",
                name: "Holy Bible",
                inLanguage: "ta",
            },
        };

        if (verses && verses.length > 0) {
            structuredData["hasPart"] = verses.map((verse, index) => ({
                "@type": "CreativeWork",
                name: `Verse ${verse.id}`,
                position: verse.id,
                text: verse.text,
            }));
        }

        return structuredData;
    }
}

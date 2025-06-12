export class Utils {
    public static extractImageIdFromUrl(url: string): string | null {
        const regex = /\/images\/([a-fA-F0-9\-]+)(?:\?|$)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

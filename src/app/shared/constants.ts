export class Constants {
    static HomeUrl = '/collections';
    static ManageCollectionsUrl = '/manage-collections';
    static AppLanguage = 'app-language';
    static AuthToken = 'auth-token';
    static RefreshToken = 'refresh-token';
    static TokenExpiresIn = 'token-expires-in';
    static RequestTimeout = 5000;
    static RetryCount = 3;
    static Positive = 'positive';
    static Negative = 'negative';
    static PlaceholderImage = 'assets/placeholder.jpg';
}

export class Intervals {
    static OneSecond = 1000;
    static OneMinute = 60 * Intervals.OneSecond;
    static OneHour = 60 * Intervals.OneMinute;
}

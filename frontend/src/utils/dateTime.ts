export function formatDateTime(date: Date | string, locale: string = 'no-NB', options?: Intl.DateTimeFormatOptions): string {
    return new Date(date).toLocaleString(locale, options || {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}
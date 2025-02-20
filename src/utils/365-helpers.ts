// example: for Date 2021-01-01, getDayOfYear will return 1
// example: for Date 2021-12-31, getDayOfYear will return 365
export const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

// example: ['2025-01-04', '2025-01-03', '2025-01-02', '2025-01-01']
export const createDayArray = (dayOfYear: number): string[] => {
    const today = new Date();
    return Array.from({ length: dayOfYear }, (_, i) => {
        const date = new Date(today.getFullYear(), 0, i + 1);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }).reverse(); // Reverse array to have most recent date first
};

export const formatIndexNumber = (index: number, length: number) => {
    const number = length - index;
    return number.toString().padStart(number < 100 ? 3 : 0, '0');
};

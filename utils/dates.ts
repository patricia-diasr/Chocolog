export const getMonthString = (dateString: string) => dateString.slice(0, 7);

export const getFirstDayOfMonth = (monthString: string) => `${monthString}-01`;

export const getInitialDate = (): string => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString().slice(0, 10);
};

export const getISODateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
};

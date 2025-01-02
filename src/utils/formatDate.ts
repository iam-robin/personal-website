export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr; // Return the original string if it's not a valid date
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/** A compact, fixed-width English date such as “02 May” or “25 Sep”. */
export const formatShortDate = (iso: string) => {
    if (!iso) return "";

    const parts = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
    }).formatToParts(new Date(iso));
    const day = parts.find((part) => part.type === "day")?.value ?? "";
    const month = (parts.find((part) => part.type === "month")?.value ?? "").slice(
        0,
        3,
    );

    return `${day} ${month}`;
};

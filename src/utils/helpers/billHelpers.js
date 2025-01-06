export function generateSeriesNumber() {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${timestamp}${randomSuffix}`;
}

export function generateDate() {
    const today = new Date();
    const futureDate = new Date(today.getFullYear(), 11, 6);
    const maxDate = new Date(2024, 11, 31);

    // Calcula a nova data com o limite
    const adjustedDate = futureDate > maxDate ? maxDate : futureDate;
    const formattedDate = adjustedDate.toISOString().split("T")[0] + "T00:00:00";
    return formattedDate;
}

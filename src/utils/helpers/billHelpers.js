export function generateSeriesNumber() {
    const timestamp = Date.now(); // milliseconds timestamp
    const randomSuffix = Math.floor(100 + Math.random() * 900); // number between 100 & 999.
    return `${timestamp}${randomSuffix}`;
}

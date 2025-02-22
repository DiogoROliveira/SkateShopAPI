export function generateSeriesNumber() {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${timestamp}${randomSuffix}`;
}

export const generateDate = () => {
    const currentDate = new Date();
    currentDate.setFullYear(2025);
    return currentDate.toISOString().split('T')[0];
}

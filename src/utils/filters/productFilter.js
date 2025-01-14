export const getProductListFilter = (productsList) => {
    return productsList.map((productData) => {
        const priceObject = productData.materialsItemWarehouses ? productData.materialsItemWarehouses[0].calculatedUnitCost : null;
        const formattedPrice = priceObject ? `${priceObject.amount}` : "0";
        return {
            description: productData.description || "N/A",
            complementaryDescription: productData.complementaryDescription || "N/A",
            itemKey: productData.itemKey || "N/A",
            price: formattedPrice,
            stock: productData.materialsItemWarehouses ? productData.materialsItemWarehouses[0].stockBalance : 0
        };
    });
};

export const getProductFilter = (productData) => {
    const priceObject = productData.materialsItemWarehouses ? productData.materialsItemWarehouses[0].calculatedUnitCost : null;
    const formattedPrice = priceObject ? `${priceObject.amount}` : "0";
    return {
        description: productData.description || "N/A",
        complementaryDescription: productData.complementaryDescription || "N/A",
        itemKey: productData.itemKey || "N/A",
        price: formattedPrice,
        stock: productData.materialsItemWarehouses ? productData.materialsItemWarehouses[0].stockBalance : 0
    };
}
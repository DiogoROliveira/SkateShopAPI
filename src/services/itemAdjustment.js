import { getToken } from "../token/token.js";

const baseURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/itemAdjustments`;

const companyKey = process.env.SUBSCRIPTION;
const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if (!response || !response.ok) {
            const errorMessage = response ? await response.text() : "No response from server";
            throw new Error(`Response Error: ${response?.status || "unknown"} - ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Request failed:", error.message);
        throw new Error("Service failure. Please check the URL and service.");
    }
};

const fetchAdjustmentReasons = async () => {
    const token = await getToken();
    const apiURL = `https://my.jasminsoftware.com/api/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/adjustmentReasons`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(apiURL, options);
        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to fetch adjustment reasons. Status: ${response.status}, Message: ${errorMessage}`
            );
            throw new Error(`Failed to fetch adjustment reasons: ${errorMessage}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching adjustment reasons:", error.message);
        throw new Error("Unable to fetch valid adjustment reasons.");
    }
};

export const createItemAdjustment = async () => {
    const token = await getToken();
    const apiURL = `${baseURL}`;

    const companyKey = "DEFAULT";
    console.log("Company Key used for adjustment:", companyKey);
    const adjustmentReasons = await fetchAdjustmentReasons();
    const adjustmentReason = adjustmentReasons[0]?.name;

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            documentDate: new Date().toISOString().split("T")[0], // Today's date
            postingDate: new Date().toISOString().split("T")[0], // Today's date for posting
            warehouse: "01",
            company: companyKey,
            adjustmentReason: adjustmentReason,
            remarks: "StockAdjustment",
            documentLines: [],
        }),
    };

    const data = await fetchData(apiURL, options);
    return data;
};

export const addItemAdjustmentLine = async (companyKey, itemAdjustmentKey, itemKey, quantity) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/itemAdjustments/${companyKey}/${itemAdjustmentKey}/documentLines`;

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            quantity: quantity,
            unit: "UN",
            materialsItem: itemKey, // Unique key for the material (product) being adjusted
        }),
    };

    const data = await fetchData(apiURL, options);
    return data; // Empty response if successful (204 No Content)
};

export const updateItemAdjustmentLine = async (companyKey, itemAdjustmentKey, lineId, quantity) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/itemAdjustments/${companyKey}/${itemAdjustmentKey}/documentLines/${lineId}/quantity`;

    const options = {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            value: quantity, // New quantity after update
        }),
    };

    const data = await fetchData(apiURL, options);
    return data; // Confirmation of successful update
};

export const activateItemAdjustment = async (companyKey, itemAdjustmentKey) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/itemAdjustments/${companyKey}/${itemAdjustmentKey}/isActive`;

    const options = {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            value: true, // Set adjustment as active
        }),
    };

    const data = await fetchData(apiURL, options);
    return data; // Confirmation of activation
};

export const setPostingDateForAdjustment = async (companyKey, itemAdjustmentKey, postingDate) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/itemAdjustments/${companyKey}/${itemAdjustmentKey}/postingDate`;

    const options = {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            value: postingDate, // Set the posting date
        }),
    };

    const data = await fetchData(apiURL, options);
    return data; // Confirmation of posting date update
};

// Usage example
export const processStockUpdate = async (companyKey, itemKey, quantity) => {
    try {
        // Step 1: Create Item Adjustment
        const adjustment = await createItemAdjustment();
        const itemAdjustmentKey = adjustment.itemAdjustmentKey;

        // Step 2: Add Item Adjustment Line for a product
        await addItemAdjustmentLine(
            process.env.ACCOUNT,
            process.env.SUBSCRIPTION,
            companyKey,
            itemAdjustmentKey,
            itemKey,
            quantity
        );

        // Step 3: Optionally, update quantity if needed (e.g., increasing or decreasing stock)
        await updateItemAdjustmentLine(
            process.env.ACCOUNT,
            process.env.SUBSCRIPTION,
            companyKey,
            itemAdjustmentKey,
            1,
            quantity
        ); // Assuming lineId = 1

        // Step 4: Activate the Item Adjustment
        await activateItemAdjustment(
            process.env.ACCOUNT,
            process.env.SUBSCRIPTION,
            companyKey,
            itemAdjustmentKey
        );

        // Step 5: Set Posting Date (optional)
        await setPostingDateForAdjustment(
            process.env.ACCOUNT,
            process.env.SUBSCRIPTION,
            companyKey,
            itemAdjustmentKey,
            new Date().toISOString().split("T")[0]
        );

        console.log("Stock successfully updated for item:", itemKey);
    } catch (error) {
        console.error("Error during stock update:", error.message);
    }
};

// Additional function to get existing adjustments
export const fetchItemAdjustmentById = async (companyKey, itemAdjustmentKey) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/itemAdjustments/${companyKey}/${itemAdjustmentKey}`;

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const data = await fetchData(apiURL, options);
    return data; // Return details of the requested item adjustment
};

// Function to delete an adjustment line
export const deleteItemAdjustmentLine = async (companyKey, itemAdjustmentKey, lineId) => {
    const token = await getToken();
    const apiURL = `${baseURL}/${process.env.ACCOUNT}/${process.env.SUBSCRIPTION}/materialsManagement/itemAdjustments/${companyKey}/${itemAdjustmentKey}/documentLines/${lineId}`;

    const options = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const data = await fetchData(apiURL, options);
    return data; // Return confirmation if line is deleted
};

export const processCompleteStockAdjustment = async (itemKey, quantity) => {
    try {
        // Passo 1: Criar o ajuste de item
        console.log("Criando ajuste de item...");
        const adjustment = await createItemAdjustment();
        const itemAdjustmentKey = adjustment.itemAdjustmentKey;
        console.log("Ajuste de item criado:", itemAdjustmentKey);

        // Passo 2: Adicionar linha de ajuste para o produto
        console.log("Adicionando linha de ajuste...");
        await addItemAdjustmentLine(companyKey, itemAdjustmentKey, itemKey, quantity);
        console.log("Linha de ajuste adicionada com sucesso!");

        // Passo 3: Atualizar a quantidade da linha, se necessário (a quantidade pode ser alterada aqui)
        console.log("Atualizando quantidade da linha...");
        await updateItemAdjustmentLine(companyKey, itemAdjustmentKey, 1, quantity); // Supondo que o lineId seja 1
        console.log("Quantidade da linha atualizada!");

        // Passo 4: Ativar o ajuste de item
        console.log("Ativando ajuste de item...");
        await activateItemAdjustment(companyKey, itemAdjustmentKey);
        console.log("Ajuste de item ativado!");

        // Passo 5: Definir a data de lançamento do ajuste
        console.log("Definindo data de lançamento...");
        const postingDate = new Date().toISOString().split("T")[0]; // Data atual
        await setPostingDateForAdjustment(companyKey, itemAdjustmentKey, postingDate);
        console.log("Data de lançamento definida!");

        console.log(`Ajuste de estoque completo realizado para o item: ${itemKey}`);
    } catch (error) {
        console.error("Erro durante o processo completo de ajuste de estoque:", error.message);
    }
};

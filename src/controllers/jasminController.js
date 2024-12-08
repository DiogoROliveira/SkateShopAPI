import { getAllBills } from "../services/billService.js";
import { getAllClients, getClientByKey, createNewClient } from "../services/clientService.js";
import { getProductById, getProductByKey, getStock } from "../services/stockService.js";

// ========= Clients ============
export const fetchClients = async (req, res) => {
    try {
        const clientsList = await getAllClients();
        res.status(200).json(clientsList);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving clients!', error: error.message });
    }
};


export const fetchClientByKey = async (req, res) => {
    const { key } = req.params;

    try {
        const clientDetails = await getClientByKey(key);
        res.status(200).json(clientDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving client!', error: error.message });
    }
};


export const addNewClient = async (req, res) => {
    const clientDetails = req.body;

    try {
        const createdClient = await createNewClient(clientDetails);
        res.status(201).json(createdClient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client!', error: error.message });
    }
};

// ========= Bills ============
export const fetchBills = async (req, res) => {
    try {
        const billsList = await getAllBills();
        res.status(200).json(billsList);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bills!', error: error.message });
    }
};

// ======== Stock ============
export const fetchProducts = async (req, res) => {
    try {
        const productList = await getStock();
        res.status(200).json(productList);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products!', error: error.message });
    }
}

export const fetchProductsByKey = async (req, res) => {
    const { key } = req.params;

    try {
        const productDetails = await getProductByKey(key);
        res.status(200).json(productDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product using key!', error: error.message });
    }
};

export const fetchProductsById = async (req, res) => {
    const { id } = req.params;

    try {
        const productDetails = await getProductById(id);
        res.status(200).json(productDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving product using id!', error: error.message });
    }
};
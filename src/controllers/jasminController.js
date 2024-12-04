import { getAllClients, getClientByKey, createNewClient } from "../services/clientService.js";

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

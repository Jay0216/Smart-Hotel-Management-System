import { createService, addServiceImages, getAllServices } from '../models/service.model.js';

export const addService = async (req, res) => {
  try {
    const { branchName, country, name, category, price, pricingType } = req.body;

    if (!branchName || !country || !name || !price) {
      return res.status(400).json({ message: 'branchName, country, name, and price are required' });
    }

    // 1. Create service (handles branch lookup internally)
    const service = await createService({
      branchName,
      country,
      name,
      category,
      price,
      pricingType
    });

    // 2. Add images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(f => f.path);
      await addServiceImages(service.id, imagePaths);
    }

    res.status(201).json({ message: 'Service added successfully', service });
  } catch (error) {
    console.error('ADD SERVICE ERROR 👉', error.message);
    res.status(500).json({ message: error.message || 'Failed to add service' });
  }
};

export const fetchServices = async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json({ services });
  } catch (error) {
    console.error('FETCH SERVICES ERROR 👉', error.message);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};



import { createService, addServiceImages, getAllServices } from '../models/service.model.js';

export const addService = async (req, res) => {
  try {
    const { branchName, name, category, price, pricingType, availability } = req.body;

    if (!branchName || !name || !price) {
      return res.status(400).json({ message: 'branchName, name, and price are required' });
    }

    // Create the service
    const service = await createService({
      branchName,
      name,
      category,
      price,
      pricingType,
      availability
    });

    // Add images if any
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(f => f.path);
      await addServiceImages(service.id, imagePaths);
    }

    res.status(201).json({ message: 'Service added successfully', service });
  } catch (error) {
    console.error('ADD SERVICE ERROR 👉', error.message);
    res.status(500).json({ message: 'Failed to add service' });
  }
};

export const fetchServices = async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json({ services }); // wrap in object for client consistency
  } catch (error) {
    console.error('FETCH SERVICES ERROR 👉', error.message);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};


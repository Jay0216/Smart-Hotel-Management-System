import { createService } from '../models/service.model.js';

export const addService = async (req, res) => {
  try {
    const {
      branchName,
      name,
      category,
      price,
      pricingType,
      availability
    } = req.body;

    if (!branchName || !name || !price) {
      return res.status(400).json({ message: 'Required service fields missing' });
    }

    const service = await createService({
      branchName,
      name,
      category,
      price,
      pricingType,
      availability
    });

    res.status(201).json({
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    console.error('ADD SERVICE ERROR 👉', error.message);
    res.status(500).json({ message: 'Failed to add service' });
  }
};

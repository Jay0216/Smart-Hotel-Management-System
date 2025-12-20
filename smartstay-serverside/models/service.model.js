import { pool } from '../dbconnection.js';

// Create a service
export const createService = async ({
  branchName,
  name,
  category,
  price,
  pricingType,
  availability
}) => {
  const query = `
    INSERT INTO services (
      branch_name,
      name,
      category,
      price,
      pricing_type,
      availability
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    branchName,
    name,
    category || null,
    price,
    pricingType || 'Fixed',
    availability || 'Available'
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Add service images
export const addServiceImages = async (serviceId, images = []) => {
  if (!images.length) return;

  const query = `
    INSERT INTO service_images (service_id, image_url, is_primary)
    VALUES ($1, $2, $3)
  `;

  for (let i = 0; i < images.length; i++) {
    await pool.query(query, [
      serviceId,
      images[i],
      i === 0 // first image is primary
    ]);
  }
};

// Get all services with optional images
export const getAllServices = async () => {
  const servicesQuery = `SELECT * FROM services ORDER BY created_at DESC`;
  const { rows: services } = await pool.query(servicesQuery);

  // Fetch images for each service
  const servicesWithImages = await Promise.all(
    services.map(async (s) => {
      const { rows: images } = await pool.query(
        `SELECT image_url, is_primary FROM service_images WHERE service_id=$1`,
        [s.id]
      );
      return { ...s, images: images.map(img => img.image_url) };
    })
  );

  return servicesWithImages;
};




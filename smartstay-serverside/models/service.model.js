import { pool } from '../dbconnection.js';

// Create a service with branch_id lookup
export const createService = async ({
  branchName,
  country,
  name,
  category,
  price,
  pricingType
}) => {
  // 1. Check branch exists with name + country
  const branchQuery = `
    SELECT id FROM branches WHERE name=$1 AND country=$2 LIMIT 1
  `;
  const { rows: branchRows } = await pool.query(branchQuery, [branchName, country]);

  if (branchRows.length === 0) {
    throw new Error(`Branch "${branchName}" in "${country}" does not exist`);
  }

  const branchId = branchRows[0].id;

  // 2. Insert service
  const query = `
    INSERT INTO services (
      branch_id,
      name,
      category,
      price,
      pricing_type
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    branchId,
    name,
    category || null,
    price,
    pricingType || 'Fixed'
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
      i === 0 // first image primary
    ]);
  }
};

// Get all services with branch name
export const getAllServices = async () => {
  const servicesQuery = `
    SELECT s.*, b.name as branch_name, b.country
    FROM services s
    JOIN branches b ON s.branch_id = b.id
    ORDER BY s.created_at DESC
  `;
  const { rows: services } = await pool.query(servicesQuery);

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





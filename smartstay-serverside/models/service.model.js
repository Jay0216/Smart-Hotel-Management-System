import { pool } from '../dbconnection.js';

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
    category,
    price,
    pricingType || 'Fixed',
    availability || 'Available'
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

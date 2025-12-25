import { pool } from '../dbconnection.js';

/**
 * Find branch id using name + country
 */
export const getBranchIdByNameAndCountry = async (branchName, country) => {
  const query = `
    SELECT id
    FROM branches
    WHERE name = $1 AND country = $2
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [branchName, country]);
  return rows[0]?.id;
};

export const createRoom = async ({
  branchId,
  roomName,
  roomType,
  price,
  capacity,
  status
}) => {
  const query = `
    INSERT INTO rooms (
      branch_id,
      room_name,
      room_type,
      price,
      capacity,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    branchId,
    roomName,
    roomType,
    price,
    capacity,
    status || 'Available'
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const addRoomImages = async (roomId, images = []) => {
  if (!images.length) return;

  const query = `
    INSERT INTO room_images (room_id, image_url, is_primary)
    VALUES ($1, $2, $3)
  `;

  for (let i = 0; i < images.length; i++) {
    await pool.query(query, [
      roomId,
      images[i],
      i === 0
    ]);
  }
};

export const getAllRooms = async () => {
  const query = `
    SELECT
      r.id,
      b.name AS branch_name,
      b.country,
      r.room_name,
      r.room_type,
      r.price,
      r.capacity,
      r.status,
      COALESCE(ARRAY_AGG(ri.image_url) FILTER (WHERE ri.image_url IS NOT NULL), '{}') AS images
    FROM rooms r
    JOIN branches b ON b.id = r.branch_id
    LEFT JOIN room_images ri ON ri.room_id = r.id
    GROUP BY r.id, b.name, b.country
    ORDER BY r.id DESC
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const updateRoomStatus = async (roomId, status) => {
  const query = `
    UPDATE rooms
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;
  const { rows } = await pool.query(query, [status, roomId]);
  return rows[0];
};

export const getRoomById = async (roomId) => {
  const result = await pool.query("SELECT * FROM rooms WHERE id = $1", [roomId]);
  return result.rows[0]; // pg returns rows in result.rows
};




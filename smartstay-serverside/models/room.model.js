import { pool } from '../dbconnection.js';

export const createRoom = async ({
  branchName,
  roomName,
  roomType,
  price,
  capacity,
  status
}) => {
  const query = `
    INSERT INTO rooms (
      branch_name,
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
    branchName,
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
      i === 0 // first image primary
    ]);
  }
};

export const getAllRooms = async () => {
  const query = `
    SELECT r.id, r.branch_name AS hotel, r.room_name AS name, r.room_type AS type,
           r.price, r.capacity, r.status,
           ARRAY_AGG(ri.image_url) AS images
    FROM rooms r
    LEFT JOIN room_images ri ON ri.room_id = r.id
    GROUP BY r.id
    ORDER BY r.id
  `;
  
  const { rows } = await pool.query(query);
  return rows;
};


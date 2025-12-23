import {
  createRoom,
  addRoomImages,
  getAllRooms,
  getBranchIdByNameAndCountry
} from '../models/room.model.js';

export const addRoom = async (req, res) => {
  try {
    const { branchName, country, roomName, roomType, price, capacity } = req.body;

    if (!branchName || !country || !roomName || !roomType || !price || !capacity) {
      return res.status(400).json({ message: 'All room fields are required' });
    }

    // 🔍 Resolve branch ID
    const branchId = await getBranchIdByNameAndCountry(branchName, country);

    if (!branchId) {
      return res.status(404).json({ message: 'Branch not found for given country' });
    }

    // ✅ Create room
    const room = await createRoom({
      branchId,
      roomName,
      roomType,
      price,
      capacity
    });

    // 🖼️ Add images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file =>
        `/${file.path.replace(/\\/g, '/')}`
      );

      await addRoomImages(room.id, imagePaths);
    }

    res.status(201).json({
      message: 'Room created successfully',
      room
    });

  } catch (error) {
    console.error('ADD ROOM ERROR 👉', error);
    res.status(500).json({ message: 'Failed to add room' });
  }
};

export const fetchRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json({ rooms });
  } catch (error) {
    console.error('FETCH ROOMS ERROR 👉', error);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};


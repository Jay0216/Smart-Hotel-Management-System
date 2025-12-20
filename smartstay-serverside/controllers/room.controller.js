import { createRoom, addRoomImages, getAllRooms } from '../models/room.model.js';

export const addRoom = async (req, res) => {
  try {
    const { branchName, roomName, roomType, price, capacity } = req.body;

    if (!branchName || !roomName || !roomType || !price || !capacity) {
      return res.status(400).json({ message: 'All room fields are required' });
    }

    // Create room
    const room = await createRoom({
      branchName,
      roomName,
      roomType,
      price,
      capacity
    });

    // Add images from multer
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => file.path); // get local file paths
      await addRoomImages(room.id, imagePaths);
    }

    res.status(201).json({
      message: 'Room created successfully',
      room
    });

  } catch (error) {
    console.error('ADD ROOM ERROR 👉', error.message);
    res.status(500).json({ message: 'Failed to add room' });
  }
};


export const fetchRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json({ rooms }); // <-- wrap in object
  } catch (error) {
    console.error('FETCH ROOMS ERROR 👉', error.message);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};

const API_BASE_URL = 'http://localhost:3000/api/rooms';

export interface RoomFormData {
  branchName: string;
  country: string;
  roomName: string;
  roomType: string;
  price: number;
  capacity: number;
  images?: FileList | null;
}


export interface Room {
  id: string;
  branch_name: string;
  country: string;
  room_name: string;
  room_type: string;
  price: string;      // API sends string
  capacity: number;
  status: 'Available' | 'Booked' | 'Unavailable';
  images: string[];
}


export const addRoom = async (formData: FormData): Promise<{ room: Room; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/addrooms`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add room');
  }

  return response.json();
};

export const getRooms = async (): Promise<Room[]> => {
  const response = await fetch(`${API_BASE_URL}/getrooms`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch rooms');
  }

  const data = await response.json();
  return data.rooms;
};

// tests/booking.controller.test.js
import { jest } from '@jest/globals';

// Mock the booking model module
jest.unstable_mockModule('../../models/booking.model.js', () => ({
  createBooking: jest.fn(),
  BookingModel: {
    getBookingsByGuestId: jest.fn()
  }
}));

// Dynamically import the controller and mocked model
const { addBooking, getGuestBookings } = await import('../../controllers/booking.controller.js');
const BookingModelModule = await import('../../models/booking.model.js');

describe('Booking Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  /* ===== addBooking tests ===== */
  describe('addBooking', () => {

    it('should return 400 if required fields are missing', async () => {
      req.body = { room_id: 1 }; // missing other fields
      await addBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All required booking fields must be provided, including guest_id'
      });
    });

    it('should return 400 if guests or nights <= 0', async () => {
      req.body = {
        guest_id: '123',
        room_id: '1',
        branch_name: 'Main',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        contact: '1234567890',
        guests: 0,
        nights: 2
      };
      await addBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Guests and nights must be greater than zero'
      });
    });

    it('should create a booking and return 201', async () => {
      const mockBooking = { id: 1, room_id: '1' };
      BookingModelModule.createBooking.mockResolvedValue(mockBooking);

      req.body = {
        guest_id: '123',
        room_id: '1',
        branch_name: 'Main',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        contact: '1234567890',
        guests: 2,
        nights: 3
      };

      await addBooking(req, res);
      expect(BookingModelModule.createBooking).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBooking);
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Database error';
      BookingModelModule.createBooking.mockRejectedValue(new Error(errorMessage));

      req.body = {
        guest_id: '123',
        room_id: '1',
        branch_name: 'Main',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        contact: '1234567890',
        guests: 2,
        nights: 3
      };

      await addBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  /* ===== getGuestBookings tests ===== */
  describe('getGuestBookings', () => {

    it('should return 400 if guestId is missing', async () => {
      req.params = {};
      await getGuestBookings(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'guestId is required'
      });
    });

    it('should return bookings for guestId', async () => {
      const mockBookings = [{ id: 1 }, { id: 2 }];
      BookingModelModule.BookingModel.getBookingsByGuestId.mockResolvedValue(mockBookings);

      req.params = { guestId: '123' };
      await getGuestBookings(req, res);
      expect(BookingModelModule.BookingModel.getBookingsByGuestId).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBookings);
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'DB failed';
      BookingModelModule.BookingModel.getBookingsByGuestId.mockRejectedValue(new Error(errorMessage));

      req.params = { guestId: '123' };
      await getGuestBookings(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});

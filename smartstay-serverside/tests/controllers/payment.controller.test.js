// tests/controllers/payment.controller.test.js
import { jest } from '@jest/globals';

// ===== Mock modules =====
jest.unstable_mockModule('../../models/payment.model.js', () => ({
  PaymentModel: {
    createPayment: jest.fn(),
    updatePaymentStatus: jest.fn()
  }
}));

jest.unstable_mockModule('../../models/booking.model.js', () => ({
  BookingModel: {
    updateBookingStatus: jest.fn()
  }
}));

jest.unstable_mockModule('../../models/room.model.js', () => ({
  updateRoomStatus: jest.fn()
}));

jest.unstable_mockModule('../../utils/nodemailer.js', () => ({
  sendBookingSuccessEmail: jest.fn()
}));

// ===== Dynamic imports =====
const { simulatePayment } = await import('../../controllers/payment.controller.js');
const PaymentModelModule = await import('../../models/payment.model.js');
const BookingModelModule = await import('../../models/booking.model.js');
const RoomModule = await import('../../models/room.model.js');
const EmailModule = await import('../../utils/nodemailer.js');

describe('Payment Controller', () => {
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

  it('should return 201 and initial payment info', async () => {
    const mockPayment = { payment_id: 'p1', guest_id: 'g1', booking_id: 'b1' };
    PaymentModelModule.PaymentModel.createPayment.mockResolvedValue(mockPayment);

    req.body = {
      guest_id: 'g1',
      booking_id: 'b1',
      amount: 100,
      payment_method: 'CARD'
    };

    await simulatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Payment initiated (simulation)',
        payment: mockPayment
      })
    );
    expect(PaymentModelModule.PaymentModel.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({ guest_id: 'g1', booking_id: 'b1', payment_status: 'PENDING' })
    );
  });

  it('should handle errors and return 500', async () => {
    PaymentModelModule.PaymentModel.createPayment.mockRejectedValue(new Error('DB failed'));

    req.body = {
      guest_id: 'g1',
      booking_id: 'b1',
      amount: 100,
      payment_method: 'CARD'
    };

    await simulatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Payment simulation failed'
    });
  });

  it('should update payment, booking, room, and send email after timeout', async () => {
    jest.useFakeTimers();

    const mockPayment = { payment_id: 'p1', guest_id: 'g1', booking_id: 'b1' };
    const mockBooking = {
      booking_id: 'b1',
      room_id: 'r1',
      email: 'john@example.com',
      first_name: 'John',
      room_name: 'Deluxe'
    };

    PaymentModelModule.PaymentModel.createPayment.mockResolvedValue(mockPayment);
    BookingModelModule.BookingModel.updateBookingStatus.mockResolvedValue(mockBooking);

    req.body = {
      guest_id: 'g1',
      booking_id: 'b1',
      amount: 100,
      payment_method: 'CARD'
    };

    await simulatePayment(req, res);

    // Fast-forward the setTimeout
    jest.advanceTimersByTime(1500);

    // Wait a tick for async inside setTimeout
    await Promise.resolve();

    expect(PaymentModelModule.PaymentModel.updatePaymentStatus).toHaveBeenCalledWith('p1', 'SUCCESS');
    expect(BookingModelModule.BookingModel.updateBookingStatus).toHaveBeenCalledWith('b1', 'SUCCESS');
    expect(RoomModule.updateRoomStatus).toHaveBeenCalledWith('r1', 'Booked');
    expect(EmailModule.sendBookingSuccessEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'john@example.com',
        firstName: 'John',
        bookingId: 'b1',
        amount: 100,
        roomName: 'Deluxe'
      })
    );

    jest.useRealTimers();
  });
});

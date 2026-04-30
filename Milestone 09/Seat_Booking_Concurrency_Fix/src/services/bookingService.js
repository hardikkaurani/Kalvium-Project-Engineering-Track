const { Prisma } = require("@prisma/client");
const prisma = require("../lib/prisma");

class DuplicateBookingError extends Error {
  constructor() {
    super("Seat already booked for this show");
    this.name = "DuplicateBookingError";
    this.statusCode = 409;
    this.code = "DUPLICATE_BOOKING";
  }
}

async function createBooking(input) {
  try {
    return await prisma.booking.create({
      data: {
        userId: input.userId,
        seatId: input.seatId,
        showId: input.showId,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new DuplicateBookingError();
    }

    throw error;
  }
}

module.exports = {
  createBooking,
  DuplicateBookingError,
};

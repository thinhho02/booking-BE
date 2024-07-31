import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Room from "../../models/rooms.js";

export const getAllRooms = async (req, res) => {
  const { id: hotelId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res
      .status(400)
      .json({ message: "Truy vấn không hợp lệ (Bad Request)" });
  }
  try {
    const findHotel = await Hotel.findById(hotelId)
      .populate({ path: "rooms", select: "-createdAt -updatedAt" })
      .exec();
    if (!findHotel) {
      return res
        .status(400)
        .json({ message: "Đã xảy ra lỗi khi gửi truy vấn" });
    }
    // const dataRooms = await findHotel.populate({path: "rooms", select: " * -createdAt -updatedAt"})
    return res.status(200).json(findHotel);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRoom = async (req, res) => {
  const { id: hotelId, roomId } = req.params;
  if (
    !mongoose.Types.ObjectId.isValid(hotelId) ||
    !mongoose.Types.ObjectId.isValid(roomId)
  ) {
    return res
      .status(400)
      .json({ message: "Truy vấn không hợp lệ (Bad Request)" });
  }
  try {
    const findHotel = await Hotel.findById(hotelId);
    if (!findHotel || !findHotel.rooms.some((room) => room == roomId)) {
      return res
        .status(400)
        .json({ message: "Đã xảy ra lỗi khi gửi truy vấn" });
    }
    const findRoom = await Room.findById(roomId)
      .populate({ path: "hotel", select: "-createdAt -updatedAt" })
      .exec();
    if (!findRoom) {
      return res
        .status(400)
        .json({ message: "Đã xảy ra lỗi khi gửi truy vấn" });
    }
    return res.status(200).json(findRoom);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

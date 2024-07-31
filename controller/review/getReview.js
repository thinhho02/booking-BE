import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";

export const getReview = async (req, res) => {
  const { id: hotelId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res
      .status(400)
      .json({ message: "Truy vấn không hợp lệ (Bad Request)" });
  }
  try {
    const findHotel = await Hotel.findById(hotelId)
      .populate({
        path: "reviews",
        select: "-createdAt -updatedAt",
        populate: {
          path: "user",
          select: "_id firstName lastName email avatar",
        },
      })
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

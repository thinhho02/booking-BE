import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Review from "../../models/reviews.js";

export const createNewReview = async (req, res) => {
  const { id: hotelId } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: "authentication user failed" });
  }
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res
      .status(400)
      .json({ message: "Truy vấn không hợp lệ (Bad Request)" });
  }
  try {
    const findHotel = await Hotel.findById(hotelId);
    if (!findHotel) {
      return res
        .status(400)
        .json({ message: "Đã xảy ra lỗi khi gửi truy vấn" });
    }
    const createNewReview = new Review({
      comment: req.body.comment,
      rating: req.body.rating,
      hotel: hotelId,
      user: req.user.id,
    });
    console.log(createNewReview)
    await createNewReview.save()
    // await Hotel.findByIdAndUpdate(hotelId,{
    //     reviews: [...(findHotel?.reviews || []),createNewReview._id]
    // })

    return res
      .status(200)
      .json({
        message: `${req.user.name} Đã review khách sạn ${findHotel.name}`,
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

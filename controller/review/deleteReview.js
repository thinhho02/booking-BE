import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Review from "../../models/reviews.js";

export const deleteReview = async (req, res) => {
  const { id: hotelId, reviewId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(hotelId) ||
    !mongoose.Types.ObjectId.isValid(reviewId)
  ) {
    return res
      .status(400)
      .json({ message: "Truy vấn không hợp lệ (Bad Request)" });
  }
  try {
    const findHotel = await Hotel.findById(hotelId);
    if (
      !findHotel ||
      !findHotel.reviews.some((review) => review == reviewId)
    ) {
      return res.status(400).json({ message: "Đã xảy ra lỗi ở truy vấn" });
    }
    const findReview = await Review.findById(reviewId);
    if (!findReview) {
      return res.status(400).json({ message: "Đã xảy ra lỗi ở truy vấn" });
    }
    // const deleteReviewAtHotel = findHotel.reviews.filter(
    //   (review) => review._id != reviewId
    // );
    // console.log(deleteReviewAtHotel);
    // await Hotel.findByIdAndUpdate(hotelId, { reviews: deleteReviewAtHotel });
    await Review.findByIdAndDelete(reviewId);

    return res
      .status(200)
      .json({
        message: `Review ${findReview._id} cho khách sạn ${findHotel.name} đã xóa`,
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

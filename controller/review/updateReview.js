import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Review from "../../models/reviews.js";

export const updateReview = async (req, res) => {
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
      return res
        .status(400)
        .json({ message: "Đã xảy ra lỗi khi gửi truy vấn" });
    }
    const findReview = await Review.findById(reviewId);
    if (!findReview) {
      return res
        .status(400)
        .json({ message: "Đã xảy ra lỗi khi gửi truy vấn" });
    }
    await Review.findByIdAndUpdate(
      reviewId,
      {
        comment: req?.body?.comment,
        rating: req?.body?.rating,
      },
      { new: true }
    );
    // if (req?.body?.rating) {
    //   const updateRatingInHotel = findHotel.reviews.map((review) =>
    //     review._id == reviewId
    //       ? { _id: reviewId, rating: req.body.rating }
    //       : review
    //   );
    // //   console.log(updateRatingInHotel);
    //   // const index = findHotel.reviews.findIndex(review => review._id == reviewId)
    //   await Hotel.findByIdAndUpdate(hotelId, {
    //     reviews: updateRatingInHotel,
    //   });
    // }
    // console.log(updateRoom)
    return res
      .status(200)
      .json({ message: `Đã cập nhập review ở khách sạn ${findHotel.name}` });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

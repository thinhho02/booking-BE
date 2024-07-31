import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Business from "../../models/business.js";

export const deleteHotel = async (req, res) => {
  const { id: hotelId } = req.params;
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
    const findBusiness = await Business.findById(findHotel.ofBusiness).select("hotels");
    // const findHotelAtBusiness = findBusiness.hotels.some(hotel => hotel == hotelId)
    
    if (findBusiness && !findBusiness.hotels.some(hotel => hotel == hotelId)) {
        return res.status(401).json({message: "Khách sạn này không thuộc quyền sở hữu của bạn"})
    }

    await Hotel.findByIdAndDelete(hotelId);
    // console.log(updateHotel);
    return res
      .status(200)
      .json({
        message: `Khách sạn ${hotelId} đã xóa`,
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

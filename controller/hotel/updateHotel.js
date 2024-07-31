import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Business from "../../models/business.js";

export const updateHotel = async (req, res) => {
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

    const updateHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      {
        name: req?.body?.name,
        country: req?.body?.country,
        city: req?.body?.city,
        description: req?.body?.description,
        address: req?.body?.address,
        ranking: req?.body?.ranking,
        amenities: req?.body?.amenities,
        image: req?.body?.image,
      },
      { new: true }
    );
    console.log(updateHotel);
    return res
      .status(200)
      .json({
        message: `Đã cập nhập khách sạn ${updateHotel.name}`,
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

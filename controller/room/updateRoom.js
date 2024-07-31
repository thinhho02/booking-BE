import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Room from "../../models/rooms.js";

export const updateRoom = async (req, res) => {
  const { id : hotelId, roomId } = req.params;
  if(!mongoose.Types.ObjectId.isValid(hotelId) || !mongoose.Types.ObjectId.isValid(roomId)){
    return res.status(400).json({message: "Truy vấn không hợp lệ (Bad Request)"})
  }
  try {
    const findHotel = await Hotel.findById(hotelId)
    if(!findHotel || !findHotel.rooms.some(room=> room == roomId)){
        return res.status(400).json({message: "Đã xảy ra lỗi khi gửi truy vấn"})
    }
    const findRoom = await Room.findById(roomId)
    if(!findRoom){
        return res.status(400).json({message: "Đã xảy ra lỗi khi gửi truy vấn"})
    }
    const updateRoom = await Room.findByIdAndUpdate(roomId,{
        title: req.body?.title,
        roomNumber: req?.body?.roomNumber,
        type: req?.body?.type,
        pricePerNight: req?.body?.pricePerNight,
        description: req?.body?.description,
        services: req?.body?.services,
        amenities: req?.body?.amenities,
        photos: req?.body?.photos,
        bedType: req?.body?.bedType,
        maxOccupancy: req?.body?.maxOccupancy,
        isAvailable: req?.body?.isAvailable,
        checkInTime: req?.body?.checkInTime,
        checkOutTime: req?.body?.checkOutTime,
        isSmokingAllowed: req?.body?.isSmokingAllowed,
    },{new: true})
    console.log(updateRoom)
    return res.status(200).json({message: `Đã cập nhập phòng ${updateRoom.roomNumber} ở khách sạn ${findHotel.name}`})
  } catch (error) {
    res.status(500).json({
        message: error.message
    })
  }
};

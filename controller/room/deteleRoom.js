import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Room from "../../models/rooms.js";

export const deleteRoom = async (req, res) => {
  const { id : hotelId, roomId } = req.params;
  if(!mongoose.Types.ObjectId.isValid(hotelId) || !mongoose.Types.ObjectId.isValid(roomId)){
    return res.status(400).json({message: "Truy vấn không hợp lệ (Bad Request)"})
  }
  try {
    const findHotel = await Hotel.findById(hotelId)
    if(!findHotel || !findHotel.rooms.some(room=> room == roomId)){
        return res.status(400).json({message: "Đã xảy ra lỗi ở logic"})
    }
    const findRoom = await Room.findById(roomId)
    if(!findRoom){
        return res.status(400).json({message: "Đã xảy ra lỗi ở logic"})
    }
    const deleteRoomAtHotel = findHotel.rooms.filter(room => room != roomId)
    // console.log(deleteRoomAtHotel)
    await Hotel.findByIdAndUpdate(hotelId,{rooms: deleteRoomAtHotel})
    await Room.findByIdAndDelete(roomId)
    // console.log(updateRoom)
    return res.status(200).json({message: `Phòng ${findRoom.roomNumber} đã xóa ở khách sạn ${findHotel.name}`})
  } catch (error) {
    res.status(500).json({
        message: error.message
    })
  }
};

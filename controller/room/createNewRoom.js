import mongoose from "mongoose";
import Hotel from "../../models/hotels.js";
import Room from "../../models/rooms.js";
import { imagekit } from "../../util/imageKit.js";

export const createNewRoom = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Truy vấn không hợp lệ (Bad Request)" });
  }
  try {
    const findHotel = await Hotel.findById(id);
    if (!findHotel) {
      return res
        .status(400)
        .json({ message: "Đã xảy ra lỗi khi gửi truy vấn" });
    }
    if (req.body?.amenities) {
      req.body.amenities = JSON.parse(req.body.amenities);
    }
    if (req.body?.services) {
      req.body.services = JSON.parse(req.body.services);
    }

    if (req?.files) {
      const files = req.files;
      const uploadPromises = files.map((file) => {
        return imagekit.upload({
          file: file.buffer, // required
          fileName: "room.jpg", // required
        });
      });
      const results = await Promise.all(uploadPromises);
      req.body.imageList = results.map((result) => result.url);
    }

    const newRoom = new Room({
      ...req.body,
      services: req.body?.services,
      amenities: req?.body?.amenities,
      photos: req?.body?.imageList,
      hotel: id,
    });
    await newRoom.save();
    const updateHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        rooms: [...(findHotel?.rooms || []), newRoom._id],
      },
      { new: true }
    );
    console.log(updateHotel);
    return res
      .status(200)
      .json({ message: `Đã thêm phòng mới vào khách sạn ${findHotel.name}` });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

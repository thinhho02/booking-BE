import mongoose from "mongoose";
import Business from "../../models/business.js";
import Hotel from "../../models/hotels.js";

export const getHotelOfBusiness = async (req, res) => {
  if (req.user) {
    try {
      const findBusiness = await Business.findOne({ user: req.user.id })
        .populate({
          path: "hotels",
          select: "-createdAt -updatedAt",
          populate: [
            { path: "rooms", select: "-createAt -updateAt" },
            { path: "reviews", select: "-createAt -updateAt" },
          ],
          //   populate: { path: "reviews", select: "-createAt -updateAt" },
        }).lean()
        findBusiness.personalInfomation.avatar = req.user?.avatar
        console.log(findBusiness.personalInfomation)
      return res.status(200).json(findBusiness);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export const searchHotel = async (req, res) => {
  const {
    isSmokingAllowed = false,
    minRangePrice = 0,
    maxRangePrice = 1000000,
  } = req.body;
  let numRooms = 1;

  const searchHotel = {};
  //   if(req.body?.title){
  //     searchHotel.title = req.body.title
  //   }
  if (req.body?.name) {
    searchHotel.name = req.body.name;
  }
  if (req.body?.city) {
    searchHotel.city = req.body.city;
  }
  if (req.body?.address) {
    searchHotel.address = req.body.address;
  }
  if (req.body?.ranking) {
    searchHotel.ranking = req.body.ranking;
  }
  if (req.body?.amenities) {
    searchHotel.amenities = { $in: [...req.body.amenities] };
  }
  
  const searchRooms = {
    isAvailable: true,
    totalPrice: { $lte: maxRangePrice, $gte: minRangePrice },
    isSmokingAllowed: isSmokingAllowed
  };
  
  if (req.body?.typeRoom) {
    searchRooms.type = req.body.typeRoom;
  }
  if (req.body?.title) {
    searchRooms.title = req.body.title;
  }
  if (req.body?.maxOccupancy) {
    searchRooms.maxOccupancy = req.body.maxOccupancy;
  }
  if(req.body?.checkInTime && req.body?.checkOutTime){
    numRooms = (new Date(req.body?.checkOutTime).getTime() - new Date(req.body?.checkInTime).getTime()) / 86400000 // 1 ngày tính theo giây
    // console.log(numRooms)
  }
  // req.body?.numRight ? req.body.numRight : 1,
  const findHotel = await Hotel.aggregate([
    { $match: searchHotel },
    {
      $lookup: {
        from: "rooms",
        localField: "rooms",
        foreignField: "_id",
        as: "rooms",
        pipeline: [
          {
            $addFields: {
              totalPrice: {
                $multiply: [
                  "$pricePerNight",
                  numRooms
                ],
              },
            },
            
          },
          { $match: searchRooms },
          {
            $project: { createdAt: 0, updatedAt: 0 },
          },
        ],
      },
    },
  ]);
  res.json(findHotel);
};



export const getIdHotel = async (req, res) => {
  const { id: hotelId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return res
      .status(400)
      .json({ message: "Truy vấn không hợp lệ (Bad Request)" });
  }
  try {
    const findHotel = await Hotel.findById(hotelId)
      .populate({
        path: "rooms",
        select: "-createdAt -updatedAt",
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

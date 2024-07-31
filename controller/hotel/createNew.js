import sharp from "sharp";
import Business from "../../models/business.js";
import Hotel from "../../models/hotels.js";
import { imagekit } from "../../util/imageKit.js";

export const createNewHotel = async (req, res) => {
  try {
    if (
      !req.body?.name ||
      !req.body?.country ||
      !req.body?.city ||
      !req.body?.address ||
      !req.body?.description ||
      !req.body?.ranking
    ) {
      return res
        .status(412)
        .json({ message: "Dữ liệu không đủ để thêm khách sạn" });
    }
    const business = req?.business
      ? await Business.findById(req.business)
      : await Business.findOne({ user: req.user.id });
    if (!business) {
      return res.status(401).json({ message: "logic code wrong something" });
    }
    if (req?.files['files']) {
      const files = req.files['files'];
      const uploadPromises = files.map((file) => {
        return imagekit.upload({
          file: file.buffer, // required
          fileName: "hotel.jpg", // required
        });
      });
      const results = await Promise.all(uploadPromises)
      req.body.imageList = results.map(result => result.url)
    }
    if (req?.file || req?.files['file']) {
      const file = req?.file ? req.file : req.files['file'][0]
      const fileSizeInByte = file.buffer.length / (1024 * 1024);
      if (fileSizeInByte > 1) {
        return res
          .status(412)
          .json({ message: "Kích thước hình ảnh lớn hơn 1MB" });
      } else {
        const processedImage = await sharp(file.buffer)
          .resize({ width: 600, height: 300 })
          .toBuffer();
        req.body.image = await imagekit.upload({
          file: processedImage.toString("base64"),
          fileName: "hotel.jpg",
        });
      }
    }
    if(req.body?.amenities){
      req.body.amenities = JSON.parse(req.body.amenities)
    }
    const newHotel = new Hotel({
      ...req.body,
      image: req.body?.image?.url,
      ofBusiness: business._id,
      imageList: req?.body?.imageList,
      amenities: req.body.amenities
    });
    await newHotel.save();
    return res.status(200).json({ message: "Khách sạn đã được thêm" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

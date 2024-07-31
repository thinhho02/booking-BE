import axios from "axios";
import sharp from "sharp";
import User from "../../models/users.js";
import { imagekit } from "../../util/imageKit.js";

export const updateUser = async (req, res) => {
  if (req.user) {
    try {
      const errorInput = {};
      let resNumberPhone;
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        return res.status(401).json({ message: "can found id in db" });
      }
      if (req?.file) {
        const fileSizeInByte = req.file.buffer.length / (1024 * 1024);
        if (fileSizeInByte > 1) {
          errorInput.file = "Kích thước hình ảnh lớn hơn 1MB";
        } else {
          const processedImage = await sharp(req.file.buffer)
            .resize({ width: 100, height: 100 })
            .toBuffer();
          req.file.avatar = await imagekit.upload({
            file: processedImage.toString("base64"),
            fileName: "name.jpg",
          });
        }
      }
      if (req.body?.birthDate) {
        const checkYear = new Date();
        if (checkYear.getFullYear() - req.body.birthDate.year < 14) {
          errorInput.year = "Tuổi phải lớn hơn 15!!";
        }
      }
      if (req.body?.numberPhone) {
        resNumberPhone = await axios.get(
          `https://phonevalidation.abstractapi.com/v1/?api_key=20a2c4ec3e16437bb88ee0517179f4bf&phone=${req.body.numberPhone}`
        );
        if (!resNumberPhone.data.valid) {
          errorInput.numberPhone = "Số điện thoại không tồn tại";
        }
      }

      if (errorInput?.year || errorInput?.numberPhone || errorInput?.file) {
        return res.status(412).json({ message: errorInput });
      }
      const updateUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          firstName: req.body?.firstName,
          lastName: req.body?.lastName,
          numberPhone: req.body?.numberPhone
            ? resNumberPhone.data.format.international
            : undefined,
          birthDate: req.body?.birthDate,
          avatar: req?.file?.avatar?.url,
          password: req.body?.password,
        },
        { new: true }
      );
      console.log(updateUser);
      res.status(200).json({
        message: "Cập nhật thành công",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(401).json({
      message: "you not auth yet",
    });
  }
};

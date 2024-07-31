import Business from "../../models/business.js";
import User from "../../models/users.js";
import { sendMail } from "../configEmail/transporter.js";
import { imagekit } from "../../util/imageKit.js";

export const registerBusiness = async (req, res, next) => {
  if (req.user) {
    try {
      const findUser = await User.findById(req.user.id);
      if (!findUser) {
        return res.status(401).json({ message: "can found id in db" });
      }
      // Step 1
      if (req.body?.idNumber) {
        const personalInfomation = {
          name: req.body.name,
          idNumber: req.body.idNumber,
          email: req.body.email,
          numberPhone: req.body.numberPhone,
        };
        const stepOneCreate = new Business({
          personalInfomation,
          user: req.user.id,
          nameCompany: req.body.nameCompany,
        });
        await stepOneCreate.save()
        const updateUser = await User.findByIdAndUpdate(
          req.user.id,
          {
            business: [...(findUser?.business || []), stepOneCreate._id],
            roles: findUser.roles.some((role) => role === "business")
              ? [...findUser.roles]
              : [...findUser.roles, "business"],
          },
          { new: true }
        );
        console.log(updateUser);
        return res.status(200).json({ message: "Hoàn thành bước 1" });
      }

      // step 2
      if (req.body?.taxCode) {
        if (req?.file) {
          const { url } = await imagekit.upload({
            file: req.file.buffer.toString("base64"),
            fileName: "businessLicense.jpg",
          });

          const findBusiness = await Business.findOneAndUpdate(
            { user: req.user.id },
            { ...req.body, businessLicense: url },
            { new: true }
          );
          console.log(findBusiness);
          return res.status(200).json({ message: "Hoàn thành bước 2" });
        } else {
          return res
            .status(412)
            .json({ message: "Không có giấy phép kinh doanh" });
        }
      }
      // step 3 complete
      const completeRegisBusiness = await Business.findOneAndUpdate(
        { user: req.user.id },
        { businessType: req.body.businessType },
        { new: true }
      );
      // const userTest = await User.findById(req.userId).populate({ path: "business", select:"nameCompany address businessType -_id"}).exec()
        const context =
          "<h3>Cảm ơn bạn đã tham gia và trở thành doanh nghiệp của Saphire!</h3>" +
          "<div style='margin-top: 10px'>Chúng tôi sẽ phản hồi chậm nhất sau 48h (không kể thứ 7, chủ nhật và ngày lễ)</div>";
        await sendMail({
          to: findUser.email,
          subject: "Cảm ơn bạn đã đăng ký doanh nghiệp của Saphire",
          text: context,
        });
      if (req.body?.hotel) {
        console.log(JSON.parse(req.body.hotel))
        req.body = JSON.parse(req.body.hotel);
        req.business = completeRegisBusiness._id;
        return next();
      }
      return res.status(200).json({
        message: "Đăng ký doanh nghiệp thành công",
        success: "ok",
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

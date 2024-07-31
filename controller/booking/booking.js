import Book from "../../models/booking.js";
import { sendMail } from "../configEmail/transporter.js";

export const booking = async (req, res) => {
  if (req.user) {
    console.log(req.body);
    try {
      const booked = new Book({
        room: req.body?.room,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        user: req.user.id,
        status: "pending",
        sumPeople: req.body.sumPeople,
        price: req.body.price
      });
      const send = await sendMail({
        to: req.user.email,
        subject: "Đặt thành công",
        text: "Cảm ơn quý khách đã đặt. Chúng tôi sẽ liên hệ với quý khách trong thời gian sớm nhất để xác nhận lại thông tin và thanh toán.",
      });
      if (send?.messageId) {
        await booked.save();
      }
      return res.status(200).json(booked);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};

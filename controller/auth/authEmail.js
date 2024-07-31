import genarateToken from "../../config/genarateToken.js";
import genarateRefreshToken from "../../config/refreshToken.js";
import User from "../../models/users.js";
import { sendMail } from "../configEmail/transporter.js";
import crypto from "crypto";

export const authEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser)
      return res
        .status(412)
        .json({ message: "Email không tìm thấy hoặc chưa được sử dụng" });
    if (findUser?.googleID)
      return res
        .status(412)
        .json({ message: "Email đã được sử dụng để đăng nhập Google" });
    if (findUser.isBlocked){
      return res.status(401).json({message: "Tài khoản của bạn đã bị khóa"})
    }
    const otp = Math.floor(Math.random() * 900000 + 100000);
    const context = `<h3>Mã otp là <i style="color: red">${otp}</i></h3>`;
    const otpCreateAt = Date.now();
    const otpExpires = Date.now() + 2 * 60 * 1000; // 2 phút
    const send = await sendMail({
      to: email,
      subject: "Resort-App-OTP Verification",
      text: context,
    });
    if (send?.messageId) {
      await User.findByIdAndUpdate(findUser._id, {
        otp,
        otpCreateAt,
        otpExpires,
      });
      res.status(200).json({ message: "OTP gửi thành công" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const authOtp = async (req, res) => {
  const { otp } = req.body;
  try {
    const findOtp = await User.findOne({
      otp,
      otpCreateAt: { $lt: Date.now() },
      otpExpires: { $gt: Date.now() },
    });
    // console.log(findOtp)
    if (!findOtp) {
      return res.status(401).json({ message: "Mã Otp sai hoặc đã hết hạn" });
    }
    const cryptoToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256", { hmacKey: process.env.PASSWORD_TOKEN })
      .update(cryptoToken)
      .digest("hex");
    await User.findByIdAndUpdate(findOtp._id, {
      passwordResetToken,
    });
    return res
      .status(200)
      .cookie("passwordResetToken", passwordResetToken, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .json({
        message: "Xác thực thành công",
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  const { passwordResetToken } = req.cookies;
  try {
    if (!passwordResetToken) {
      return res.status(401).json({ message: "PasswordResetToken Expired" });
    }
    const findTokenPassword = await User.findOne({ passwordResetToken });
    if (!findTokenPassword) {
      return res
        .status(401)
        .json({ message: "passwordResetToken wrong something" });
    }
    const { password } = req.body;
    const refreshToken = genarateRefreshToken(findTokenPassword._id)
    const changed = await User.findByIdAndUpdate(findTokenPassword._id,{
      password,
      otp : undefined,
      otpCreateAt : undefined,
      otpExpires : undefined,
      passwordResetToken : undefined,
      refreshToken
    },{new:true})
    
    
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .clearCookie("passwordResetToken", {
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .json({
        message: "Thay đổi mật khẩu thành công",
        accessToken: genarateToken(changed._id),
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

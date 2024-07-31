import Jwt from "jsonwebtoken";
import User from "../models/users.js";
import mongoose from "mongoose";
import Business from "../models/business.js";

export const verifyToken = async (req, res, next) => {
  let accessToken;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      accessToken = req.headers.authorization.split(" ")[1];
      const decoded = await new Promise((resolve, reject) => {
        Jwt.verify(accessToken, process.env.JWT_KEY, (err, decode) => {
          if (err) {
            return res.status(401).json({ message: err.message });
          } else resolve(decode);
        });
      });
      const user = mongoose.Types.ObjectId.isValid(decoded.id)
        ? await User.findOne({ _id: decoded.id })
        : await User.findOne({ googleID: decoded.id });
      // const user = await User.findOne({
      //   $or: [{ id: decode.info.id }, { googleID: decode.info.id }],
      // });
      if (!user) {
        return res.status(401).json({ message: "authenzation failed" });
      }
      req.user = {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        roles: user.roles,
        isAdmin: user.isAdmin,
        avatar: user?.avatar
      };
      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};

export const isBusiness = async (req, res, next) => {
  // console.log(req.user)
  if (req.user) {
    if (req.user.roles.some((role) => role === "business")) {
      const findBusiness = await Business.findOne({ user: req.user.id });
      if (findBusiness.isConfirm) {
        next();
      } else {
        res
          .status(401)
          .json({
            message: "Tài khoản doanh nghiệp của bạn đang chờ xác thực",
          });
      }
    } else {
      res.status(401).json({ message: "Bạn không phải là doanh nghiệp" });
    }
  }
};



export const isAdmin = async (req, res, next) =>{
  if (req.user) {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: "Bạn không phải là Admin ok" });
    }
  }
}

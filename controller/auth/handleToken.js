import Jwt from "jsonwebtoken";
import User from "../../models/users.js";
import mongoose from "mongoose";

export const handleToken = async (req, res) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      let accessToken = req.headers.authorization.split(" ")[1];
      const decoded = await new Promise((resolve, reject) => {
        Jwt.verify(accessToken, process.env.JWT_KEY, (err, decode) => {
          if (err) {
            return res.status(401).json({ message: err.message });
          } else resolve(decode);
        });
      });
      // console.log(decoded);
      const user = mongoose.Types.ObjectId.isValid(decoded.id)
        ? await User.findOne({ _id: decoded.id })
        : await User.findOne({ googleID: decoded.id });

      if (!user) {
        return res.status(401).json({ message: "authenzation failed" });
      }
      return res.status(200).json({
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        numberPhone: user?.numberPhone,
        avatar: user?.avatar,
        roles: user.roles,
        isAdmin: user.isAdmin,
        birthDate: user.birthDate
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  } else {
    res.status(200).json({ message: "loginFail" });
  }
};

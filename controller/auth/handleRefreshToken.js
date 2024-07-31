import Jwt from "jsonwebtoken";
import User from "../../models/users.js";
import genarateRefreshToken from "../../config/refreshToken.js";
import genarateToken from "../../config/genarateToken.js";

export const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  try {
    if (!refreshToken) {
      return res.status(401).json({ message: "RefreshToken not found" });
    }
    const decodedToken = await new Promise((resolve, reject) => {
      Jwt.verify(refreshToken, process.env.JWT_KEY, (err, decode) => {
        if (err) {
          return res.status(401).json({ message: err.message });
        } else resolve(decode);
      });
    });

    if (!decodedToken.id) {
      return res.status(401).json({ message: "RefreshToken no authorization" });
    }
    const findToken = await User.findOne({ refreshToken });
    if (!findToken) {
      return res.status(401).json({ message: "RefreshToken no authorization" });
    }

    const newRefreshToken = genarateRefreshToken(findToken._id);
    await User.findByIdAndUpdate(findToken._id, {
      refreshToken: newRefreshToken,
    });
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .json({
        accessToken: genarateToken(findToken._id),
        user: {
          id: findToken._id,
          email: findToken.email,
          name: `${findToken.firstName} ${findToken.lastName}`,
          numberPhone: findToken?.numberPhone,
          avatar: findToken?.avatar,
          roles: findToken.roles,
          isAdmin: findToken.isAdmin,
          birthDate: findToken.birthDate,
        },
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

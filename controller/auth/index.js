import { OAuth2Client } from "google-auth-library";
import genarateToken from "../../config/genarateToken.js";
import genarateRefreshToken from "../../config/refreshToken.js";
import User from "../../models/users.js";
import axios from "axios";
import qs from "qs";

// POST register user
export const signUp = async (req, res) => {
  try {
    const errorInput = {};
    if (req.body.password !== req.body.confirmPassword) {
      errorInput.password = "Mật khẩu không trùng khớp";
    }
    const resEmail = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=b990ef90090947968e8191c56b855318&email=${req.body.email}`
    );
    const resNumberPhone = await axios.get(
      `https://phonevalidation.abstractapi.com/v1/?api_key=20a2c4ec3e16437bb88ee0517179f4bf&phone=${req.body.numberPhone}`
    );
    if (resEmail.data.deliverability === "UNDELIVERABLE") {
      errorInput.email = "Email không tồn tại";
    }
    if (!resNumberPhone.data.valid) {
      errorInput.numberPhone = "Số điện thoại không tồn tại";
    }
    const findUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { numberPhone: resNumberPhone.data.format.international },
      ],
    });

    if (findUser) {
      if (findUser.email === req.body.email) {
        errorInput.email =
          findUser.signInWith === "Google"
            ? "Email đã sử dụng tài khoản Google để đăng ký"
            : "Email đã được sử dụng";
      }

      if (findUser.numberPhone === resNumberPhone.data.format.international) {
        errorInput.numberPhone = "Số điện thoại đã được sử dụng";
      }
    }
    if (errorInput?.email || errorInput?.numberPhone || errorInput?.password) {
      return res.status(412).json({ message: errorInput });
    }
    // req.body.numberPhone = resNumberPhone.data.format.international;
    // console.log(req.body)

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      numberPhone: resNumberPhone.data.format.international,
      password: req.body.password,
    });
    const refreshToken = genarateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .json({
        success: "Đăng ký thành công",
        accessToken: genarateToken(user._id),
      });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

// POST Login user
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser.googleID) {
      return res
        .status(412)
        .json({ message: "Email đã sử dụng tài khoản Google để đăng ký" });
    }
    if (findUser && (await findUser.isPasswordMatch(password))) {
      if(findUser.isBlocked){
        return res.status(401).json({message: "Tài khoản của bạn đã bị khóa"})
      }
      const refreshToken = genarateRefreshToken(findUser._id);
      await User.findByIdAndUpdate(findUser._id, { refreshToken });
      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          maxAge: 15 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          domain: "localhost",
          path: "/",
        })
        .json({
          accessToken: genarateToken(findUser._id),
        });
    } else {
      return res.status(400).json({
        message: "Email hoặc Mật khẩu không hợp lệ",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST authGoogle
export const authGoogle = async (req, res) => {
  const { code } = req.body;
  // console.log(code)
  // Oauth2.0 google
  const data = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:5000",
    grant_type: "authorization_code",
  };
  try {
    const token = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify(data)
    );

    const googleClient = new OAuth2Client(data.client_id, data.client_secret);
    const ticket = await googleClient.verifyIdToken({
      idToken: token.data.id_token,
      audience: data.client_id,
    });
    const payload = ticket.getPayload();
    const refreshToken = genarateRefreshToken(payload.sub);

    const findUser = await User.findOne({ email: payload.email });
    // check invalid and already exists
    if (findUser) {
      if(findUser.isBlocked){
        return res.status(401).json({ message: "Tài khoản của bạn đã bị khóa" });
      }
      if (findUser.signInWith === "Normal") {
        return res.status(400).json({ message: "Email đã được đăng ký" });
      }
      await User.findOneAndUpdate(
        { googleID: findUser.googleID },
        {
          refreshToken,
        },
        { new: true }
      );

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          maxAge: 15 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          domain: "localhost",
          path: "/",
        })
        .json({
          accessToken: genarateToken(findUser.googleID),
        });
    }
    const user = await new User({
      firstName: payload.family_name,
      lastName: payload.given_name,
      email: payload.email,
      avatar: payload.picture,
      googleID: payload.sub,
      signInWith: "Google",
      roles: "User",
      refreshToken,
    }).save();

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        domain: "localhost",
        path: "/",
      })
      .json({
        accessToken: genarateToken(user.googleID),
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      domain: "localhost",
      path: "/",
    })
    .json({ message: "Đăng xuất thành công" });
};

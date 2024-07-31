import Jwt from "jsonwebtoken";

const genarateRefreshToken = (data) => {
  return Jwt.sign({ id: data }, process.env.JWT_KEY, { expiresIn: "14d" } );
};

export default genarateRefreshToken;

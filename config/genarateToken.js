import Jwt from "jsonwebtoken";

const genarateToken = (data) => {

  return Jwt.sign({ id: data }, process.env.JWT_KEY, { expiresIn: "3d" });
};

export default genarateToken;

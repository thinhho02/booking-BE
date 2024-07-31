import express from "express";
import { createNewHotel } from "../../controller/hotel/createNew.js";
import { isBusiness, verifyToken } from "../../middleware/vertifyToken.js";
import { updateHotel } from "../../controller/hotel/updateHotel.js";
import { deleteHotel } from "../../controller/hotel/deleteHotel.js";
import { getHotelOfBusiness, getIdHotel, searchHotel } from "../../controller/hotel/getHotel.js";
import { upload } from "../../util/imageKit.js";

const hotelRouter = express.Router();

// Create new hotel
hotelRouter.post("/new",upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 10 }]) ,verifyToken, isBusiness, createNewHotel);

hotelRouter.put("/:id", verifyToken, isBusiness, updateHotel);

hotelRouter.delete("/:id", verifyToken, isBusiness, deleteHotel);

// Get all Hotel of Business
hotelRouter.get("/",verifyToken, isBusiness, getHotelOfBusiness);

hotelRouter.post("/searchHotel",searchHotel)

hotelRouter.get("/:id",getIdHotel)

export default hotelRouter;

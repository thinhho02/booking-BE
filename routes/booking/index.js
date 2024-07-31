import express from "express";
import { booking } from "../../controller/booking/booking.js";
import { verifyToken } from "../../middleware/vertifyToken.js";


const bookingRouter = express.Router();

bookingRouter.post("/create", verifyToken, booking);



export default bookingRouter;
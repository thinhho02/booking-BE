import express from 'express';
import authRouter from './auth/index.js';
import hotelRouter from './hotel/index.js';
import roomRouter from './room/index.js';
import reviewRouter from './review/index.js';
import businessRouter from './business/index.js';
import bookingRouter from './booking/index.js';

const router = express.Router();

// login Register handleToken
router.use("/auth", authRouter)

// RESTFUL hotel
router.use("/hotel", hotelRouter)

// RESTFUL room for per {id} hotel
router.use("/hotel/:id/room", roomRouter)

// RESTFUL review for per {id} hotel
router.use("/hotel/:id/review", reviewRouter)



router.use("/business", businessRouter)

router.use("/booking",bookingRouter)



// 

export default router;